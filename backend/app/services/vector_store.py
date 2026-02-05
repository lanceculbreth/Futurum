"""Vector database service using ChromaDB."""
import os
from typing import List, Optional, Dict, Any
from uuid import UUID

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings


class VectorStore:
    """Vector store service using ChromaDB."""
    
    def __init__(self):
        # Ensure directory exists
        os.makedirs(settings.CHROMA_PERSIST_DIRECTORY, exist_ok=True)
        
        # Initialize ChromaDB client with persistence
        self.client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        
        # Create or get the main collection
        self.collection = self.client.get_or_create_collection(
            name="futurum_documents",
            metadata={"hnsw:space": "cosine"},
        )
    
    async def add_documents(
        self,
        ids: List[str],
        embeddings: List[List[float]],
        documents: List[str],
        metadatas: List[Dict[str, Any]],
    ) -> None:
        """Add documents to the vector store."""
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas,
        )
    
    async def query(
        self,
        query_embedding: List[float],
        n_results: int = 5,
        practice_area_ids: Optional[List[int]] = None,
    ) -> Dict[str, Any]:
        """Query the vector store with optional practice area filtering."""
        where_filter = None
        if practice_area_ids:
            where_filter = {"practice_area_id": {"$in": practice_area_ids}}
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where_filter,
            include=["documents", "metadatas", "distances"],
        )
        
        return {
            "ids": results["ids"][0] if results["ids"] else [],
            "documents": results["documents"][0] if results["documents"] else [],
            "metadatas": results["metadatas"][0] if results["metadatas"] else [],
            "distances": results["distances"][0] if results["distances"] else [],
        }
    
    async def delete_by_document_id(self, document_id: str) -> None:
        """Delete all chunks for a document."""
        self.collection.delete(
            where={"document_id": document_id}
        )
    
    async def get_collection_stats(self) -> Dict[str, Any]:
        """Get collection statistics."""
        return {
            "count": self.collection.count(),
            "name": self.collection.name,
        }


# Singleton instance
vector_store = VectorStore()
