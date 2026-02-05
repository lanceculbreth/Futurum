"""RAG (Retrieval-Augmented Generation) service."""
from typing import AsyncGenerator, List, Optional, Dict, Any
from uuid import UUID

import anthropic
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document import Document, DocumentChunk
from app.models.conversation import Conversation, Message, MessageRole
from app.models.user import User
from app.services.embeddings import embedding_service
from app.services.vector_store import vector_store


class RAGService:
    """Service for retrieval-augmented generation with Claude."""
    
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.CLAUDE_MODEL
    
    async def retrieve_context(
        self,
        query: str,
        practice_area_ids: List[int],
        n_results: int = 5,
    ) -> List[Dict[str, Any]]:
        """Retrieve relevant document chunks for a query."""
        # Generate query embedding
        query_embedding = await embedding_service.generate_embedding(query)
        
        # Search vector store
        results = await vector_store.query(
            query_embedding=query_embedding,
            n_results=n_results,
            practice_area_ids=practice_area_ids if practice_area_ids else None,
        )
        
        # Format results
        contexts = []
        for idx, doc in enumerate(results["documents"]):
            metadata = results["metadatas"][idx] if results["metadatas"] else {}
            contexts.append({
                "content": doc,
                "document_id": metadata.get("document_id"),
                "title": metadata.get("title", "Unknown"),
                "practice_area": metadata.get("practice_area_name", "Unknown"),
                "content_type": metadata.get("content_type", "article"),
                "similarity": 1 - results["distances"][idx] if results["distances"] else 0,
            })
        
        return contexts
    
    def _build_system_prompt(self, contexts: List[Dict[str, Any]]) -> str:
        """Build the system prompt with retrieved context."""
        context_text = ""
        for idx, ctx in enumerate(contexts, 1):
            context_text += f"""
[Source {idx}]
Title: {ctx['title']}
Practice Area: {ctx['practice_area']}
Content Type: {ctx['content_type']}
---
{ctx['content']}
---

"""
        
        system_prompt = f"""You are an AI research assistant for The Futurum Group—a modern alternative to legacy analyst firms like Gartner or Forrester. You provide real-time, AI-driven insights rather than static annual reports.

About The Futurum Group:
- Specializes in high-growth sectors: AI, cloud computing, cybersecurity, semiconductors, and enterprise software
- Operates through four pillars: Analyze (Futurum Intelligence platform), Advise (strategic consulting), Amplify (media network), and Assess (Signal65 technical labs)
- Known for Futurum Signal: AI-powered vendor evaluation with continuous updates and predictive analytics
- Recognized leaders in Agentic AI strategy, helping enterprises move beyond AI hype to actionable implementation
- Trusted for cloud marketplace GTM strategy (AWS, Azure, GCP) and third-party performance validation

The Human + Machine Approach:
You represent Futurum's "analyst-grounded AI" philosophy—AI-generated insights validated and contextualized by expert analysts. You cut through the noise to deliver actionable intelligence, not automated noise.

You have access to the following research content relevant to the user's question:

{context_text}

Guidelines:
1. Provide REAL-TIME, ACTIONABLE insights—not generic summaries. Help users make decisions, not just understand topics.
2. When citing information, reference the source by title and practice area
3. Think like a strategic advisor to the C-Suite: CEOs, CIOs, and CTOs come to Futurum for roadmaps, not just reports
4. Connect insights to market dynamics: competitive positioning, vendor trajectories, and emerging opportunities
5. For AI-related questions, emphasize practical implementation paths—data readiness, agentic AI strategies, and ROI
6. For GTM questions, focus on cloud marketplace dynamics, partner ecosystems, and go-to-market execution
7. If the provided context is insufficient, acknowledge this honestly—Futurum's value is in accuracy, not volume
8. Break down complex topics with executive-level clarity: clear structure, key takeaways, and next steps

Remember: Customers choose Futurum over legacy analysts because they want forward-looking, predictive insights that help them act NOW—not retrospective documentation of what already happened.

Always cite your sources when providing specific facts, data points, or strategic insights."""

        return system_prompt
    
    async def generate_response(
        self,
        query: str,
        user: User,
        conversation: Optional[Conversation] = None,
        db: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        """Generate a response to a user query using RAG."""
        # Get user's practice area IDs
        practice_area_ids = [pa.id for pa in user.practice_areas]
        
        # Retrieve relevant context
        contexts = await self.retrieve_context(
            query=query,
            practice_area_ids=practice_area_ids,
            n_results=5,
        )
        
        # Build conversation history if available
        messages = []
        if conversation and conversation.messages:
            for msg in conversation.messages[-10:]:  # Last 10 messages
                messages.append({
                    "role": msg.role.value,
                    "content": msg.content,
                })
        
        # Add current query
        messages.append({
            "role": "user",
            "content": query,
        })
        
        # Build system prompt with context
        system_prompt = self._build_system_prompt(contexts)
        
        # Generate response with Claude
        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=system_prompt,
            messages=messages,
        )
        
        assistant_message = response.content[0].text
        
        # Extract cited document IDs
        cited_documents = [ctx["document_id"] for ctx in contexts if ctx["document_id"]]
        
        return {
            "response": assistant_message,
            "sources": contexts,
            "citations": cited_documents,
            "usage": {
                "input_tokens": response.usage.input_tokens,
                "output_tokens": response.usage.output_tokens,
            },
        }
    
    async def generate_response_stream(
        self,
        query: str,
        user: User,
        conversation: Optional[Conversation] = None,
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming response to a user query."""
        # Get user's practice area IDs
        practice_area_ids = [pa.id for pa in user.practice_areas]
        
        # Retrieve relevant context
        contexts = await self.retrieve_context(
            query=query,
            practice_area_ids=practice_area_ids,
            n_results=5,
        )
        
        # Build conversation history
        messages = []
        if conversation and conversation.messages:
            for msg in conversation.messages[-10:]:
                messages.append({
                    "role": msg.role.value,
                    "content": msg.content,
                })
        
        messages.append({
            "role": "user",
            "content": query,
        })
        
        # Build system prompt
        system_prompt = self._build_system_prompt(contexts)
        
        # Stream response from Claude
        with self.client.messages.stream(
            model=self.model,
            max_tokens=4096,
            system=system_prompt,
            messages=messages,
        ) as stream:
            for text in stream.text_stream:
                yield text
    
    async def save_conversation_turn(
        self,
        db: AsyncSession,
        conversation: Conversation,
        user_message: str,
        assistant_response: str,
        citations: List[str],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> tuple[Message, Message]:
        """Save a conversation turn (user message + assistant response)."""
        # Save user message
        user_msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.USER,
            content=user_message,
            citations=[],
            metadata={},
        )
        db.add(user_msg)
        
        # Save assistant response
        assistant_msg = Message(
            conversation_id=conversation.id,
            role=MessageRole.ASSISTANT,
            content=assistant_response,
            citations=citations,
            metadata=metadata or {},
        )
        db.add(assistant_msg)
        
        await db.commit()
        
        return user_msg, assistant_msg
    
    async def create_conversation(
        self,
        db: AsyncSession,
        user_id: UUID,
        title: Optional[str] = None,
    ) -> Conversation:
        """Create a new conversation."""
        conversation = Conversation(
            user_id=user_id,
            title=title or "New Conversation",
        )
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        
        return conversation
    
    async def get_user_conversations(
        self,
        db: AsyncSession,
        user_id: UUID,
        limit: int = 20,
    ) -> List[Conversation]:
        """Get user's recent conversations."""
        result = await db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.updated_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())


# Singleton instance
rag_service = RAGService()
