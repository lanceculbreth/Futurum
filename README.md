# Futurum AI Insights

A modern alternative to legacy analyst platforms. Real-time, AI-driven intelligence for technology leaders who need actionable insights—not static annual reports.

## About The Futurum Group

The Futurum Group is a leading global technology research, advisory, and media firm—the modern alternative to legacy analyst firms like Gartner or Forrester. Specializing in AI, cloud computing, cybersecurity, semiconductors, and enterprise software.

### Why Customers Choose Futurum

1. **Signal Through the Noise**: Futurum Signal provides AI-powered vendor evaluation with continuous updates and 6-12 month predictive analytics—not yearly static quadrants.

2. **Strategic AI Transition**: Leading voice on Agentic AI strategy, helping enterprises move from AI hype to actionable implementation with data readiness roadmaps.

3. **Cloud GTM Expertise**: Navigate AWS, Azure, and Google Cloud marketplaces effectively with go-to-market strategies backed by market intelligence.

4. **Performance Validation**: Signal65 labs provide third-party technical validation that proves performance claims to enterprise buyers.

5. **C-Suite Media Reach**: Analyst-hosted podcasts and webcasts reach decision-makers directly.

### The Human + Machine Approach

Futurum's "analyst-grounded AI" philosophy ensures insights are contextually accurate—AI-generated data validated by expert analysts, not automated noise.

**Four Pillars:**
- **Analyze**: Real-time market intelligence via the Futurum Intelligence platform
- **Advise**: Strategic consulting and AI implementation roadmaps
- **Amplify**: Media network reaching technology decision-makers
- **Assess**: Signal65 technical labs for performance validation

## Features

- **AI Research Assistant**: Claude-powered conversational interface for querying Futurum's research
- **RAG Pipeline**: Retrieval-Augmented Generation ensures accurate, sourced responses from proprietary research
- **Practice Area Access**: Content filtered by customer's assigned practice areas
- **Semantic Search**: Natural language search across market reports, analyst insights, and forecasts
- **Document Management**: Admin tools for uploading research content (reports, articles, transcripts)
- **User Management**: Assign customers to specific practice areas based on their subscription
- **Source Citations**: All responses cite source documents for verification

## Practice Areas

- AI Platforms
- Cybersecurity & Resilience
- Data Intelligence, Analytics, & Infrastructure
- Digital Leadership & CIO
- Ecosystems, Channels, & Marketplaces
- Enterprise Software & Digital Workflows
- Intelligent Devices
- Semiconductors, Supply Chain, & Emerging Tech
- Software Lifecycle Engineering

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Vector DB**: ChromaDB (local) / Pinecone (production)
- **LLM**: Anthropic Claude API
- **Embeddings**: OpenAI text-embedding-3-small
- **Auth**: JWT with bcrypt password hashing

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- API Keys: Anthropic, OpenAI

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy environment file and configure:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Set up PostgreSQL database:
   ```bash
   createdb futurum
   ```

6. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/futurum

# JWT Authentication
JWT_SECRET_KEY=your-secret-key-change-in-production

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (for embeddings)
OPENAI_API_KEY=sk-...

# Vector Database
CHROMA_PERSIST_DIRECTORY=./chroma_db
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/me` - Get current user

### Chat
- `POST /api/v1/chat/message` - Send message and get AI response
- `GET /api/v1/chat/conversations` - List conversations
- `GET /api/v1/chat/conversations/{id}` - Get conversation with messages

### Search
- `POST /api/v1/search/` - Semantic search
- `GET /api/v1/search/documents` - List documents
- `GET /api/v1/search/practice-areas` - List practice areas

### Admin
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create user
- `PUT /api/v1/admin/users/{id}/practice-areas` - Assign practice areas
- `POST /api/v1/admin/documents/text` - Upload text content
- `POST /api/v1/admin/documents/file` - Upload file (PDF)
- `GET /api/v1/admin/stats` - Get system statistics

## Project Structure

```
futurum-ai/
├── backend/
│   ├── app/
│   │   ├── api/           # API route handlers
│   │   ├── core/          # Config, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic (RAG, ingestion)
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── stores/        # Zustand stores
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Usage

### For Customers

1. Register or login with your credentials
2. Use the Chat interface to ask questions about research insights
3. Browse documents in the Search tab
4. Filter by your assigned practice areas

### For Admins

1. Access the Admin panel from the sidebar
2. Create users and assign practice areas
3. Upload research content (articles, reports, transcripts)
4. Monitor system statistics

## License

Proprietary - © 2026 The Futurum Group. All rights reserved.
