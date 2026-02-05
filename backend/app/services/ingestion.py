"""Document ingestion and processing service."""
import os
import uuid
from datetime import datetime
from typing import List, Optional, Tuple

from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document import ContentType, Document, DocumentChunk
from app.models.user import PracticeArea
from app.services.embeddings import embedding_service
from app.services.vector_store import vector_store


class IngestionService:
    """Service for ingesting and processing documents."""
    
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
        )
    
    async def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text content from a PDF file."""
        reader = PdfReader(file_path)
        text_parts = []
        
        for page in reader.pages:
            text = page.extract_text()
            if text:
                text_parts.append(text)
        
        return "\n\n".join(text_parts)
    
    async def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from a file based on its extension."""
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".pdf":
            return await self.extract_text_from_pdf(file_path)
        elif ext in [".txt", ".md"]:
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        else:
            raise ValueError(f"Unsupported file type: {ext}")
    
    def chunk_text(self, text: str) -> List[Tuple[str, int, int]]:
        """Split text into chunks with character positions."""
        chunks = self.text_splitter.split_text(text)
        
        result = []
        current_pos = 0
        
        for chunk in chunks:
            # Find the chunk in the original text
            start_pos = text.find(chunk[:50], current_pos)
            if start_pos == -1:
                start_pos = current_pos
            
            end_pos = start_pos + len(chunk)
            result.append((chunk, start_pos, end_pos))
            current_pos = start_pos + 1
        
        return result
    
    async def ingest_document(
        self,
        db: AsyncSession,
        file_path: str,
        title: str,
        practice_area_id: int,
        content_type: ContentType = ContentType.ARTICLE,
        description: Optional[str] = None,
        author: Optional[str] = None,
        source_url: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> Document:
        """Ingest a document: extract text, chunk, embed, and store."""
        
        # Verify practice area exists
        result = await db.execute(
            select(PracticeArea).where(PracticeArea.id == practice_area_id)
        )
        practice_area = result.scalar_one_or_none()
        if not practice_area:
            raise ValueError(f"Practice area {practice_area_id} not found")
        
        # Extract text
        full_text = await self.extract_text_from_file(file_path)
        
        # Get file info
        file_name = os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        
        # Create document record
        document = Document(
            title=title,
            description=description or full_text[:500],
            content_type=content_type,
            practice_area_id=practice_area_id,
            file_path=file_path,
            file_name=file_name,
            file_size_bytes=file_size,
            source_url=source_url,
            author=author,
            published_at=datetime.utcnow(),
            metadata=metadata or {},
        )
        
        db.add(document)
        await db.flush()  # Get the document ID
        
        # Chunk the text
        chunks = self.chunk_text(full_text)
        
        # Generate embeddings for all chunks
        chunk_texts = [chunk[0] for chunk in chunks]
        embeddings = await embedding_service.generate_embeddings(chunk_texts)
        
        # Prepare vectors for ChromaDB
        vector_ids = []
        vector_documents = []
        vector_metadatas = []
        
        for idx, (chunk_text, start_char, end_char) in enumerate(chunks):
            vector_id = embedding_service.generate_vector_id(
                chunk_text, str(document.id), idx
            )
            
            # Create chunk record in database
            chunk = DocumentChunk(
                document_id=document.id,
                content=chunk_text,
                chunk_index=idx,
                vector_id=vector_id,
                start_char=start_char,
                end_char=end_char,
                metadata={
                    "title": title,
                    "practice_area": practice_area.name,
                },
            )
            db.add(chunk)
            
            # Prepare for vector store
            vector_ids.append(vector_id)
            vector_documents.append(chunk_text)
            vector_metadatas.append({
                "document_id": str(document.id),
                "chunk_index": idx,
                "practice_area_id": practice_area_id,
                "practice_area_name": practice_area.name,
                "title": title,
                "content_type": content_type.value,
            })
        
        # Store in vector database
        await vector_store.add_documents(
            ids=vector_ids,
            embeddings=embeddings,
            documents=vector_documents,
            metadatas=vector_metadatas,
        )
        
        await db.commit()
        await db.refresh(document)
        
        return document
    
    async def ingest_text(
        self,
        db: AsyncSession,
        text: str,
        title: str,
        practice_area_id: int,
        content_type: ContentType = ContentType.ARTICLE,
        description: Optional[str] = None,
        author: Optional[str] = None,
        source_url: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> Document:
        """Ingest raw text content (for articles, transcripts, etc.)."""
        
        # Verify practice area exists
        result = await db.execute(
            select(PracticeArea).where(PracticeArea.id == practice_area_id)
        )
        practice_area = result.scalar_one_or_none()
        if not practice_area:
            raise ValueError(f"Practice area {practice_area_id} not found")
        
        # Create document record
        document = Document(
            title=title,
            description=description or text[:500],
            content_type=content_type,
            practice_area_id=practice_area_id,
            source_url=source_url,
            author=author,
            published_at=datetime.utcnow(),
            metadata=metadata or {},
        )
        
        db.add(document)
        await db.flush()
        
        # Chunk the text
        chunks = self.chunk_text(text)
        
        # Generate embeddings
        chunk_texts = [chunk[0] for chunk in chunks]
        embeddings = await embedding_service.generate_embeddings(chunk_texts)
        
        # Prepare vectors
        vector_ids = []
        vector_documents = []
        vector_metadatas = []
        
        for idx, (chunk_text, start_char, end_char) in enumerate(chunks):
            vector_id = embedding_service.generate_vector_id(
                chunk_text, str(document.id), idx
            )
            
            chunk = DocumentChunk(
                document_id=document.id,
                content=chunk_text,
                chunk_index=idx,
                vector_id=vector_id,
                start_char=start_char,
                end_char=end_char,
                metadata={
                    "title": title,
                    "practice_area": practice_area.name,
                },
            )
            db.add(chunk)
            
            vector_ids.append(vector_id)
            vector_documents.append(chunk_text)
            vector_metadatas.append({
                "document_id": str(document.id),
                "chunk_index": idx,
                "practice_area_id": practice_area_id,
                "practice_area_name": practice_area.name,
                "title": title,
                "content_type": content_type.value,
            })
        
        await vector_store.add_documents(
            ids=vector_ids,
            embeddings=embeddings,
            documents=vector_documents,
            metadatas=vector_metadatas,
        )
        
        await db.commit()
        await db.refresh(document)
        
        return document
    
    async def delete_document(self, db: AsyncSession, document_id: uuid.UUID) -> bool:
        """Delete a document and its chunks from both DB and vector store."""
        result = await db.execute(
            select(Document).where(Document.id == document_id)
        )
        document = result.scalar_one_or_none()
        
        if not document:
            return False
        
        # Delete from vector store
        await vector_store.delete_by_document_id(str(document_id))
        
        # Delete from database (cascades to chunks)
        await db.delete(document)
        await db.commit()
        
        return True


# Singleton instance
ingestion_service = IngestionService()
