# System Architecture

Detailed technical documentation of Relearnable's architecture, design patterns, and system integrations.

---

## High-Level Architecture

```mermaid
flowchart TB
    subgraph User["User Layer"]
        Browser[Web Browser/PWA]
    end
    
    subgraph Frontend["Frontend Layer"]
        React[React 18 SPA]
        Router[React Router]
        Context[Context Providers]
        Components[Component Library]
    end
    
    subgraph State["State Management"]
        AuthCtx[Auth Context]
        ThemeCtx[Theme Context]
        LocalState[Component State]
    end
    
    subgraph Services["Service Layer"]
        DBService[Database Service]
        GeminiSvc[Gemini Service]
        StripeSvc[Stripe Service]
    end
    
    subgraph Backend["Supabase Backend"]
        Auth[Supabase Auth]
        DB[(PostgreSQL)]
        Edge[Edge Functions]
        RLS[Row Level Security]
    end
    
    subgraph External["External APIs"]
        Gemini[Google Gemini AI]
        StripeAPI[Stripe API]
        Google[Google OAuth]
    end
    
    Browser --> React
    React --> Router
    Router --> Context
    Context --> AuthCtx
    Context --> ThemeCtx
    Components --> LocalState
    
    React --> Services
    DBService --> DB
    GeminiSvc --> Edge
    StripeSvc --> StripeAPI
    
    Edge --> Gemini
    Auth --> Google
    DB --> RLS
```

---

## Frontend Architecture

### Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    App --> ThemeProvider
    ThemeProvider --> ParticlesBackground
    ThemeProvider --> Router[HashRouter]
    
    Router --> LandingPage
    Router --> Dashboard
    Router --> LessonView
    Router --> Settings
    
    subgraph DashboardComponents["Dashboard Components"]
        Dashboard --> SearchHeader
        Dashboard --> TopicCards
        Dashboard --> MasteryChart
        Dashboard --> Recommendations
    end
    
    subgraph LessonComponents["Lesson Components"]
        LessonView --> Flashcard
        LessonView --> Quiz
        LessonView --> KnowledgeGraph
        LessonView --> ProgressBar
    end
    
    subgraph UIComponents["Glass UI System"]
        GlassCard
        GlassButton
        GlassInput
        AuroraBackground
    end
```

### Design System

The application uses a custom **Glassmorphic Design System** with:

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `glass-100` | `rgba(255,255,255,0.7)` | `rgba(30,30,35,0.6)` |
| `glass-200` | `rgba(255,255,255,0.8)` | `rgba(40,40,45,0.7)` |
| `glass-border` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` |
| `neon-blue` | `#2563eb` | `#00f3ff` |
| `neon-purple` | `#7c3aed` | `#a855f7` |

---

## Backend Architecture

### Database Schema

```mermaid
erDiagram
    profiles ||--o{ topics : "has many"
    profiles ||--o{ recommendations : "has many"
    profiles ||--o{ mastery_scores : "has many"
    profiles ||--o{ activity_logs : "has many"
    topics ||--o{ quiz_results : "has many"
    
    profiles {
        uuid id PK
        string email
        string full_name
        string avatar_url
        string subscription_status
        string plan_type
        date last_usage_date
        int learn_generations_count
        int relearn_generations_count
        string theme_preference
    }
    
    topics {
        uuid id PK
        uuid user_id FK
        string name
        string complexity
        string status
        string mode
        int current_section_index
        int current_card_index
        jsonb lesson_plan
        jsonb knowledge_graph
        timestamp last_accessed
    }
    
    mastery_scores {
        uuid id PK
        uuid user_id FK
        string category
        int score
    }
    
    recommendations {
        uuid id PK
        uuid user_id FK
        string name
        string complexity
        string reason
        boolean is_suggested
    }
```

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data:

```sql
-- Example policy pattern
CREATE POLICY "Users can only view own topics"
ON topics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert own topics"
ON topics FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

## AI Integration Architecture

### Edge Function Flow

```mermaid
sequenceDiagram
    participant Client
    participant EdgeFn as Edge Function
    participant Gemini as Gemini AI
    participant DB as PostgreSQL
    
    Client->>EdgeFn: POST /generate-lesson
    EdgeFn->>EdgeFn: Validate request
    EdgeFn->>Gemini: Generate lesson plan
    Gemini-->>EdgeFn: Structured JSON response
    EdgeFn->>EdgeFn: Validate & parse
    EdgeFn-->>Client: Return lesson plan
    Client->>DB: Save topic with lesson
```

### AI Actions

| Action | Description | Output |
|--------|-------------|--------|
| `generateLessonPlan` | Full lesson with sections, flashcards, quizzes | `LessonPlan` |
| `generatePlacementTest` | Diagnostic quiz + initial knowledge graph | `PlacementResult` |
| `expandCurriculum` | Add new nodes to knowledge graph | `KnowledgeGraph` |
| `generateRelearnPlan` | Targeted remediation content | `LessonPlan` |
| `generateRecommendations` | Next topic suggestions | `Recommendation[]` |

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Supabase as Supabase Auth
    participant Google as Google OAuth
    
    User->>App: Click "Sign in with Google"
    App->>Supabase: signInWithOAuth()
    Supabase->>Google: Redirect to Google
    Google-->>User: Consent screen
    User->>Google: Approve
    Google-->>Supabase: Auth code
    Supabase-->>App: Session + User
    App->>App: Redirect to Dashboard
```

---

## Payment Integration

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Stripe
    participant Webhook as Webhook Handler
    participant DB
    
    User->>App: Select subscription plan
    App->>Stripe: Create checkout session
    Stripe-->>User: Redirect to checkout
    User->>Stripe: Complete payment
    Stripe->>Webhook: checkout.session.completed
    Webhook->>DB: Update subscription status
    Stripe-->>User: Redirect to success
    User->>App: Access premium features
```

---

## Performance Optimizations

### Implemented Strategies

1. **Code Splitting**: React.lazy for route-level components
2. **Optimistic Updates**: Immediate UI feedback before DB confirmation
3. **Debounced Search**: Prevent excessive API calls during typing
4. **Animation Performance**: `will-change` hints, GPU-accelerated transforms
5. **Image Optimization**: SVG icons, lazy loading for large assets
6. **Bundle Optimization**: Vite tree-shaking, chunk splitting

### Lighthouse Scores

| Metric | Score |
|--------|-------|
| Performance | 90+ |
| Accessibility | 95+ |
| Best Practices | 100 |
| SEO | 90+ |

---

## Security Considerations

- **API Keys**: Never exposed to client; AI calls routed through Edge Functions
- **Authentication**: Supabase Auth with Google OAuth
- **Authorization**: Row Level Security on all database tables
- **HTTPS**: Enforced on all connections
- **Input Validation**: Server-side validation in Edge Functions
- **Payment Security**: Stripe handles all payment data (PCI compliant)
