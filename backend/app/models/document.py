"""Document and content models."""
import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class ContentType(str, Enum):
    """Types of content that can be stored."""
    RESEARCH_REPORT = "research_report"
    ARTICLE = "article"
    MARKET_DATA = "market_data"
    VIDEO_TRANSCRIPT = "video_transcript"
    PODCAST_TRANSCRIPT = "podcast_transcript"
    WHITEPAPER = "whitepaper"
    CASE_STUDY = "case_study"


class Document(Base):
    """Document model for storing content metadata."""
    
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    content_type = Column(SQLEnum(ContentType), nullable=False, default=ContentType.ARTICLE)
    
    # Practice area relationship
    practice_area_id = Column(Integer, ForeignKey("practice_areas.id"), nullable=False)
    practice_area = relationship("PracticeArea", back_populates="documents")
    
    # File information
    file_path = Column(String(1000), nullable=True)
    file_name = Column(String(255), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    
    # Source information
    source_url = Column(String(1000), nullable=True)
    author = Column(String(255), nullable=True)
    published_at = Column(DateTime, nullable=True)
    
    # Additional metadata (companies mentioned, tags, etc.)
    metadata = Column(JSONB, default=dict, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan", lazy="dynamic")
    
    def __repr__(self):
        return f"<Document {self.title[:50]}>"


class DocumentChunk(Base):
    """Document chunk model for storing vectorized content pieces."""
    
    __tablename__ = "document_chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    
    # Chunk content
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    
    # Vector database reference
    vector_id = Column(String(255), nullable=True, index=True)
    
    # Chunk metadata
    start_char = Column(Integer, nullable=True)
    end_char = Column(Integer, nullable=True)
    metadata = Column(JSONB, default=dict, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    document = relationship("Document", back_populates="chunks")
    
    def __repr__(self):
        return f"<DocumentChunk {self.id} (doc: {self.document_id}, idx: {self.chunk_index})>"
