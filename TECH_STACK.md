# Technology Stack

Detailed documentation of technology choices, rationale, and implementation decisions.

---

## Core Technologies

### React 18

**Choice**: React 18 with functional components and hooks

**Rationale**:
- Concurrent rendering for better UX during heavy AI operations
- Suspense support for loading states
- Excellent TypeScript integration
- Vast ecosystem and community support

**Key Patterns Used**:
- Custom hooks for reusable logic
- Context API for global state (auth, theme)
- Controlled components for forms
- Portals for modals and tooltips

---

### TypeScript 5.3

**Choice**: Strict TypeScript configuration

**Rationale**:
- Catch errors at compile time
- Self-documenting code with interfaces
- Excellent IDE support and autocomplete
- Safer refactoring

**Example Type Definition**:
```typescript
interface Topic {
  id: string;
  name: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'in-progress' | 'completed';
  mode?: 'learn' | 'relearn';
  lessonPlan: LessonPlan;
  knowledgeGraph?: KnowledgeGraph;
}
```

---

### Vite 5

**Choice**: Vite as build tool and dev server

**Rationale**:
- Instant server start with native ESM
- Lightning-fast Hot Module Replacement (HMR)
- Optimized production builds with Rollup
- First-class TypeScript support

**Configuration Highlights**:
- React plugin for JSX transform
- SVGR for SVG component imports
- Environment variable handling

---

## Styling

### Tailwind CSS 4

**Choice**: Utility-first CSS with custom design tokens

**Rationale**:
- Rapid prototyping and iteration
- Consistent spacing and sizing
- Built-in dark mode support
- Tree-shaking for minimal bundle size

**Custom Extensions**:
```javascript
// Glassmorphic design tokens
colors: {
  glass: {
    100: 'rgba(30, 30, 35, 0.6)',
    200: 'rgba(40, 40, 45, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)'
  },
  neon: {
    blue: '#00f3ff',
    purple: '#a855f7'
  }
}
```

---

### Framer Motion 11

**Choice**: Framer Motion for all animations

**Rationale**:
- Declarative animation syntax
- Layout animations for dynamic content
- Gesture support (drag, tap, hover)
- AnimatePresence for exit animations

**Usage Examples**:
- Page transitions
- Card flip animations
- Quiz answer feedback
- Loading indicators
- Micro-interactions on buttons

---

## Backend

### Supabase

**Choice**: Supabase as complete backend solution

**Components Used**:
1. **Authentication**: Google OAuth integration
2. **PostgreSQL Database**: Relational data storage
3. **Row Level Security**: User data isolation
4. **Edge Functions**: Serverless compute for AI calls

**Why Supabase over alternatives**:

| Feature | Supabase | Firebase | Custom Backend |
|---------|----------|----------|----------------|
| SQL Support | ✅ Full PostgreSQL | ❌ NoSQL only | ✅ Your choice |
| Auth | ✅ Built-in | ✅ Built-in | ❌ Build yourself |
| Edge Functions | ✅ Deno runtime | ✅ Cloud Functions | ❌ Deploy separately |
| Pricing | 💚 Generous free tier | 💛 Pay-per-read | 💔 Depends |
| Setup Time | ⚡ Minutes | ⚡ Minutes | 🐢 Days/Weeks |

---

## AI Integration

### Google Gemini API

**Choice**: Gemini 2.0 Flash via Supabase Edge Functions

**Rationale**:
- Excellent structured JSON output
- Fast response times
- Cost-effective for educational content
- Serverless deployment keeps API key secure

**Why Edge Functions for AI**:
```
Client ──> Edge Function ──> Gemini API
          (API key hidden)
```

Instead of:
```
Client ──> Gemini API
          (API key exposed!)
```

**Prompt Engineering Approach**:
- System prompts define output structure
- JSON schema enforcement
- Few-shot examples for consistency
- Error handling and retries

---

## Payments

### Stripe

**Choice**: Stripe for subscription management

**Components Used**:
1. **Checkout Sessions**: Hosted payment page
2. **Customer Portal**: Self-service subscription management
3. **Webhooks**: Real-time subscription status updates
4. **Products/Prices**: Monthly and yearly plans

**Integration Pattern**:
```
1. User clicks "Subscribe"
2. Create Stripe Checkout Session (server)
3. Redirect to Stripe-hosted page
4. User completes payment
5. Webhook updates database
6. User redirected to success page
```

---

## Data Visualization

### Recharts

**Choice**: Recharts for the Mastery radar chart

**Rationale**:
- Built on React and D3
- Declarative component API
- Responsive out of the box
- Easy customization

**Customizations Made**:
- Custom axes styling
- Animated hover effects
- Dark mode color scheme
- Touch event handling

---

## Additional Libraries

| Library | Purpose |
|---------|---------|
| `react-router-dom` | Client-side routing |
| `lucide-react` | Icon library |
| `canvas-confetti` | Celebration effects |
| `tsparticles` | Background particle effects |
| `react-use` | Utility hooks collection |

---

## Development Tools

| Tool | Purpose |
|------|---------|
| **Vite** | Build tool and dev server |
| **TypeScript** | Type checking |
| **PostCSS** | CSS processing |
| **Autoprefixer** | CSS vendor prefixes |

---

## Performance Considerations

### Bundle Optimization
- Tree-shaking unused code
- Code splitting by route
- Dynamic imports for heavy components
- SVG sprites for icons

### Runtime Performance
- Memoization with `useMemo` and `useCallback`
- Virtualization for long lists
- Debounced search input
- Optimistic UI updates

### Network Performance
- Connection pooling in Supabase
- Edge function caching
- Efficient database queries
- Minimal API payload sizes
