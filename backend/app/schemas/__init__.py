"""Pydantic schemas."""
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    RefreshTokenRequest,
    PasswordChangeRequest,
    PracticeAreaResponse,
    UserResponse,
    TokenResponse,
    AuthResponse,
    MessageResponse as AuthMessageResponse,
)
from app.schemas.user import (
    UserUpdateRequest,
    UserPracticeAreaUpdateRequest,
    UserCreateRequest,
)
from app.schemas.chat import (
    ChatMessageRequest,
    SourceCitation,
    ChatMessageResponse,
    MessageResponse,
    ConversationResponse,
    ConversationListResponse,
    ConversationCreateRequest,
)
from app.schemas.document import (
    DocumentUploadRequest,
    DocumentResponse,
    DocumentListResponse,
    SearchRequest,
    SearchResult,
    SearchResponse,
)

__all__ = [
    # Auth
    "UserRegisterRequest",
    "UserLoginRequest",
    "RefreshTokenRequest",
    "PasswordChangeRequest",
    "PracticeAreaResponse",
    "UserResponse",
    "TokenResponse",
    "AuthResponse",
    "AuthMessageResponse",
    # User
    "UserUpdateRequest",
    "UserPracticeAreaUpdateRequest",
    "UserCreateRequest",
    # Chat
    "ChatMessageRequest",
    "SourceCitation",
    "ChatMessageResponse",
    "MessageResponse",
    "ConversationResponse",
    "ConversationListResponse",
    "ConversationCreateRequest",
    # Document
    "DocumentUploadRequest",
    "DocumentResponse",
    "DocumentListResponse",
    "SearchRequest",
    "SearchResult",
    "SearchResponse",
]
