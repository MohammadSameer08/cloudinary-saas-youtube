# Cloudinary SaaS - Video & Social Media Upload Platform

A modern full-stack web application for uploading, managing, and sharing videos and social media content with Cloudinary integration, built with Next.js 16 and TypeScript.

### Live Domain : https://cloudinary-saas-youtube.vercel.app/home

## 🚀 Quick Links

- [Setup & Installation](./docs/SETUP.md)
- [Project Architecture](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Features Overview](./docs/FEATURES.md)

---

## 📋 Project Overview

This SaaS platform enables users to:
- Upload and manage videos with automatic compression
- Create social media images with preset formats (Instagram, Twitter, Facebook)
- Download processed media files
- Secure authentication with Clerk
- PostgreSQL database with Prisma ORM
- Cloudinary integration for media processing

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16.2.9
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + DaisyUI 5.6.0
- **HTTP Client**: Axios
- **Authentication**: Clerk NextJS

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **Media Processing**: Cloudinary v2

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Build Tool**: Turbopack (Next.js)

---

## 📦 Key Dependencies

```json
{
  "next": "16.2.9",
  "react": "19.2.4",
  "typescript": "^5",
  "@clerk/nextjs": "^5+",
  "prisma": "latest",
  "cloudinary": "^1.x",
  "axios": "^1.x",
  "daisyui": "^5.6.0",
  "tailwindcss": "^4"
}
```

---

## 🗂 Project Structure

```
cloudinary-saas/
├── src/
│   ├── app/
│   │   ├── (app)/           # Authenticated routes
│   │   ├── api/             # REST API endpoints
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── middleware.ts        # Auth middleware
│   └── components/          # Reusable components
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Migration files
├── docs/                    # Documentation
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## 🚀 Getting Started

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd cloudinary-saas

# Install dependencies
npm install

# Set up .env.local with credentials
# See docs/SETUP.md for details

# Initialize database
npx prisma db push

# Start dev server
npm run dev
```

Visit `http://localhost:3000`

---

## 🔐 Authentication

**Provider**: Clerk
- Public routes: `/`, `/sign-in`, `/sign-up`, `/home`
- Protected routes: `/video-upload`, `/social-share`
- Middleware handles route protection

---

## 📤 Media Processing

### Cloudinary Integration
- **Videos**: Auto-compressed to MP4
- **Images**: Transformed for social media
- **Max file size**: 70MB videos
- **Storage**: Unlimited (Cloudinary)

---

## 🎨 Styling

**Tailwind CSS v4** + **DaisyUI v5.6**
- Dark theme enabled by default
- Responsive mobile-first design
- Pre-styled components included

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos |
| POST | `/api/video-upload` | Upload video |
| POST | `/api/image-upload` | Upload image |

See [API Documentation](./docs/API.md) for full details.

---

## 🎯 Features

- ✅ User authentication (Clerk)
- ✅ Video upload with compression
- ✅ Social media image creator
- ✅ Video gallery & management
- ✅ Download functionality
- ✅ PostgreSQL + Prisma ORM
- ✅ TypeScript throughout
- ✅ Dark theme UI
- ✅ Mobile responsive

---

## 🔧 Environment Variables

Create `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Database
DATABASE_URL=postgresql://...
```

---

## 📖 Full Documentation

- **[Setup & Installation Guide](./docs/SETUP.md)** - Step-by-step setup
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System design & data flow
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Database Schema](./docs/DATABASE.md)** - Database design & Prisma setup
- **[Features Overview](./docs/FEATURES.md)** - Current & planned features

---

## 🚀 Development Commands

```bash
# Development
npm run dev

# Build
npm run build
npm start

# Linting
npm run lint

# Database
npx prisma studio              # Open database UI
npx prisma migrate dev         # Create migration
npx prisma db push            # Push schema
npx prisma migrate reset      # Reset database
```

---

## 🌐 Deployment

Ready for:
- **Vercel** (recommended)
- **AWS Lambda**
- **Railway**
- **Docker**

---

## 📝 License

MIT License

---

## 🤝 Support

Refer to [documentation](./docs/) or create an issue.

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-28
