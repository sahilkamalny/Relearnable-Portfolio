# AI Integration Approach

This document describes the approach used to integrate AI-powered content generation into Relearnable.

---

## Overview

Relearnable uses Google's Gemini AI (specifically `gemini-2.0-flash`) to dynamically generate educational content including:

- Complete lesson plans with structured sections
- Flashcards with highlighted keywords
- Quiz questions with explanations
- Placement tests for knowledge assessment
- Topic recommendations based on learning history

---

## Architecture

### Security-First Design

AI API calls are **never made directly from the client**. Instead, all AI requests are routed through Supabase Edge Functions to keep API keys secure:

```
┌──────────┐     ┌─────────────────┐     ┌────────────┐
│  Client  │────▶│  Edge Function  │────▶│ Gemini API │
└──────────┘     └─────────────────┘     └────────────┘
                  (API key stored           
                   server-side)             
```

### Edge Function Actions

The edge function exposes multiple actions through a single endpoint:

| Action | Purpose | Input | Output |
|--------|---------|-------|--------|
| `generateLessonPlan` | Create full lesson | topic, complexity | `LessonPlan` |
| `generatePlacementTest` | Diagnostic exam | topic, complexity | Quiz + Graph |
| `expandCurriculum` | Grow knowledge tree | conquered topics | New nodes/edges |
| `generateRelearnPlan` | Remediation content | topic, gaps | `LessonPlan` |
| `generateRecommendations` | Suggest next topics | completed topics | Recommendations |

---

## Prompt Engineering Strategy

### Structured Output

All prompts request JSON output with specific schemas to ensure consistent, parseable responses:

```
Generate a lesson plan as JSON with this exact structure:
{
  "topicName": string,
  "category": string (from predefined list),
  "sections": [
    {
      "title": string,
      "flashcards": [{ "content": string, "keywords": string[] }],
      "quiz": [{ "question": string, "options": string[], "correctAnswer": number, "explanation": string }]
    }
  ],
  "finalQuiz": [...]
}
```

### Complexity Calibration

Prompts include explicit instructions for difficulty levels:

| Level | Instructions |
|-------|-------------|
| **Beginner** | Assume no prior knowledge. Use simple language. Define all terms. |
| **Intermediate** | Assume foundational knowledge. Introduce nuance and connections. |
| **Advanced** | Assume strong foundation. Explore edge cases and advanced concepts. |

### Quality Assurance

- Questions must have exactly 4 options
- Correct answer index must be 0-3
- Explanations required for all quiz questions
- Topics categorized into one of 15 predefined categories

---

## Error Handling

```typescript
async function callEdgeFunction(action: string, params: Record<string, unknown>) {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action, ...params })
  });

  const data = await response.json();
  
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Edge function failed');
  }
  
  return data;
}
```

---

## Rate Limiting

Usage limits are enforced at the database level:

- Free users: 3 learn + 3 relearn generations per day
- Premium users: Unlimited generations

Counts reset daily based on `last_usage_date` comparison.

---

## Future Considerations

- **Caching**: Cache commonly requested topics
- **Streaming**: Stream responses for faster perceived performance
- **Feedback Loop**: Use quiz performance to improve future generations
- **Multiple Models**: A/B test different AI providers
