# TypeORM Migration Guide

## Overview

Alert Hub has been migrated from `better-sqlite3` to TypeORM for improved type safety, maintainability, and easier database management.

## Key Changes

### 1. Database Layer Architecture

**Before:**
- Direct SQLite access via `better-sqlite3`
- Manual SQL query construction
- Limited type safety

**After:**
- TypeORM with repository pattern
- Type-safe entity definitions
- Automatic migrations support
- Decorator-based schema definitions

### 2. Entity Definitions

All database models are now defined as TypeORM entities in `src/lib/entities/`:

- `User.ts` - User accounts and authentication
- `Session.ts` - User sessions
- `Monitor.ts` - Monitor configurations
- `AlertHistory.ts` - Alert event history
- `DataSource.ts` - Data source connections
- `Webhook.ts` - Webhook configurations

### 3. Data Access Patterns

**Before (better-sqlite3):**
```typescript
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(userId);
```

**After (TypeORM):**
```typescript
const dataSource = await getDataSource();
const userRepo = dataSource.getRepository(User);
const user = await userRepo.findOne({ where: { id: userId } });
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Configuration options:
- `DATABASE_PATH`: Path to SQLite database file (default: `sentinel.db`)
- `NODE_ENV`: Environment mode (`development` or `production`)

### 2. Database Initialization

The database will be automatically initialized on first run. To manually initialize with seed data:

1. Navigate to Settings in the dashboard
2. Click "Initialize Database"
3. Or run the initialization programmatically:

```typescript
import { initializeDb } from '@/lib/db';
await initializeDb();
```

### 3. Running Migrations

TypeORM will automatically run migrations when the database is initialized. The migration system ensures:

- Schema is created if it doesn't exist
- Existing data is preserved during updates
- Consistent database structure across environments

## Development Workflow

### Adding New Entities

1. Create entity file in `src/lib/entities/`:

```typescript
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('table_name')
export class MyEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  name!: string;
}
```

2. Export entity from `src/lib/entities/index.ts`:

```typescript
export { MyEntity } from './MyEntity';
```

3. Add entity to data source in `src/lib/data-source.ts`:

```typescript
const { MyEntity } = await import('./entities/MyEntity');
// Add to entities array
```

### Creating Migrations

While TypeORM supports automatic migration generation, for this SQLite setup, we use manual migrations:

1. Create migration file in `src/lib/migrations/`:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyMigration1234567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Migration logic here
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rollback logic here
  }
}
```

2. The migration will be automatically discovered and run.

### Querying Data

Use TypeORM repositories for type-safe database access:

```typescript
// Get data source
const dataSource = await getDataSource();

// Get repository
const monitorRepo = dataSource.getRepository(Monitor);

// Find operations
const monitors = await monitorRepo.find();
const monitor = await monitorRepo.findOne({ where: { id: '123' } });

// With relations
const monitorWithHistory = await monitorRepo.findOne({
  where: { id: '123' },
  relations: ['alertHistory'],
});

// Create and save
const newMonitor = monitorRepo.create({ id: '123', name: 'Test' });
await monitorRepo.save(newMonitor);

// Update
await monitorRepo.update({ id: '123' }, { name: 'Updated' });

// Delete
await monitorRepo.delete({ id: '123' });
```

## Server Actions and Client Components

For client components that need database access, use server actions defined in `src/lib/data-actions.ts`:

```typescript
// In a client component
'use client'

import { getMonitorById } from '@/lib/data-actions';

export default function MyComponent() {
  const [monitor, setMonitor] = useState(null);
  
  useEffect(() => {
    getMonitorById('123').then(setMonitor);
  }, []);
}
```

## Testing

### Local Testing

1. Initialize a test database:
```bash
DATABASE_PATH=test.db npm run dev
```

2. Reinitialize database via settings page

3. Verify all pages load correctly

### Production Deployment

1. Set production environment variables
2. Ensure `sentinel.db` is persisted in a volume
3. Backup database before deployment

## Troubleshooting

### Database Not Found

If you get "no such table" errors:
1. Go to Settings page
2. Click "Initialize Database"
3. Refresh the page

### Migration Errors

If migrations fail:
1. Check database file permissions
2. Verify `DATABASE_PATH` is writable
3. Check logs for specific error messages

### Build Errors

If you encounter TypeORM-related build errors:
- Ensure all entities use string-based relation definitions (not imports)
- Check that `next.config.ts` has proper webpack externals configuration
- Verify `tsconfig.json` has decorators enabled

## Benefits of TypeORM Integration

1. **Type Safety**: Full TypeScript support with typed repositories
2. **Maintainability**: Cleaner code with decorator-based schemas
3. **Developer Experience**: Better IDE autocomplete and refactoring
4. **Migration Management**: Structured approach to schema changes
5. **Relationships**: Easy management of entity relationships
6. **Query Builder**: Powerful query building capabilities
7. **Testing**: Easier to mock and test database operations

## Migration Checklist

- [x] Install TypeORM and dependencies
- [x] Create entity definitions
- [x] Set up data source configuration
- [x] Create initial migration
- [x] Update all database queries
- [x] Create server actions for client components
- [x] Test all pages and functionality
- [x] Update documentation
- [x] Remove better-sqlite3 dependency (optional)

## Support

For issues or questions:
1. Check the TypeORM documentation: https://typeorm.io
2. Review entity definitions in `src/lib/entities/`
3. Check server actions in `src/lib/data-actions.ts`
4. Examine data source configuration in `src/lib/data-source.ts`
