# Build Filter System

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Design Patterns & Architecture](#design-patterns--architecture)
4. [Technology Stack](#technology-stack)
5. [Implementation Highlights](#implementation-highlights)
6. [Installation & Setup](#installation--setup)
7. [Database Schema](#database-schema)
8. [Project Structure](#project-structure)
9. [API Endpoints](#api-endpoints)
10. [Future Improvements](#future-improvements)
11. [Contributing](#contributing)
12. [License](#license)

## Project Overview

A Next.js application that implements a sophisticated filtering system for managing and querying builds based on their attributes. The system allows users to create, save, and share complex filters through URLs, enabling efficient build management and collaboration.

## Key Features

- Dynamic filter creation with nested AND/OR conditions
- Real-time URL synchronization for filter sharing
- Build management with custom attributes
- Saved filters functionality
- Responsive and intuitive UI
- Type-safe implementation

## Design Patterns & Architecture

### Context Pattern

- Implemented via `UrlContext` for global filter state management.
- Provides centralized filter operations and state updates.
- Enables real-time URL synchronization.

### Repository Pattern

- Used in the data access layer with Prisma.
- Separates database operations from business logic.
- Improves testability and maintainability.

### Observer Pattern

- Applied through React Query for data fetching.
- Enables automatic UI updates on data changes.
- Manages cache invalidation efficiently.

### Factory Pattern

- Used in filter condition creation.
- Standardizes the creation of filter groups and conditions.
- Maintains consistency in filter structure.

## Technology Stack

### Frontend

- **Next.js 15.1.2**: Server-side rendering and routing.
- **React 19**: UI components and hooks.
- **TypeScript**: Type safety and better developer experience.
- **Chakra UI**: Responsive and accessible components.
- **React Query**: Server state management and caching.
- **React Select**: Enhanced select inputs.
- **Framer Motion**: Smooth animations.

### Backend

- **Prisma**: Type-safe database access.
- **Next.js API Routes**: RESTful API endpoints.
- **Base64 ArrayBuffer**: Filter serialization for URL sharing.

### Database

- **SQLite**: Lightweight embedded database (via Prisma).

## Implementation Highlights

### Filter System

```typescript
type FilterCondition = {
  id: string;
  attributeId: string;
  operator: 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value: string;
};

type FilterGroup = {
  id: string;
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
};
```

- Supports nested filter groups.
- Dynamic operator selection based on attribute type.
- URL-friendly serialization.
- Simulates Prisma ORM condition building with a user-friendly UI, allowing users to construct queries interactively, save them to the database, and share via URLs.

### URL Synchronization

- Debounced URL updates to prevent excessive history entries.
- Base64 encoding for compact filter representation.
- Automatic filter restoration from URL parameters.

### Performance Optimizations

- Memoized components to prevent unnecessary re-renders.
- Efficient filter tree traversal.
- React Query caching for API requests.

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- SQLite database
- npm (or pnpm as an alternative)

### Step 1: Clone and Install Dependencies

```bash
git clone https://github.com/khannoussi-malek/strutio-filter.git
cd filter-system
npm install
```

### Step 2: Database Setup

1. Create an SQLite database or ensure `DATABASE_URL` in the `.env` file points to an SQLite file:

```bash
cp .env.example .env
```

2. Update `.env` with your SQLite database URL:

```
DATABASE_URL="file:./dev.db"
```

3. Run Prisma migrations:

```bash
npx prisma generate
npx prisma db push
```

### Step 3: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Database Schema

```prisma
model Build {
  id          String            @id @default(uuid())
  name        String
  description String?
  attributes  AttributeBuild[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model Attribute {
  id        String           @id @default(uuid())
  name      String           @unique
  type      String
  builds    AttributeBuild[]
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}

model AttributeBuild {
  id          String    @id @default(uuid())
  buildId     String
  attributeId String
  value       String
  build       Build     @relation(fields: [buildId], references: [id])
  attribute   Attribute @relation(fields: [attributeId], references: [id])

  @@unique([buildId, attributeId])
}

model Filter {
  id        String   @id @default(uuid())
  name      String
  conditions String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Project Structure

```
├── components/          # React components
├── context/            # Context providers
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
├── prisma/            # Database schema and migrations
├── public/            # Static assets
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## API Endpoints

### `GET /api/builds`

- Fetches builds with optional filter parameter.
- Supports complex filter conditions.
- Returns builds with their attributes.

### `POST /api/builds`

- Creates new builds with attributes.
- Validates input data.
- Returns created build.

### `GET /api/attributes`

- Retrieves available attributes.
- Used for filter creation.

### `POST /api/attributes`

- Creates new attributes.
- Validates attribute type.

### `GET /api/filters`

- Retrieves saved filters.
- Used for filter management.

### `POST /api/filters`

- Saves new filters.
- Validates filter structure.

## Future Improvements

1. Add filter templates for common queries.
2. Implement real-time collaboration.
3. Add bulk operations for builds.
4. Enhanced filter visualization.
5. Performance optimization for large datasets.
6. Advanced caching strategies.
7. Filter analytics and usage tracking.
8. Export/import functionality for filters.

## Contributing

1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

## License

MIT

