"""Document and search schemas."""
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.document import ContentType


class DocumentUploadRequest(BaseModel):
    """Document upload request (for text content)."""
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    practice_area_id: int
    content_type: ContentType = ContentType.ARTICLE
    description: Optional[str] = None
    author: Optional[str] = None
    source_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class DocumentResponse(BaseModel):
    """Document response."""
    id: UUID
    title: str
    description: Optional[str]
    content_type: ContentType
    practice_area_id: int
    file_name: Optional[str]
    file_size_bytes: Optional[int]
    source_url: Optional[str]
    author: Optional[str]
    published_at: Optional[datetime]
    created_at: datetime
    chunk_count: int = 0

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """List of documents."""
    documents: List[DocumentResponse]
    total: int
    page: int
    page_size: int


class SearchRequest(BaseModel):
    """Search request."""
    query: str = Field(..., min_length=1, max_length=1000)
    practice_area_ids: Optional[List[int]] = None
    content_types: Optional[List[ContentType]] = None
    limit: int = Field(default=10, ge=1, le=50)


class SearchResult(BaseModel):
    """Individual search result."""
    document_id: str
    title: str
    content_preview: str
    practice_area: str
    content_type: str
    similarity: float
    published_at: Optional[datetime] = None


class SearchResponse(BaseModel):
    """Search response."""
    results: List[SearchResult]
    query: str
    total_results: int
