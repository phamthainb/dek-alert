# Copilot Instructions for Alert Hub

## Project Overview

**Alert Hub** is a centralized monitoring and alerting system built with Next.js, TypeScript, and Tailwind CSS. The system collects data from various sources (databases, Elasticsearch, Kubernetes), evaluates conditions, and delivers actionable alerts through multiple channels.

## Architecture & Tech Stack

### Frontend

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark theme (#222222 background)
- **UI Components**: Radix UI primitives with custom styling
- **Colors**:
  - Primary: Electric blue (#7DF9FF)
  - Accent: Soft lavender (#E6E6FA)
  - Background: Dark gray (#222222)
- **Font**: Inter (grotesque sans-serif)

### Backend & Data

- **Database**: SQLite with better-sqlite3
- **State Management**: Server-side with database persistence
- **API**: Next.js API routes
- **AI Integration**: Genkit for intelligent features

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── monitors/          # Monitor management pages
│   ├── datasources/       # Data source configuration
│   ├── webhooks/          # Webhook management
│   └── settings/          # System settings
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix-based)
│   ├── dashboard/        # Dashboard-specific components
│   ├── monitors/         # Monitor-related components
│   └── layout/           # Layout components
├── lib/                  # Utilities and core logic
│   ├── types.ts          # TypeScript type definitions
│   ├── db.ts             # Database connection and schema
│   └── actions.ts        # Server actions
└── hooks/                # Custom React hooks
```

## Core Domain Models

### Monitor Types

```typescript
type Monitor = {
  id: string;
  name: string;
  type: "Elasticsearch" | "SQL";
  status: "normal" | "alert" | "pending";
  lastCheck: string;
  alertHistory: AlertHistoryItem[];
};
```

### Supported Data Sources

- **SQL Databases**: Oracle, PostgreSQL, MySQL, SQLite
- **Elasticsearch**: Log monitoring via REST API
- **Kubernetes**: Event monitoring via API

### Alert Delivery Channels

- Telegram
- Webhooks (Slack, Discord, Generic, Custom)
- Email
- Custom scripts

## Development Guidelines

### Code Style & Conventions

1. **TypeScript**: Use strict typing, define proper interfaces in `types.ts`
2. **Components**: Follow React functional component patterns with hooks
3. **File Naming**:
   - Components: `kebab-case.tsx`
   - Pages: Next.js App Router conventions
   - Utilities: `kebab-case.ts`
4. **Import Organization**:

   ```typescript
   // External libraries
   import { useState } from "react";
   import { Button } from "@/components/ui/button";

   // Internal utilities
   import { cn } from "@/lib/utils";
   import type { Monitor } from "@/lib/types";
   ```

### UI Component Patterns

1. **Base Components**: Use Radix UI primitives in `components/ui/`
2. **Composition**: Build complex components by composing base components
3. **Styling**: Use Tailwind CSS with consistent color scheme
4. **Responsive**: Mobile-first responsive design
5. **Dark Theme**: Default dark theme with electric blue accents

### Database Operations

1. **SQLite**: Use better-sqlite3 for all database operations
2. **Migrations**: Handle schema changes gracefully
3. **Transactions**: Use transactions for data consistency
4. **Queries**: Optimize for performance with proper indexing

### State Management

1. **Server State**: Use Next.js server components and actions
2. **Client State**: React useState/useReducer for local state
3. **Form State**: React Hook Form with Zod validation
4. **Persistence**: Store all configuration in SQLite

## Feature Implementation Guidelines

### Adding New Monitor Types

1. Extend the `Monitor` type in `types.ts`
2. Create corresponding database schema
3. Add UI components in `components/monitors/`
4. Implement data collection logic in `lib/actions.ts`

### Adding New Alert Channels

1. Define webhook type in `types.ts`
2. Add configuration UI in `webhooks/` pages
3. Implement delivery logic in alert actions
4. Add platform-specific formatting

### Creating New Dashboard Components

1. Follow the established component structure
2. Use consistent status indicators (green=normal, red=alert)
3. Implement real-time updates where appropriate
4. Ensure responsive design

## Security Considerations

1. **Database**: Sanitize all SQL queries to prevent injection
2. **Webhooks**: Validate webhook URLs and payloads
3. **Credentials**: Store sensitive data securely in database
4. **API**: Implement proper error handling and rate limiting

## Performance Guidelines

1. **Database**: Use prepared statements and connection pooling
2. **React**: Implement proper memoization for expensive operations
3. **Monitoring**: Optimize query frequency to balance accuracy vs. performance
4. **UI**: Use loading states and skeleton components

## Testing Strategy

1. **Unit Tests**: Test utility functions and business logic
2. **Component Tests**: Test React components with proper mocking
3. **Integration Tests**: Test API routes and database operations
4. **E2E Tests**: Test critical user flows

## Deployment Considerations

1. **Docker**: Containerized deployment ready
2. **Kubernetes**: Support for Pod and CronJob deployment
3. **Persistence**: Ensure SQLite database persistence across restarts
4. **Environment**: Handle configuration through environment variables

## AI Integration Guidelines

When implementing AI features:

1. Use Genkit framework for consistent AI operations
2. Implement proper error handling for AI API calls
3. Cache AI responses when appropriate
4. Provide fallback mechanisms for AI failures

## Common Patterns to Follow

### Error Handling

```typescript
try {
  const result = await performOperation();
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return { success: false, error: error.message };
}
```

### Component Structure

```typescript
interface ComponentProps {
  // Define props with proper types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component implementation
  return <div className="consistent-styling">{/* Component JSX */}</div>;
}
```

### Database Operations

```typescript
export async function createMonitor(data: MonitorData) {
  const db = getDatabase();
  const stmt = db.prepare("INSERT INTO monitors ...");
  return stmt.run(data);
}
```

Remember: Alert Hub prioritizes reliability, clarity, and user experience in monitoring critical systems. Every feature should contribute to making system monitoring more effective and alerts more actionable.
