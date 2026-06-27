# Setup & Installation Guide

## Prerequisites

Before you start, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A Cloudinary account (free tier available)
- A Clerk account (free tier available)
- PostgreSQL database (we use Neon for hosting)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd cloudinary-saas
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 16
- React 19
- Tailwind CSS & DaisyUI
- Prisma ORM
- Clerk authentication
- Cloudinary SDK

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# ===== CLERK AUTHENTICATION =====
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# ===== CLOUDINARY =====
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===== DATABASE =====
DATABASE_URL=postgresql://user:password@host:port/database
```

### Getting Environment Variables

#### Clerk Setup
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Copy your Publishable Key and Secret Key
4. Paste into `.env.local`

#### Cloudinary Setup
1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Go to Settings > API Keys
3. Copy your Cloud Name, API Key, and API Secret
4. Paste into `.env.local`

#### Database Setup (PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech) and create an account
2. Create a new project
3. Copy the connection string
4. Paste as `DATABASE_URL` in `.env.local`

## Step 4: Set Up Database

Initialize Prisma and create database tables:

```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev --name init
```

This creates all necessary tables based on `prisma/schema.prisma`.

## Step 5: Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 6: Verify Installation

1. Open your browser and visit `http://localhost:3000`
2. You should be redirected to `/home`
3. Click "Sign In" and verify Clerk authentication works
4. Test video upload at `/video-upload`
5. Test social media image creator at `/social-share`

---

## Common Issues & Solutions

### Issue: Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running (or use Neon cloud)
- Check network connectivity

### Issue: Clerk Authentication Not Working
```
Error: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set
```
**Solution**:
- Add the key to `.env.local`
- Restart dev server (`npm run dev`)
- Clear browser cache

### Issue: Cloudinary Upload Fails
```
Error: Cloudinary credentials not found
```
**Solution**:
- Verify all three Cloudinary env vars are set
- Check credentials in Cloudinary dashboard
- Ensure API key has upload permissions

### Issue: Tailwind/DaisyUI Styles Not Applied
```
Styles not showing, components unstyled
```
**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

## Project Structure After Installation

```
cloudinary-saas/
├── .env.local              # ← Environment variables (NEVER commit)
├── .next/                  # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── prisma/                 # Database schema
├── public/                 # Static files
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # Reusable components
│   └── lib/              # Utilities
├── docs/                  # Documentation
├── README.md             # This file
└── package.json          # Dependencies
```

---

## Next Steps

1. **Read Architecture Guide**: [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Explore API Endpoints**: [docs/API.md](./API.md)
3. **Understand Database**: [docs/DATABASE.md](./DATABASE.md)
4. **See Available Features**: [docs/FEATURES.md](./FEATURES.md)

---

## Development Workflow

### Making Changes
1. Edit files in `src/` directory
2. Dev server auto-reloads on save
3. Check console for errors

### Building for Production
```bash
npm run build
npm start
```

### Database Migrations
When you change `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name describe_your_changes
```

---

## Helpful Commands

```bash
# View database in UI
npx prisma studio

# Generate Prisma client
npx prisma generate

# Format Prisma schema
npx prisma format

# View migration history
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

---

## Troubleshooting

Run these diagnostics if something isn't working:

```bash
# Check Node version
node --version  # Should be 18+

# Check all dependencies installed
npm list

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate

# Check environment variables
cat .env.local
```

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Clerk Docs**: https://clerk.com/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **DaisyUI**: https://daisyui.com/docs

---

**Ready to develop?** Start with `npm run dev` and happy coding! 🚀
