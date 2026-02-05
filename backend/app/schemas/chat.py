"""Chat and conversation schemas."""
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    """Chat message request."""
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: Optional[UUID] = None


class SourceCitation(BaseModel):
    """Source citation in a response."""
    document_id: Optional[str] = None
    title: str
    practice_area: str
    content_type: str
    content_preview: str = Field(..., max_length=500)
    similarity: float


class ChatMessageResponse(BaseModel):
    """Chat message response."""
    response: str
    conversation_id: UUID
    sources: List[SourceCitation]
    usage: Dict[str, int]


class MessageResponse(BaseModel):
    """Individual message in a conversation."""
    id: UUID
    role: str
    content: str
    citations: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    """Conversation response."""
    id: UUID
    title: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    """List of conversations."""
    conversations: List[ConversationResponse]


class ConversationCreateRequest(BaseModel):
    """Create conversation request."""
    title: Optional[str] = None
