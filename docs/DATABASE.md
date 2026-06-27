# Database Schema & Setup

## Overview

**Database Type**: PostgreSQL (Relational)  
**Hosting**: Neon (Cloud PostgreSQL)  
**ORM**: Prisma  
**Schema Location**: `prisma/schema.prisma`  
**Migrations**: `prisma/migrations/`

---

## Current Schema

### Video Model

The primary data model for storing video metadata.

```prisma
model Video {
  id             String   @id @default(cuid())
  title          String
  description    String?
  publicId       String
  originalSize   String
  compressedSize String?
  duration       Float
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier (CUID) - auto-generated |
| `title` | String | Yes | Video title/name |
| `description` | String? | No | Optional video description |
| `publicId` | String | Yes | Cloudinary public ID for retrieval |
| `originalSize` | String | Yes | Original file size in bytes (stored as string) |
| `compressedSize` | String? | No | Compressed file size after processing |
| `duration` | Float | Yes | Video duration in seconds |
| `createdAt` | DateTime | Yes | Timestamp when record created |
| `updatedAt` | DateTime | Yes | Timestamp when record last updated |

---

## Database Setup

### Step 1: Create Neon Account

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up with email or GitHub
3. Create a new project
4. Choose region closest to you
5. Copy connection string

### Step 2: Add to .env.local

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

Example:
```env
DATABASE_URL=postgresql://neon_user:password123@ep-cool-db.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Initialize Prisma

First time setup:

```bash
# Install Prisma
npm install -D prisma

# Initialize (creates schema.prisma)
npx prisma init

# Push schema to database
npx prisma db push
```

### Step 4: Verify Connection

```bash
# Open Prisma Studio (UI for database)
npx prisma studio

# This opens http://localhost:5555 with database viewer
```

---

## Prisma Configuration

### prisma/schema.prisma

```prisma
datasource db {
  provider = "postgresql"
}

generator client {
  provider = "prisma-client"
  output   = "./generated"
}

model Video {
  // ... fields
}
```

**Provider**: PostgreSQL (works with Neon)  
**Output**: Generated Prisma client in `./generated` folder  
**Access**: Use `PrismaClient` from `@prisma/client`

---

## Migrations

Migrations track schema changes over time.

### Creating a Migration

After modifying `schema.prisma`:

```bash
npx prisma migrate dev --name add_new_field

# Examples:
npx prisma migrate dev --name initial_setup
npx prisma migrate dev --name add_video_duration
npx prisma migrate dev --name make_description_optional
```

### Migration Files

```
prisma/migrations/
├── 20240628_init/
│   └── migration.sql
├── 20240628_add_duration/
│   └── migration.sql
└── migration_lock.toml
```

Each folder contains `migration.sql` with SQL commands.

### View Migration Status

```bash
npx prisma migrate status

# Output:
# Status of migrations on database
# 
# 3 migrations found in prisma/migrations
# 
# Your database is in sync with your schema.
```

### Reset Database (WARNING: Deletes all data!)

```bash
npx prisma migrate reset

# This:
# 1. Drops database
# 2. Recreates database
# 3. Runs all migrations
# 4. Runs seed script (if exists)
```

---

## Using Prisma Client

### Installation

```bash
npm install @prisma/client
```

### Basic Usage

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create
await prisma.video.create({
  data: {
    title: "My Video",
    description: "A cool video",
    publicId: "video123",
    originalSize: "104857600",
    compressedSize: "52428800",
    duration: 120.5
  }
});

// Read all
const allVideos = await prisma.video.findMany();

// Read one
const video = await prisma.video.findUnique({
  where: { id: "clh1234567890abcdef" }
});

// Update
await prisma.video.update({
  where: { id: "clh1234567890abcdef" },
  data: { title: "Updated Title" }
});

// Delete
await prisma.video.delete({
  where: { id: "clh1234567890abcdef" }
});
```

### API Route Example

```typescript
// src/app/api/videos/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" }
    });
    return Response.json(videos);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const video = await prisma.video.create({ data });
    return Response.json(video, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
```

---

## Prisma Studio

Visual database manager:

```bash
npx prisma studio

# Opens http://localhost:5555
```

Features:
- View all records in each table
- Create new records
- Edit existing records
- Delete records
- Search and filter
- Pagination

---

## Query Examples

### Get all videos sorted by date

```typescript
const videos = await prisma.video.findMany({
  orderBy: { createdAt: "desc" }
});
```

### Get videos by title

```typescript
const videos = await prisma.video.findMany({
  where: {
    title: { contains: "search term", mode: "insensitive" }
  }
});
```

### Get videos with duration > 60 seconds

```typescript
const videos = await prisma.video.findMany({
  where: {
    duration: { gt: 60 }
  }
});
```

### Count total videos

```typescript
const count = await prisma.video.count();
```

### Pagination

```typescript
const videos = await prisma.video.findMany({
  skip: 10,      // Skip first 10
  take: 20,      // Take next 20
  orderBy: { createdAt: "desc" }
});
```

---

## Performance Optimization

### Indexes

Add indexes for frequently queried fields:

```prisma
model Video {
  id    String @id @default(cuid())
  title String @index  // Add index for search
  createdAt DateTime @default(now()) @index
  
  // ... other fields
}
```

Then create migration:
```bash
npx prisma migrate dev --name add_indexes
```

### Query Optimization

Use `select` to only fetch needed fields:

```typescript
// Bad: Fetches all fields
const videos = await prisma.video.findMany();

// Good: Only needed fields
const videos = await prisma.video.findMany({
  select: {
    id: true,
    title: true,
    duration: true
  }
});
```

---

## Data Types Reference

### Prisma Types → PostgreSQL

| Prisma | PostgreSQL | JavaScript |
|--------|-----------|------------|
| String | VARCHAR | string |
| Int | INTEGER | number |
| Float | REAL/FLOAT | number |
| Boolean | BOOLEAN | boolean |
| DateTime | TIMESTAMP | Date |
| Json | JSONB | object |
| BigInt | BIGINT | bigint |

---

## Backup & Restore

### Backup Database

Neon provides automatic backups. Manual backup:

```bash
# Using pg_dump
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database

```bash
# Using psql
psql $DATABASE_URL < backup.sql
```

---

## Troubleshooting

### Connection Issues

```
Error: ECONNREFUSED
```

**Solution:**
1. Check DATABASE_URL in .env.local
2. Verify Neon is running
3. Check network connectivity
4. Restart dev server

### Migration Conflicts

```
Error: Migration failed
```

**Solution:**
```bash
# Reset and try again
npx prisma migrate reset

# Or manually edit prisma/schema.prisma and retry
npx prisma migrate dev
```

### Stale Prisma Client

```
Error: Type not found
```

**Solution:**
```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

---

## Future Schema Enhancements

Potential additions:

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String?
  videos Video[]
}

model Video {
  // ... existing fields
  userId    String
  user      User @relation(fields: [userId], references: [id])
  
  tags      String[]
  isPublic  Boolean @default(false)
  views     Int @default(0)
  likes     Int @default(0)
}

model Comment {
  id    String @id @default(cuid())
  text  String
  videoId String
  video   Video @relation(fields: [videoId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Neon Docs**: https://neon.tech/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Prisma Studio**: Run `npx prisma studio`

---

See also:
- [API Documentation](./API.md)
- [Architecture](./ARCHITECTURE.md)
- [Setup Guide](./SETUP.md)
