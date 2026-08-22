# Silo 🗄️⚡

> **Secure, fast, and modern cloud storage with direct S3 transfers and an AI-powered drive assistant (Silvi).**

---

## 🌟 Highlights

* **Direct-to-S3 Presigned Transfers**: Large files (up to several GBs) stream directly between browser and S3—never buffered into Node.js server memory.
* **Silvi AI Assistant**: Manage your drive in plain natural language (find files, breakdown storage, organize folders, share files) with built-in safety confirmation cards.
* **Full Folder Hierarchy**: Nested folders, interactive breadcrumbs, folder tree navigation, and drag-and-drop file movement.
* **Rich In-Browser Previews**: Built-in viewer for images, audio (with metadata extraction), videos, PDFs, and code snippets.
* **Strict Security & Privacy**: Better-Auth session cookies, unguessable random share slugs, post-upload server verification via S3 `HeadObject`, and forced `attachment` downloads against stored XSS.
* **Productivity Toolkit**: Command Palette (`Cmd+K` / `Ctrl+K`), Starred files, Soft-delete Trash with 1-click restore, Bulk actions, Storage breakdown, and Notification center.

---

## 🤖 Meet Silvi — Your AI Drive Assistant

Silvi is integrated directly into Silo to help you manage your files through conversational natural language commands powered by MuAPI (Gemini, Claude, GPT) tool calling.

### Silvi Capabilities:
* **🔍 Instant File Discovery**: `"Find my Q3 invoices"` or `"Show me all videos uploaded last week"` — searches by name, media type, folder, star status, or date range.
* **📊 Deep Storage Analytics**: `"What's taking up the most space?"` — returns breakdown by media type, largest files, and heaviest folders.
* **📁 Smart Organization**: `"Create a 'Designs' folder and move my latest Figma exports there"`.
* **⭐ Star & Restore**: `"Star my pitch deck"` or `"Restore the document I deleted earlier"`.
* **🛡️ Confirm-First Safety Model**: Destructive or privacy-impacting actions (deleting files/folders, making files public, or sharing via email) **always pause and render an interactive confirmation card** before executing.

---

## 🏗️ Architecture & Tech Stack

```
                               ┌─────────────────────────────┐
                               │     Browser (Next.js UI)    │
                               └───────┬─────────────▲───────┘
                     Session Cookie /  │             │  Direct Presigned
                     /api/* Rewrites   │             │  PUT / GET
                                       ▼             │
                        ┌──────────────────────┐     │
                        │ API (Express + TS)   │     │
                        └──────┬───────────────┘     │
                               │                     │
                    ┌──────────┴──────────┐          │
                    ▼                     ▼          ▼
            ┌──────────────┐         ┌───────────────────────┐
            │  PostgreSQL  │         │  AWS S3 File Storage  │
            │ (Neon/Docker)│         └───────────────────────┘
            └──────────────┘
```

### Frontend (`web/`)
* **Framework**: Next.js 15 (App Router, React 19)
* **Styling**: Tailwind CSS + shadcn/ui + Radix UI
* **Icons & Animation**: Lucide Icons + Motion (Framer Motion)
* **Session Proxying**: Next.js rewrites `/api/*` to the Express API to keep session cookies first-party and avoid cross-origin cookie issues.

### Backend (`api/`)
* **Runtime & Framework**: Node.js 20+ with Express & TypeScript
* **Database & ORM**: PostgreSQL (Neon-ready) with Drizzle ORM
* **Authentication**: Better Auth (Email/Password authentication, secure session cookies)
* **Storage Provider**: AWS S3 with `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`
* **AI Engine**: MuAPI (`gemini-2.0-flash`, `gemini-2.5-flash`, `gpt-4o-mini`, etc.) with structured tool-calling functions.
* **Security & Defense**: `helmet`, `express-rate-limit`, and extension denylists.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v20.x or higher
* **PostgreSQL Database**: [Neon](https://console.neon.tech) (Free tier) or local Docker Postgres instance
* **AWS Account**: S3 bucket and IAM user credentials

---

### 1. Database Setup

#### Option A: Neon PostgreSQL (Recommended)
Create a project on [Neon](https://console.neon.tech) and copy your connection string (`DATABASE_URL`).

#### Option B: Local Docker
```bash
docker run --name silo-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
# Connection URL: postgresql://postgres:postgres@localhost:5432/postgres
```

---

### 2. AWS S3 Bucket Setup

1. Create an S3 bucket (e.g., `my-silo-storage`).
2. Add the following **CORS configuration** to your S3 bucket (Permissions tab -> Cross-origin resource sharing):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. Create an IAM user policy with access to the bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:HeadObject"
      ],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

---

### 3. Environment Configuration

#### Backend (`api/.env`)
Create `api/.env` (copy from `api/.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Better Auth
BETTER_AUTH_SECRET="your-32-byte-hex-secret"
BETTER_AUTH_URL="http://localhost:4000"

# CORS
WEB_ORIGIN="http://localhost:3000"

# Server
PORT=4000
NODE_ENV="development"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
S3_BUCKET="YOUR_BUCKET_NAME"

# Limits & AI Assistant
MAX_UPLOAD_BYTES=2147483648
MUAPI_API_KEY="YOUR_MUAPI_KEY"
MUAPI_MODEL="gemini-2.0-flash"
```
> 💡 *Generate a random auth secret with:* `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

#### Frontend (`web/.env.local`)
Create `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

### 4. Installation & Running Locally

#### Run API Backend
```bash
cd api
npm install
npm run db:migrate   # Run database migrations
npm run dev          # Starts backend on http://localhost:4000
```

#### Run Web Frontend (In a separate terminal)
```bash
cd web
npm install
npm run dev          # Starts web app on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
Silo/
├── api/                     # Express + TypeScript backend
│   ├── drizzle/             # SQL schema migrations
│   ├── src/
│   │   ├── auth/            # Better-Auth integration
│   │   ├── db/              # Drizzle ORM client and schemas (files, folders, assistant, etc.)
│   │   ├── lib/             # S3 presigning, AI tool-calling definitions, validation
│   │   ├── routes/          # Express route controllers (files, folders, assistant, share, trash)
│   │   └── services/        # Core business and authorization logic
│   └── tests/               # Vitest test suites
│
├── web/                     # Next.js 15 frontend
│   ├── app/                 # Next.js App Router pages (auth, dashboard, public shares)
│   ├── components/
│   │   ├── assistant/       # Silvi AI chat interface, orb, and confirmation modals
│   │   ├── dashboard/       # File grids, folder trees, breadcrumbs, previews, toolbars
│   │   ├── landing/         # Marketing hero, feature showcases, and interactive demos
│   │   └── ui/              # shadcn/ui components
│   └── lib/                 # API client, upload handlers, audio metadata parsers
```

---

## 🛡️ Security Features

1. **Strict Ownership Boundaries**: Every single read/mutation enforces ownership at `getOwnedFileOrThrow` / `getOwnedFolderOrThrow` (returns 404 for nonexistent or unauthorized files to prevent enumeration).
2. **Unguessable Share Slugs**: Public access uses randomized non-sequential slug tokens (`/s/<slug>`), keeping file IDs private.
3. **Upload Verification**: After direct S3 PUT, `POST /api/files/:id/complete` performs an authoritative S3 `HeadObject` check to verify true byte size before activating the file.
4. **Stored XSS Prevention**: All file downloads strictly enforce `Content-Disposition: attachment`.
5. **Dangerous Extension Denylist**: Server-side filtering blocks executable and dangerous file extensions (`.exe`, `.bat`, `.sh`, `.msi`, etc.).

---

## 📜 Available Scripts

| Location | Command | Description |
| :--- | :--- | :--- |
| `api/` | `npm run dev` | Start Express backend in development mode |
| `api/` | `npm run db:migrate` | Run all pending Drizzle SQL migrations |
| `api/` | `npm run db:generate` | Generate SQL migrations from Drizzle schema |
| `api/` | `npm test` | Run Vitest unit & authorization tests |
| `api/` | `npm run build` | Compile TypeScript into production JavaScript |
| `web/` | `npm run dev` | Start Next.js frontend in development mode |
| `web/` | `npm run build` | Build Next.js production bundle |
| `web/` | `npm run lint` | Run ESLint check |

## 📄 License

Proprietary & Confidential. All rights reserved.
Unauthorized copying, modification, distribution, or commercial use of this project and its source code is strictly prohibited.
