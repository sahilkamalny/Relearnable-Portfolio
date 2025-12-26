# Service Layer Patterns

This document describes the architectural patterns used in Relearnable's service layer.

---

## Overview

The service layer abstracts all external API interactions and database operations, providing a clean interface for React components.

---

## Service Structure

```
services/
├── databaseService.ts   # Supabase CRUD operations
├── geminiService.ts     # AI content generation
└── stripeService.ts     # Payment handling
```

---

## Database Service Pattern

### Async Function Exports

Each database operation is exported as an async function with explicit typing:

```typescript
export async function loadUserData(userId: string): Promise<UserData> {
  // Parallel queries for efficiency
  const [topicsResult, masteryResult, recommendationsResult, profileResult] = 
    await Promise.all([
      supabase.from('topics').select('*').eq('user_id', userId),
      supabase.from('mastery_scores').select('*').eq('user_id', userId),
      supabase.from('recommendations').select('*').eq('user_id', userId),
      supabase.from('profiles').select('*').eq('id', userId).single()
    ]);
  
  // Error handling and data transformation...
  
  return { userId, profile, topics, masteryScores, recommendations };
}
```

### Operation Categories

| Category | Functions |
|----------|-----------|
| **Data Loading** | `loadUserData` |
| **Logging** | `dbLogActivity`, `fetchActivityLogs`, `fetchPaymentHistory` |
| **Limits** | `dbIncrementGenerationCount` |
| **CRUD** | `dbCreateTopic`, `dbUpdateProgress`, `dbDeleteTopic`, etc. |

### Optimistic Updates

For better UX, some operations use optimistic updates:

```typescript
// UI updates immediately
setTopics(prev => prev.filter(t => t.id !== topicId));

// Database update in background
await dbDeleteTopic(topicId);
```

---

## AI Service Pattern

### Edge Function Proxy

All AI calls go through a single helper function:

```typescript
async function callEdgeFunction(
  action: string, 
  params: Record<string, unknown>
) {
  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action, ...params })
  });
  
  // Unified error handling
  const data = await response.json();
  if (!response.ok || data.error) {
    throw new Error(data.error || 'Edge function failed');
  }
  
  return data;
}
```

### Exported Functions

Each AI action has a typed wrapper:

```typescript
export const generateLessonPlan = async (
  topicName: string,
  complexity: string
): Promise<LessonPlan> => {
  const result = await callEdgeFunction('generateLessonPlan', { 
    topicName, 
    complexity 
  });
  
  // Format topic name before returning
  if (result.topicName) {
    result.topicName = formatTopicName(result.topicName);
  }
  
  return result;
};
```

---

## Payment Service Pattern

### Stripe Configuration

```typescript
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
```

### Checkout Flow

```typescript
export async function createCheckoutSession(
  priceId: string,
  userId: string
): Promise<string> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ priceId, userId })
  });
  
  const { sessionId } = await response.json();
  return sessionId;
}
```

---

## Error Handling Strategy

1. **Try-Catch Wrapping**: All external calls wrapped
2. **Error Logging**: Errors logged with context
3. **User Feedback**: Errors surfaced via toast/alert
4. **Graceful Degradation**: Non-critical failures don't crash app

```typescript
try {
  await dbUpdateProgress(topicId, updates);
} catch (error) {
  console.error('Failed to save progress:', error);
  // Show toast notification
  showToast('Failed to save progress. Your work is safe locally.');
}
```
