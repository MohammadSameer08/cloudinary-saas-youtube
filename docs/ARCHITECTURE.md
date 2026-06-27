# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
│              (Next.js Frontend + React Components)           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────────┐
│               Next.js App Router (SSR/CSR)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages:                                               │  │
│  │  - /              (redirects to /home)              │  │
│  │  - /home          (video gallery)                   │  │
│  │  - /video-upload  (upload & compress)               │  │
│  │  - /social-share  (image formatter)                 │  │
│  │  - /sign-in       (Clerk auth)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐    ┌───▼──┐    ┌───▼──────┐
    │Clerk │    │API   │    │Cloudinary│
    │Auth  │    │Routes│    │SDK       │
    └──────┘    └──┬───┘    └──────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼────┐ ┌──▼───┐ ┌───▼────┐
    │Upload  │ │Get   │ │Upload  │
    │Video   │ │Videos│ │Image   │
    └───┬────┘ └──┬───┘ └───┬────┘
        │         │         │
        └─────────┼─────────┘
                  │ Prisma ORM
        ┌─────────▼──────────┐
        │   PostgreSQL DB    │
        │    (Neon Cloud)    │
        │                    │
        │  - Videos table    │
        │  - User metadata   │
        └────────────────────┘

        ┌────────────────────┐
        │   Cloudinary API   │
        │                    │
        │ - Video compress   │
        │ - Image transform  │
        │ - File storage     │
        └────────────────────┘
```

---

## Folder Structure & Responsibilities

### `/src/app/` - Next.js App Directory

```
src/app/
├── (app)/                          # Protected routes group
│   ├── home/
│   │   └── page.tsx               # Video gallery
│   ├── video-upload/
│   │   └── page.tsx               # Upload video page
│   └── social-share/
│       └── page.tsx               # Social media image creator
├── api/                            # API Routes
│   ├── videos/
│   │   └── route.ts               # GET all videos
│   ├── video-upload/
│   │   └── route.ts               # POST upload video
│   └── image-upload/
│       └── route.ts               # POST upload image
├── layout.tsx                      # Root layout (Clerk Provider)
├── page.tsx                        # Root page (/ → /home)
└── globals.css                     # Global styles + dark theme
```

### `/src/middleware.ts` - Request Interceptor

```typescript
- Clerk authentication middleware
- Protects non-public routes
- Public routes: /, /sign-in, /sign-up, /home
- Redirects unauthenticated users to /sign-in
```

### `/src/components/` - Reusable UI Components

```
components/
├── VideoCard.tsx                   # Video display card
├── UploadForm.tsx                  # File upload form
└── SocialImagePreview.tsx          # Image preview
```

### `/prisma/` - Database Layer

```
prisma/
├── schema.prisma                   # Database schema (Video model)
├── migrations/                     # Migration history
└── generated/                      # Generated Prisma client
```

---

## Data Flow

### Video Upload Flow

```
1. User selects video file
   ↓
2. React component collects: file, title, description
   ↓
3. FormData sent to /api/video-upload (POST)
   ↓
4. Server receives file & metadata
   ↓
5. Cloudinary processes video (compress to MP4)
   ↓
6. Prisma creates Video record in database
   ↓
7. Response with video metadata returned to client
   ↓
8. Success message + redirect to /home
```

### Video Retrieval Flow

```
1. User navigates to /home (gallery page)
   ↓
2. useEffect triggers fetchVideos() callback
   ↓
3. Axios GET request to /api/videos
   ↓
4. Prisma queries all Video records from database
   ↓
5. JSON array returned with video metadata
   ↓
6. React renders VideoCard components
   ↓
7. User can download or delete videos
```

### Social Media Image Flow

```
1. User uploads image at /social-share
   ↓
2. Sends to /api/image-upload
   ↓
3. Cloudinary stores image
   ↓
4. Frontend displays with preset format dimensions:
   - Instagram Square (1:1): 1080x1080
   - Instagram Portrait (4:5): 1080x1350
   - Twitter (16:9): 1200x675
   - Twitter Header (3:1): 1500x500
   - Facebook Cover (205:78): 820x312
   ↓
5. User selects format from dropdown
   ↓
6. Image preview updates with correct aspect ratio
   ↓
7. Download button triggers file download
```

---

## Authentication Flow

```
┌────────────────┐
│   User Login   │
└────────┬───────┘
         │
    ┌────▼──────────────────┐
    │  Clerk Auth Page       │
    │  (Sign in / Sign up)   │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Clerk Session Created │
    │  JWT in Browser        │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────────┐
    │  Middleware Intercepts     │
    │  Checks isPublicRoute()    │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────────┐
    │  If Protected Route:       │
    │  - Allow with userId       │
    │  If Public Route:          │
    │  - Allow (no auth needed)  │
    └────┬──────────────────────┘
         │
    ┌────▼──────────────────┐
    │  Route Handler/Page    │
    │  Access to userId      │
    └────────────────────────┘
```

---

## Component Hierarchy

```
<RootLayout>              (src/app/layout.tsx)
  <ClerkProvider>
    <html data-theme="dark">
      <body>
        {children}
        
        <Route: />           (redirects to /home)
        <Route: /home>       (Home Component)
          <VideoCard />      (Multiple for each video)
            <Button />       (Download)
            <Button />       (Delete)
        
        <Route: /video-upload>   (VideoUpload Component)
          <input type="file" />
          <input type="text" />  (title)
          <textarea />           (description)
          <button />             (Submit)
        
        <Route: /social-share>   (SocialShare Component)
          <input type="file" />
          <select />             (Format selector)
          <img />                (Preview)
          <button />             (Download)
      </body>
    </html>
  </ClerkProvider>
</RootLayout>
```

---

## Database Schema

```
┌─────────────────────────┐
│        Video            │
├─────────────────────────┤
│ id: String (CUID)       │ Primary Key
│ title: String           │ Required
│ description: String?    │ Optional
│ publicId: String        │ Cloudinary ID
│ originalSize: String    │ File size (bytes)
│ compressedSize: String? │ After compression
│ duration: Float         │ Video length (sec)
│ createdAt: DateTime     │ Auto-timestamp
│ updatedAt: DateTime     │ Auto-timestamp
└─────────────────────────┘
```

---

## API Route Structure

### POST `/api/video-upload`
- Receives: multipart form data (file, title, description, originalSize)
- Process: Uploads to Cloudinary, creates DB record
- Returns: Video object with metadata
- Auth: Requires user login

### GET `/api/videos`
- Receives: Query parameters (optional filtering)
- Process: Queries database, returns all videos
- Returns: Array of Video objects
- Auth: Public route (no auth needed for reading)

### POST `/api/image-upload`
- Receives: multipart form data (image file)
- Process: Uploads to Cloudinary
- Returns: Public ID and URL
- Auth: Requires user login

---

## State Management

### Local State (React useState)
```
- uploadedImage: Image public ID
- selectedFormat: Social media format
- isUploading: Loading state
- videos: Array of Video objects
- loading: Page loading state
- error: Error message
```

### Global State (Clerk)
```
- userId: Authenticated user ID
- user: Full user object
- isLoaded: Auth initialization status
```

### Server State (Database)
```
- Video records in PostgreSQL
- User metadata from Clerk
```

---

## Error Handling

```
Try/Catch blocks in:
- API routes (video-upload, image-upload)
- useCallback hooks (fetchVideos, handleDownload)
- Event handlers (handleSubmit, handleFileUpload)

Error responses:
- 400: Bad request (missing fields)
- 500: Server error (database, Cloudinary)
- 401: Unauthorized (auth failed)

Client-side:
- alert() for immediate feedback
- console.log() for debugging
- Error state in React component
```

---

## Deployment Architecture

```
┌──────────────────┐
│  Vercel (CDN)    │
│  - Frontend      │
│  - API Routes    │
└────────┬─────────┘
         │
    ┌────▼──────────────┐
    │ Cloudinary CDN    │
    │ - Image Delivery  │
    │ - Video Streaming │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ Neon (PostgreSQL) │
    │ - Database        │
    └───────────────────┘
```

---

## Security Considerations

1. **Authentication**: All routes protected by Clerk middleware
2. **Environment Variables**: Sensitive keys stored in `.env.local`
3. **Cloudinary Credentials**: Secret key never exposed to client
4. **Database**: Prisma prevents SQL injection
5. **File Uploads**: Max 70MB validation on server
6. **CORS**: Configured for trusted domains only

---

## Performance Optimizations

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Cloudinary CDN for media files
- **Database Indexing**: Prisma on commonly queried fields
- **API Compression**: Gzip enabled

---

## Monitoring & Logging

Currently using:
- Browser DevTools console
- Server-side console.log()
- Clerk Dashboard for auth logs
- Cloudinary Dashboard for upload logs

Future additions:
- Sentry for error tracking
- Datadog/LogRocket for performance monitoring
- Database query logging with Prisma

---

See also:
- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Features Overview](./FEATURES.md)
