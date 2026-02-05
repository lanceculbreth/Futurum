"""Embedding generation service."""
import hashlib
from typing import List

import openai

from app.core.config import settings


class EmbeddingService:
    """Service for generating text embeddings."""
    
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.EMBEDDING_MODEL
        self.dimension = 1536  # text-embedding-3-small dimension
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        response = self.client.embeddings.create(
            model=self.model,
            input=text,
        )
        return response.data[0].embedding
    
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        response = self.client.embeddings.create(
            model=self.model,
            input=texts,
        )
        return [item.embedding for item in response.data]
    
    @staticmethod
    def generate_vector_id(text: str, document_id: str, chunk_index: int) -> str:
        """Generate a unique vector ID for a chunk."""
        content = f"{document_id}:{chunk_index}:{text[:100]}"
        return hashlib.sha256(content.encode()).hexdigest()[:32]


# Singleton instance
embedding_service = EmbeddingService()
