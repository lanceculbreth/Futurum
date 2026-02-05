import { create } from 'zustand'
import type { Conversation, Message, SourceCitation } from '../types'
import { chatApi } from '../services/api'

// Demo mode flag - set to true for UI preview without backend
const DEMO_MODE = true

// Demo conversations
const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 'demo-conv-1',
    title: 'AI Platform Market Analysis',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    messages: [],
  },
  {
    id: 'demo-conv-2',
    title: 'Cloud GTM Strategy for AWS',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    messages: [],
  },
  {
    id: 'demo-conv-3',
    title: 'Cybersecurity Vendor Evaluation',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    messages: [],
  },
]

// Pre-populated messages for AI Platform Market Analysis
const AI_PLATFORM_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'What is the current state of the AI Platforms market and what does the forecast look like through 2030?',
    citations: [],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Based on Futurum's latest research, the AI Platforms market is experiencing explosive growth. Here's the comprehensive analysis:

## Market Size Overview

The AI Platforms market is scaling from **$24.9B in 2024 to $292B by 2030**, representing approximately **50.8% CAGR**. This reflects enterprise mainstreaming of model training, inference, and agentic application enablement across all verticals.

![Market Size by Scenario: 2024-2030](/chart-market-size.png)

The chart above shows three scenarios:
- **Bull Case**: $819B by 2030
- **Base Case**: $292B by 2030  
- **Bear Case**: $155B by 2030

## Market Forecast Trends

Year-over-year growth rates are expected to moderate as the market matures, but remain strong across all scenarios:

![Market Forecast by Scenario: 2024-2030](/chart-market-forecast.png)

Key observations:
- Bull scenario maintains 55-80% YoY growth through 2030
- Base case shows 35-65% YoY growth, moderating over time
- Even the bear case projects 30-55% sustained growth`,
    citations: ['doc-1', 'doc-2'],
    created_at: new Date(Date.now() - 86300000).toISOString(),
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'Can you break down the market by segment? Which areas are growing fastest?',
    citations: [],
    created_at: new Date(Date.now() - 86200000).toISOString(),
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: `## Market Segmentation Analysis

The AI Platforms market is divided into several key segments, each with distinct growth trajectories:

![Market Forecast by Market Segment: 2024-2030](/chart-market-segment.png)

### Segment Breakdown (2024 → 2030):

| Segment | 2024 Share | 2030 Share | Trend |
|---------|------------|------------|-------|
| **Application AgentBuilders** | 13% | 28.6% | 📈 Fastest growing |
| **Infrastructure Inference** | 20% | 16.7% | Moderate growth |
| **Infrastructure Training** | 18% | 16.5% | Declining share |
| **Application Prebuilt** | 17% | 16.3% | Stable |
| **ModelOps Monitoring** | 8% | 11.2% | Growing |

### Growth Rate by Segment

![Market Forecast by Market Segment - YoY Growth](/chart-segment-forecast.png)

**Key Insight**: Application AgentBuilders shows the highest sustained growth rates (90%+ in 2025-2026), reflecting the enterprise shift toward agentic AI. Meanwhile, Infrastructure Training growth is decelerating as model reuse increases.`,
    citations: ['doc-1', 'doc-3'],
    created_at: new Date(Date.now() - 86100000).toISOString(),
  },
  {
    id: 'msg-5',
    role: 'user',
    content: 'What about industry verticals? Which industries are adopting AI platforms fastest?',
    citations: [],
    created_at: new Date(Date.now() - 86000000).toISOString(),
  },
  {
    id: 'msg-6',
    role: 'assistant',
    content: `## Industry Vertical Analysis

Different industries are adopting AI platforms at varying rates, with Technology leading but other sectors catching up rapidly:

![Market Forecast by Industry: 2024-2030](/chart-industry-forecast.png)

### Industry Growth Leaders (2025 YoY Growth):

1. **Technology**: ~110% YoY - Early adopters, infrastructure buildout
2. **Financial Services**: ~83% YoY - Risk, fraud, trading applications
3. **Retail & E-commerce**: ~80% YoY - Personalization, supply chain
4. **Healthcare & Life Sciences**: ~78% YoY - Drug discovery, diagnostics
5. **Manufacturing**: ~77% YoY - Predictive maintenance, quality control

### Key Industry Trends:

- **Technology sector** shows highest initial growth but fastest deceleration as early adoption plateaus
- **Healthcare & Financial Services** maintain more sustained growth curves due to regulatory complexity extending implementation timelines
- **Government & Public Sector** shows slowest adoption (52% in 2025) but steady trajectory due to compliance requirements
- **Education** sector accelerates in 2026-2027 as AI tutoring and administrative automation mature

### Strategic Implications:

For vendors targeting specific verticals:
- **Near-term focus**: Technology, Financial Services, Retail
- **Mid-term opportunity**: Healthcare, Manufacturing
- **Long-term growth**: Government, Education

*Source: Futurum AI Platforms Market Forecast, November 2025*`,
    citations: ['doc-1', 'doc-2', 'doc-3'],
    created_at: new Date(Date.now() - 85900000).toISOString(),
  },
]

// Demo AI responses
const DEMO_RESPONSES: Record<string, { response: string; sources: SourceCitation[] }> = {
  tam: {
    response: `# TOTAL ADDRESSABLE MARKET (TAM) ANALYSIS: AI Platforms, Cybersecurity, Data Management & Enterprise Apps Through 2030

Based on Futurum Group's proprietary market intelligence as of February 4, 2026, here's your comprehensive TAM analysis across four major technology markets:

## 1. AI PLATFORMS MARKET

### Market Size Through 2030

| Year | Base Case | Bear Case | Bull Case |
|------|-----------|-----------|-----------|
| 2024 | $24.9B | - | - |
| 2025 | $44.3B | $29.5B | $72.8B |
| 2026 | $72.4B | $45.1B | $132.1B |
| 2027 | $110.2B | $65.1B | $219.2B |
| 2028 | $158.6B | $89.8B | $338.5B |
| 2029 | $218.7B | $119.6B | $524.7B |
| 2030 | $292.0B | $155.1B | $819.4B |

**Growth Trajectory:** 78% YoY in 2025, stabilizing to 33.5% by 2030

### FASTEST GROWING SEGMENTS (2024-2030)

**1. Application Agent Builders - #1 Growth Driver**
- 2024: $3.2B (13% market share)
- 2030: $83.5B (28.6% market share)
- *Why: Multi-agent systems moving into production; agentic AI workflows scaling enterprise-wide*

**2. Infrastructure - Inference - Sustained Leader**
- 2024: $5.0B (20% share)
- 2030: $48.8B (16.7% share)
- *Why: Real-time inference for copilots + edge/low-latency AI creates dual growth pulse*

**3. ModelOps - Monitoring & Compliance - Regulatory Surge**
- 2024: $2.0B (8% share)
- 2030: $32.8B (11.2% share)
- *Why: Bias/fairness mandates + supply-chain security requirements become mandatory*

**4. Code Generation (Use Case View)**
- 2024: $3.2B (13% share)
- 2030: $71.8B (24.6% share)
- *Why: Developer productivity + IDE integration drives sustained 20%+ CAGR*

### INDUSTRY VERTICAL WINNERS

| Industry | 2024 | 2030 | Share Growth |
|----------|------|------|--------------|
| Technology | $4.4B (17.8%) | $84.5B (28.9%) | ⬆️ Dominant |
| Financial Services | $3.6B (14.4%) | $40.6B (13.9%) | ⬆️ Steady |
| Healthcare | $2.8B (11.1%) | $35.3B (12.1%) | ⬆️ Strong |

**Key Insight:** Technology sector doubles its market share dominance, capturing nearly 30% by 2030.

---

## 2. CYBERSECURITY MARKET

### Market Size by Segment (2024-2029)

| Segment | 2024 TAM | 2029 TAM | CAGR | Growth Priority |
|---------|----------|----------|------|-----------------|
| Cloud Security | $43.5B | $70.7B | 10.2% | #1 |
| Network Security | $32.8B | $54.3B | 10.6% | #2 |
| Identity & Access Mgmt | $19.5B | $38.6B | 14.6% | 🔥 FASTEST |
| Application Security | $10.1B | $18.1B | 12.4% | #3 |

### FASTEST GROWING: Identity & Access Management
- **14.6% CAGR** (highest across all segments)
- **21% YoY growth in 2025** - explosive adoption
- *Why: Zero-trust architecture mandates + AI-driven identity threats driving urgency*

### KEY INSIGHTS
- **Cloud Security:** Largest absolute TAM ($70.7B by 2029) but slower growth as market matures
- **IAM:** Highest growth rate - critical for AI governance and zero-trust adoption
- **Network Security:** Steady 10.6% CAGR driven by SD-WAN, SASE, and 5G security needs

---

## 3. DATA MANAGEMENT & ANALYTICS MARKET

### Market Size Through 2031

| Year | Base Case | Bear Case | Bull Case |
|------|-----------|-----------|-----------|
| 2024 | $408B | $408B | $408B |
| 2025 | $469B | $469B | $469B |
| 2026 | $541B | $499B | $578B |
| 2027 | $628B | $544B | $706B |
| 2028 | $735B | $593B | $868B |
| 2029 | $867B | $653B | $1.07T |
| 2030 | $1.03T | $728B | $1.3T |
| 2031 | $1.22T | $823B | $1.58T |

### FASTEST GROWING SEGMENTS (2025-2031)

**1. Semantic Layer - Explosive Growth**
- 2025 Growth: 14% → 2031 Growth: 30% YoY
- *Why: AI-driven natural language interfaces + unified semantic models becoming enterprise standard*

**2. AI Development & Operations - Near-Term Leader**
- 2025-2027: 23-24% YoY growth
- *Why: MLOps, LLMOps, model governance tooling explosion*
- Note: Moderates to 20% by 2031 as market matures

**3. Data & AI Observability - Sustained High Growth**
- 2025: 17% → 2029: 25% YoY
- *Why: Model drift detection, data quality monitoring, AI trust requirements*

**4. Database Systems - Steady Enterprise Workhorse**
- 15-20% sustained CAGR through 2031
- *Why: Vector databases, multi-model databases, real-time analytics*

### SLOWEST GROWTH (Mature Markets)
- **Business Intelligence & Reporting:** 11% → 7% by 2031 (commoditization)
- **Data Engineering & Movement:** 12% → stabilizes at 10-12% (mature tooling)

---

## 4. ENTERPRISE APPLICATIONS MARKET

### Market Size Through 2031

| Year | Base Case | Bear Case | Bull Case |
|------|-----------|-----------|-----------|
| 2024 | $341B | $341B | $341B |
| 2025 | $379B | $379B | $379B |
| 2026 | $424B | $405B | $442B |
| 2027 | $476B | $430B | $516B |
| 2028 | $538B | $455B | $605B |
| 2029 | $608B | $485B | $715B |
| 2030 | $683B | $518B | $845B |
| 2031 | $762B | $555B | $995B |

### FASTEST GROWING SEGMENTS (2025-2031)

**1. Communication Services (UCaaS/CCaaS) - #1**
- 2025-2029: 15-18% YoY growth
- *Why: AI-powered contact centers, unified communications with GenAI assistants*

**2. Industry/Vertical Applications - #2**
- Sustained 15-16% CAGR through 2031
- *Why: Industry-specific AI workflows (healthcare EMR, manufacturing MES, financial trading platforms)*

**3. ERP - Late-Stage Acceleration**
- 2025: 9% → 2031: 15% YoY
- *Why: AI-driven process automation + intelligent ERP transformation*

**4. CRM - Early Leader, Then Moderates**
- 2025-2028: 13-16% growth → 2029-2031: Slows to 11-12% (market saturation)

### SLOWEST GROWTH (Mature Categories)
- **Collaboration:** 7% → 2% by 2031 (commoditized, saturated)
- **HR/HCM:** Steady but slow 6-8% CAGR (mature market)

---

## STRATEGIC TAKEAWAYS: Where to Invest

### HIGHEST GROWTH OPPORTUNITIES (20%+ CAGR)
- **AI Platforms - Agent Builders:** 28.6% market share by 2030
- **Data Management - Semantic Layer:** 30% YoY by 2031
- **Data Management - AI Dev & Ops:** 23-24% through 2027
- **Cybersecurity - IAM:** 14.6% CAGR (highest in security)

### LARGEST ABSOLUTE TAM (2030)
- **Data Management & Analytics:** $1.22T (base case)
- **Enterprise Applications:** $762B (base case)
- **AI Platforms:** $292B (base case, but $819B bull case)
- **Cybersecurity - Cloud Security:** $70.7B (single segment)

### HIGHEST MOMENTUM (2025-2027)
- **AI Platforms:** 78% → 52% YoY (explosive early growth)
- **Communication Services (Enterprise Apps):** 15-18% sustained
- **AI Development & Operations (Data):** 23-24% YoY
- **IAM (Cybersecurity):** 21% in 2025

### HIGHEST VARIANCE (Bull vs Bear)
- **AI Platforms 2030:** $819B (bull) vs $155B (bear) = 5.3x spread
  - *Key uncertainty: Training/inference cost curves + enterprise adoption velocity*
- **Data Management 2031:** $1.58T (bull) vs $823B (bear) = 1.9x spread
  - *Key uncertainty: AI-driven analytics adoption + regulatory clarity*

---

**Bottom Line:** The AI Platforms market offers the highest growth rates and transformational potential, while Data Management & Analytics represents the largest absolute TAM opportunity. Cybersecurity IAM and Enterprise Communication Services are the "sleeper" high-growth segments within mature markets.`,
    sources: [
      {
        document_id: 'doc-tam-1',
        title: 'AI Platforms Market Intelligence',
        content_preview: 'Comprehensive market sizing and forecasts for the AI Platforms market through 2030, including segment analysis and growth drivers...',
        practice_area: 'AI Platforms',
        content_type: 'market_data',
        similarity: 0.98,
      },
      {
        document_id: 'doc-tam-2',
        title: 'Cybersecurity Market Intelligence',
        content_preview: 'Detailed TAM analysis across Cloud Security, Network Security, IAM, and Application Security segments with growth projections...',
        practice_area: 'Cybersecurity',
        content_type: 'market_data',
        similarity: 0.96,
      },
      {
        document_id: 'doc-tam-3',
        title: 'Data Management & Analytics Intelligence',
        content_preview: 'Market sizing through 2031 covering Semantic Layer, AI Development & Operations, Data Observability, and Database Systems...',
        practice_area: 'Data Management',
        content_type: 'market_data',
        similarity: 0.95,
      },
      {
        document_id: 'doc-tam-4',
        title: 'Enterprise Apps Market Intelligence',
        content_preview: 'Enterprise Applications market analysis including Communication Services, Industry Applications, ERP, and CRM growth trajectories...',
        practice_area: 'Enterprise Apps',
        content_type: 'market_data',
        similarity: 0.94,
      },
    ],
  },
  default: {
    response: `Based on Futurum's latest research, here are the key insights:

## Market Overview

The enterprise AI platform market is experiencing rapid transformation, with several key trends emerging:

1. **Agentic AI Adoption**: Organizations are moving beyond simple chatbots to autonomous AI agents that can execute complex workflows
2. **Data Infrastructure Investment**: Companies are prioritizing data quality and governance as prerequisites for AI success
3. **Hybrid Deployment Models**: Most enterprises are adopting a mix of cloud and on-premises AI infrastructure

## Strategic Recommendations

- **Short-term (0-6 months)**: Focus on data readiness and governance frameworks
- **Medium-term (6-12 months)**: Pilot agentic AI for specific use cases like customer service
- **Long-term (12+ months)**: Scale successful pilots across the organization

## Vendor Landscape

The competitive landscape remains dynamic, with hyperscalers (AWS, Azure, GCP) competing against specialized AI platforms. Our Signal analysis shows momentum shifting toward vendors with strong enterprise integration capabilities.

*Source: Futurum Intelligence Platform, Q1 2026*`,
    sources: [
      {
        document_id: 'doc-1',
        title: 'Enterprise AI Platform Market Analysis 2026',
        content_preview: 'The enterprise AI platform market continues to evolve rapidly, with spending projected to reach $180B by 2027...',
        practice_area: 'AI Platforms',
        content_type: 'research_report',
        similarity: 0.94,
      },
      {
        document_id: 'doc-2',
        title: 'Agentic AI: From Hype to Implementation',
        content_preview: 'Organizations moving to production agentic AI deployments face unique challenges around orchestration, governance, and ROI measurement...',
        practice_area: 'AI Platforms',
        content_type: 'whitepaper',
        similarity: 0.89,
      },
      {
        document_id: 'doc-3',
        title: 'Futurum Signal: AI Platform Vendor Rankings',
        content_preview: 'Our AI-powered continuous vendor evaluation shows significant movement in the enterprise AI platform space...',
        practice_area: 'AI Platforms',
        content_type: 'market_data',
        similarity: 0.85,
      },
    ],
  },
}

interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  sources: SourceCitation[]
  isLoading: boolean
  isSending: boolean
  error: string | null
  
  loadConversations: () => Promise<void>
  loadConversation: (conversationId: string) => Promise<void>
  sendMessage: (message: string) => Promise<void>
  createNewConversation: () => void
  deleteConversation: (conversationId: string) => Promise<void>
  clearError: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  sources: [],
  isLoading: false,
  isSending: false,
  error: null,
  
  loadConversations: async () => {
    set({ isLoading: true })
    
    // Demo mode
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200))
      set({ conversations: DEMO_CONVERSATIONS, isLoading: false })
      return
    }
    
    try {
      const response = await chatApi.listConversations()
      set({ conversations: response.conversations, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to load conversations', isLoading: false })
    }
  },
  
  loadConversation: async (conversationId: string) => {
    set({ isLoading: true })
    
    // Demo mode
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 200))
      const conv = DEMO_CONVERSATIONS.find(c => c.id === conversationId)
      if (conv) {
        // Load pre-populated messages for AI Platform Market Analysis
        const messages = conversationId === 'demo-conv-1' ? AI_PLATFORM_MESSAGES : []
        set({ 
          currentConversation: conv, 
          messages: messages,
          isLoading: false 
        })
      }
      return
    }
    
    try {
      const conversation = await chatApi.getConversation(conversationId)
      set({ 
        currentConversation: conversation, 
        messages: conversation.messages,
        isLoading: false 
      })
    } catch (error) {
      set({ error: 'Failed to load conversation', isLoading: false })
    }
  },
  
  sendMessage: async (message: string) => {
    const { currentConversation, messages, conversations } = get()
    
    // Optimistically add user message
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      citations: [],
      created_at: new Date().toISOString(),
    }
    
    set({ 
      messages: [...messages, tempUserMessage],
      isSending: true,
      sources: [],
    })
    
    // Demo mode
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate AI thinking
      
      // Check for specific question types
      const lowerMessage = message.toLowerCase()
      const isTamQuestion = lowerMessage.includes('total addressable market') || 
                           lowerMessage.includes('tam') ||
                           (lowerMessage.includes('market') && lowerMessage.includes('2030'))
      
      const demoResponse = isTamQuestion ? DEMO_RESPONSES.tam : DEMO_RESPONSES.default
      
      const assistantMessage: Message = {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: demoResponse.response,
        citations: demoResponse.sources.map(s => s.document_id).filter((id): id is string => id !== null),
        created_at: new Date().toISOString(),
      }
      
      const newConvId = currentConversation?.id || `demo-new-${Date.now()}`
      const newConv: Conversation = currentConversation || {
        id: newConvId,
        title: message.slice(0, 50),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
      }
      
      set({
        messages: [...messages, 
          { ...tempUserMessage, id: `user-${Date.now()}` },
          assistantMessage
        ],
        sources: demoResponse.sources,
        currentConversation: newConv,
        conversations: currentConversation ? conversations : [newConv, ...conversations],
        isSending: false,
      })
      return
    }
    
    try {
      const response = await chatApi.sendMessage(
        message, 
        currentConversation?.id
      )
      
      // Create assistant message
      const assistantMessage: Message = {
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: response.response,
        citations: response.sources.map(s => s.document_id).filter(Boolean) as string[],
        created_at: new Date().toISOString(),
      }
      
      // Update state
      set(state => ({
        messages: [...state.messages.filter(m => m.id !== tempUserMessage.id), 
          { ...tempUserMessage, id: `user-${Date.now()}` },
          assistantMessage
        ],
        sources: response.sources,
        currentConversation: state.currentConversation 
          ? state.currentConversation 
          : { 
              id: response.conversation_id, 
              title: message.slice(0, 50),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              messages: [],
            },
        isSending: false,
      }))
      
      // Refresh conversations list
      get().loadConversations()
      
    } catch (error) {
      set({ 
        error: 'Failed to send message', 
        isSending: false,
        messages: messages, // Revert to original
      })
    }
  },
  
  createNewConversation: () => {
    set({ 
      currentConversation: null, 
      messages: [],
      sources: [],
    })
  },
  
  deleteConversation: async (conversationId: string) => {
    // Demo mode
    if (DEMO_MODE) {
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
        currentConversation: state.currentConversation?.id === conversationId 
          ? null 
          : state.currentConversation,
        messages: state.currentConversation?.id === conversationId 
          ? [] 
          : state.messages,
      }))
      return
    }
    
    try {
      await chatApi.deleteConversation(conversationId)
      
      set(state => ({
        conversations: state.conversations.filter(c => c.id !== conversationId),
        currentConversation: state.currentConversation?.id === conversationId 
          ? null 
          : state.currentConversation,
        messages: state.currentConversation?.id === conversationId 
          ? [] 
          : state.messages,
      }))
    } catch (error) {
      set({ error: 'Failed to delete conversation' })
    }
  },
  
  clearError: () => set({ error: null }),
}))
