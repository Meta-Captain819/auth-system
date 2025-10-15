# 🔐 Secure Auth System

A modern, production-ready authentication system built with Next.js 15, NextAuth.js, MongoDB, and Prisma. Manage your favorite songs collection with secure user authentication.

## ✨ Features

### 🔒 **Security**
- **Bcrypt Password Hashing**: Passwords are securely hashed with bcrypt (salt rounds: 10)
- **Password Strength Validation**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Protected Routes**: Middleware-based authentication for sensitive pages
- **JWT Sessions**: Secure session management with NextAuth.js

### 🎨 **User Experience**
- **Toast Notifications**: Real-time feedback with react-hot-toast
- **Loading States**: Visual feedback during async operations
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-first Tailwind CSS styling
- **Clean UI**: Modern, intuitive interface

### 🎵 **Favorites Management**
- Add favorite songs to your personal collection
- Delete songs from your favorites
- Real-time updates without page refresh
- User-specific data isolation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd auth-system
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
auth-system/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth configuration
│   │   ├── register/            # User registration endpoint
│   │   └── favorites/           # Favorites CRUD endpoints
│   ├── favorites/               # Favorites page (protected)
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   ├── lib/
│   │   └── prisma.js           # Prisma client instance
│   ├── layout.js               # Root layout with Toaster
│   ├── page.js                 # Home page
│   └── error.js                # Global error boundary
├── prisma/
│   └── schema.prisma           # Database schema
├── middleware.js               # Route protection middleware
└── .env                        # Environment variables
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  name      String?
  email     String     @unique
  password  String
  favorites Favorite[]
  createdAt DateTime   @default(now())
}
```

### Favorite Model
```prisma
model Favorite {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  song      String
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.ObjectId
  createdAt DateTime @default(now())
}
```

## 🔐 Authentication Flow

1. **Registration**: 
   - User submits form → Validation → Password hashing → Database save → Redirect to login

2. **Login**: 
   - User submits credentials → NextAuth verification → JWT token generation → Session creation

3. **Protected Routes**: 
   - Middleware checks session → Redirects to login if unauthenticated → Grants access if authenticated

4. **Logout**: 
   - NextAuth `signOut()` → Session cleared → Redirect to home

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.5 (App Router with Turbopack)
- **React**: 19.1.0
- **Authentication**: NextAuth.js 4.24.11
- **Database**: MongoDB with Prisma ORM 6.17.1
- **Styling**: Tailwind CSS 4
- **Password Hashing**: bcrypt 6.0.0
- **Notifications**: react-hot-toast 2.6.0
- **Package Manager**: pnpm

## 📝 API Routes

### POST `/api/register`
Register a new user with validation.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### POST `/api/auth/[...nextauth]`
NextAuth authentication endpoint (handled by NextAuth).

### GET `/api/favorites`
Get all favorites for the authenticated user.

### POST `/api/favorites`
Add a new favorite song.

**Request Body:**
```json
{
  "song": "Song Name"
}
```

### DELETE `/api/favorites`
Delete a favorite song by ID.

**Request Body:**
```json
{
  "id": "favorite-id"
}
```

  

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ Passwords never stored in plain text
- ✅ JWT-based session management
- ✅ Protected API routes with session validation
- ✅ Input validation on both client and server
- ✅ Middleware-based route protection




## 📄 License

MIT License - feel free to use this project for learning or production.

