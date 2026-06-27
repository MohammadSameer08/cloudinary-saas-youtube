# API Documentation

## Base URL

```
http://localhost:3000/api
```

For production, replace with your deployed domain.

---

## Authentication

All endpoints require Clerk authentication via middleware. User context is available in request handlers through the `auth()` function.

```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  // userId is available for authenticated requests
}
```

---

## Endpoints

### 1. GET `/api/videos`

Retrieve all uploaded videos.

**Request:**
```http
GET /api/videos HTTP/1.1
```

**Query Parameters:**
```
(Currently none - returns all videos)
```

**Headers:**
```
Content-Type: application/json
```

**Response (200 OK):**
```json
[
  {
    "id": "clh1234567890abcdef",
    "title": "My Awesome Video",
    "description": "Video description here",
    "publicId": "video-uploads/clh1234567890abcdef",
    "originalSize": "104857600",
    "compressedSize": "52428800",
    "duration": 120.5,
    "createdAt": "2024-06-28T10:30:00Z",
    "updatedAt": "2024-06-28T10:30:00Z"
  },
  {
    "id": "clh9876543210fedcba",
    "title": "Another Video",
    "description": null,
    "publicId": "video-uploads/clh9876543210fedcba",
    "originalSize": "52428800",
    "compressedSize": "26214400",
    "duration": 60.25,
    "createdAt": "2024-06-27T15:45:00Z",
    "updatedAt": "2024-06-27T15:45:00Z"
  }
]
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Unexpected response format"
}

// 500 Internal Server Error
{
  "error": "Failed to fetch videos"
}
```

**Example Usage:**
```javascript
// JavaScript/Axios
const response = await axios.get("/api/videos");
const videos = response.data;

// Fetch API
const response = await fetch("/api/videos");
const videos = await response.json();
```

---

### 2. POST `/api/video-upload`

Upload a video file with metadata. Video is automatically compressed to MP4 format.

**Request:**
```http
POST /api/video-upload HTTP/1.1
Content-Type: multipart/form-data
```

**Form Data Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Video file (max 70MB) |
| `title` | String | Yes | Video title |
| `description` | String | No | Video description |
| `originalSize` | String | Yes | File size in bytes (as string) |

**Request Example:**
```javascript
const formData = new FormData();
formData.append("file", videoFile);
formData.append("title", "My Video Title");
formData.append("description", "A brief description");
formData.append("originalSize", videoFile.size.toString());

const response = await axios.post("/api/video-upload", formData);
```

**Response (200 OK):**
```json
{
  "id": "clh1234567890abcdef",
  "title": "My Video Title",
  "description": "A brief description",
  "publicId": "video-uploads/abc123def456",
  "originalSize": "104857600",
  "compressedSize": "52428800",
  "duration": 120.5,
  "createdAt": "2024-06-28T10:30:00Z",
  "updatedAt": "2024-06-28T10:30:00Z"
}
```

**Error Responses:**
```json
// 400 Bad Request - Missing file
{
  "error": "File not found"
}

// 400 Bad Request - File too large
{
  "error": "File size too large"
}

// 500 Internal Server Error - Cloudinary error
{
  "error": "Failed to upload video"
}

// 500 Internal Server Error - Missing credentials
{
  "error": "Cloudinary credentials not found"
}
```

**Constraints:**
- Max file size: 70MB
- Supported formats: All video formats (MP4, WebM, etc.)
- Output format: MP4 with auto quality
- Default duration if not available: 0 seconds

---

### 3. POST `/api/image-upload`

Upload an image file for social media. Image is stored on Cloudinary.

**Request:**
```http
POST /api/image-upload HTTP/1.1
Content-Type: multipart/form-data
```

**Form Data Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Image file (JPG, PNG, etc.) |

**Request Example:**
```javascript
const formData = new FormData();
formData.append("file", imageFile);

const response = await axios.post("/api/image-upload", formData);
```

**Response (200 OK):**
```json
{
  "publicId": "image-uploads/abc123def456",
  "url": "https://res.cloudinary.com/cloud-name/image/upload/v1234567890/image-uploads/abc123def456.jpg",
  "bytes": 524288
}
```

**Error Responses:**
```json
// 400 Bad Request - Missing file
{
  "error": "File not found"
}

// 500 Internal Server Error
{
  "error": "Failed to upload image"
}
```

---

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Invalid parameters or missing required fields |
| 401 | Unauthorized | Authentication required (redirect to signin) |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Endpoint doesn't exist |
| 500 | Server Error | Internal server error - check logs |

---

## Rate Limiting

Currently no rate limiting implemented. In production, consider:
- Cloudinary limits: ~100 uploads/minute free tier
- Database connections: Managed by Neon
- API route concurrency: Vercel default limits

---

## Data Types

### Video Object
```typescript
interface Video {
  id: string;              // CUID - unique identifier
  title: string;           // Video title
  description?: string;    // Optional description
  publicId: string;        // Cloudinary public ID
  originalSize: string;    // Original file size in bytes
  compressedSize?: string; // Compressed file size
  duration: number;        // Duration in seconds
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Image Upload Response
```typescript
interface ImageUploadResponse {
  publicId: string;  // Cloudinary public ID
  url: string;       // CDN URL
  bytes: number;     // File size in bytes
}
```

---

## Error Handling

All API errors follow this format:

```json
{
  "error": "Human-readable error message"
}
```

**Common errors:**
1. **"File not found"** - No file in form data
2. **"File size too large"** - Exceeds 70MB limit
3. **"Cloudinary credentials not found"** - Missing env vars
4. **"Unexpected response format"** - Invalid JSON response
5. **"Failed to upload video/image"** - Cloudinary or database error

---

## CORS Headers

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type
```

---

## Cloudinary Integration

### Upload Flow
1. File sent to `/api/video-upload` or `/api/image-upload`
2. Server creates upload stream to Cloudinary
3. Cloudinary processes and stores file
4. Metadata returned and saved to database
5. Public URL available for retrieval

### Public URLs
```
Video: https://res.cloudinary.com/cloud-name/video/upload/v{timestamp}/{publicId}.mp4
Image: https://res.cloudinary.com/cloud-name/image/upload/v{timestamp}/{publicId}.jpg
```

### Transformations Available
```
Quality: auto (jpg quality: 80)
Format: mp4 (videos), jpg (images)
Size: public_id + dimensions in DB
```

---

## Testing Endpoints

### Using cURL

**Get all videos:**
```bash
curl -X GET http://localhost:3000/api/videos
```

**Upload video:**
```bash
curl -X POST http://localhost:3000/api/video-upload \
  -F "file=@video.mp4" \
  -F "title=My Video" \
  -F "description=Description here" \
  -F "originalSize=104857600"
```

**Upload image:**
```bash
curl -X POST http://localhost:3000/api/image-upload \
  -F "file=@image.jpg"
```

### Using Postman

1. Create new request
2. Select method (GET/POST)
3. Enter URL: `http://localhost:3000/api/videos`
4. For POST: Body → form-data → add file and parameters
5. Send request

### Using JavaScript/Axios

```javascript
// GET videos
axios.get("/api/videos").then(res => console.log(res.data));

// POST video
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("title", titleInput.value);
formData.append("description", descriptionInput.value);
formData.append("originalSize", fileInput.files[0].size);

axios.post("/api/video-upload", formData).then(res => {
  console.log("Upload successful:", res.data);
});
```

---

## API Versioning

Currently on version 1 (no prefix). If needed in future:
```
/api/v1/videos
/api/v1/video-upload
/api/v2/videos  (if major changes)
```

---

## Pagination

Currently not implemented. Future improvements:
```
GET /api/videos?page=1&limit=10
GET /api/videos?skip=0&take=10
```

---

## Filtering & Sorting

Currently not implemented. Potential future features:
```
GET /api/videos?sort=createdAt&order=desc
GET /api/videos?minDuration=60&maxDuration=300
GET /api/videos?search=keyword
```

---

See also:
- [Database Schema](./DATABASE.md)
- [Architecture](./ARCHITECTURE.md)
- [Features](./FEATURES.md)
