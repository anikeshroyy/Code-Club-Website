<h1 align="center">
  🖥️ Code Club Website
</h1>

<p align="center">
  Official website of the <strong>Code Club — GEC Jamui</strong> — a full-stack web application for managing events, team members, gallery, announcements, and member applications with a powerful admin panel.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloudinary-Image_CDN-3448C5?logo=cloudinary&logoColor=white&style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
  - [Public Pages](#public-pages)
  - [Admin Panel](#admin-panel)
- [Tech Stack](#-tech-stack)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🌐 Overview

The **Code Club Website** is a modern, full-stack web application built for the Code Club of GEC Jamui. It serves as a central hub for students to discover events, learn about team members, view the photo gallery, read announcements, access learning resources, and apply to join the club. Club administrators can manage all content through a fully-featured, role-protected admin panel.

---

## 🔗 Live Demo

> 🌍 **Frontend:** [https://aarambhgecjamui.live](https://aarambhgecjamui.live)
> ⚙️ **Backend API:** Hosted on [Render](https://render.com)

---

## ✨ Features

### Public Pages

#### 🏠 Home Page
- Animated **Hero Section** with dynamic typing effect and gradient backgrounds
- **Upcoming Events** preview section pulled live from the database
- **About the Club** section with mission and vision highlights
- **Division/Domain Showcase** — lists the technical domains of the club
- **Announcements** ticker / highlight section

#### ℹ️ About Page
- Club history, mission, and vision
- **Faculty Coordinator** profiles with images, dynamically managed from the admin panel
- **Principal** showcase section with image
- Club **Convener** section with image

#### 🗃️ Events Page
- Live listing of **upcoming events** fetched from the backend
- Cards show event name, date, time, location, description, and registration status
- **Registration links** directly on each event card
- Smooth animated card entrance with `framer-motion`
- Link to the **Archived Events** page

#### 📦 Archived Events
- Full archive of past events
- Same card-based UI with status indicators

#### 🖼️ Gallery Page
- Responsive **masonry-style photo gallery**
- Images hosted on **Cloudinary** CDN
- Lazy loading for performance optimization
- Lightbox / full-view support

#### 📢 Announcements Page
- Paginated list of all announcements
- Date and category display
- Styled announcement cards with smooth fade-in animations

#### 📚 Resources Page
- Categorized **learning resources** (links, documents, guides)
- Organized by domain/technology
- Search / filter functionality

#### 🙋 Join Page
- **Membership application form** — students can submit their details online
- Fields: Name, Roll Number, Branch, Year, Skills, Motivation, Social links
- Form validation and success/error feedback
- Applications are reviewed by admin in the panel

---

### Admin Panel

The admin panel is a fully-featured, role-protected CMS accessible at `/admin`.

#### 🔐 Authentication
- **JWT-based** login system (7-day token expiry)
- Passwords hashed using **bcryptjs**
- Protected routing — all routes under `/admin` require a valid token
- `ProtectedRoute` component handles client-side auth guard

#### 📊 Admin Dashboard
- Overview cards showing counts of team members, events, gallery images, applications, and announcements
- Quick navigation to all management modules

#### 👥 Manage Team
- Add, edit, and delete **current team members**
- Support for **Alumni / Past Members** section (`isPastMember` flag)
- Upload member **profile photos** directly to Cloudinary
- Set social links: LinkedIn, GitHub, Instagram
- Control display order with `order` field

#### 🎓 Manage Faculty
- Add, edit, and remove **faculty coordinators**
- Upload faculty photos with Cloudinary integration
- Set designation, department, and contact info

#### 🖼️ Manage Gallery
- Upload new images to the gallery (stored on Cloudinary)
- Delete images (removes from both DB and Cloudinary via public ID)
- Caption and date management

#### 📢 Manage Announcements
- Create, edit, and delete announcements
- Set announcement title, content, category, and date

#### 📅 Manage Events
- Full CRUD for events
- Fields: Title, Date, Time, Location, Description, Image, Registration Link, Status
- **Archive / Unarchive** events with a single toggle
- Upload event banner images to Cloudinary

#### 📩 Manage Applications
- View all **join applications** submitted through the public form
- Mark applications as reviewed/pending
- Delete applications

#### 🛡️ Manage Admins *(Global Admin Only)*
- Create new admin accounts
- View all existing admins
- **Reset other admins' passwords** (global admin privilege)
- Delete admin accounts
- **Change own password** via a self-service modal in the header

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 18** | Core UI library (functional components + hooks) |
| **TypeScript 4.9** | Static type safety across the entire frontend |
| **React Router DOM v6** | Client-side routing with protected and nested routes |
| **Material UI (MUI) v5** | Component library — buttons, cards, forms, dialogs, grids |
| **Emotion** (`@emotion/react`, `@emotion/styled`) | CSS-in-JS engine powering MUI |
| **Styled Components v6** | Additional component-level styling |
| **Framer Motion v11** | Page transitions, staggered list animations, hero animations |
| **React Intersection Observer** | Trigger animations when elements enter the viewport |
| **React Lazy Load Image Component** | Image lazy loading for gallery performance |
| **Web Vitals** | Core Web Vitals performance reporting |
| **Create React App** | Project bootstrapping and build toolchain |
| **CRACO** | CRA config overrides without ejecting |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime for the server |
| **Express.js v4** | HTTP server and REST API framework |
| **MongoDB Atlas** | Cloud-hosted NoSQL database |
| **Mongoose v8** | MongoDB ODM — schema definitions, validation, queries |
| **JSON Web Tokens (JWT)** | Stateless admin authentication |
| **bcryptjs** | Password hashing and comparison |
| **Cloudinary SDK v2** | Image upload, storage, and deletion via CDN |
| **Multer** | `multipart/form-data` parsing for file uploads |
| **Streamifier** | Stream file buffer to Cloudinary (no disk writes) |
| **express-validator** | Request body validation and sanitization |
| **CORS** | Cross-origin request handling |
| **dotenv** | Environment variable management |
| **Nodemon** | Auto-restart during development |

---

## 📁 Project Structure

```
code-club-website/
│
├── backend/                        # Express REST API
│   └── src/
│       ├── middleware/
│       │   ├── auth.js             # JWT verification middleware
│       │   └── upload.js           # Multer + Cloudinary upload handler
│       ├── models/
│       │   ├── Admin.js            # Admin user schema
│       │   ├── Announcement.js     # Announcement schema
│       │   ├── Event.js            # Event schema
│       │   ├── FacultyCoordinator.js
│       │   ├── GalleryImage.js     # Gallery image schema
│       │   ├── JoinApplication.js  # Member application schema
│       │   └── TeamMember.js       # Team member schema (+ alumni flag)
│       ├── routes/
│       │   ├── auth.js             # POST /api/auth/login, /change-password
│       │   ├── admins.js           # Admin CRUD + password reset
│       │   ├── announcements.js    # Announcements CRUD
│       │   ├── events.js           # Events CRUD + archive toggle
│       │   ├── faculty.js          # Faculty CRUD + image upload
│       │   ├── gallery.js          # Gallery image upload/delete
│       │   ├── join.js             # Join application submit/manage
│       │   └── team.js             # Team CRUD + image upload
│       ├── index.js                # Express app entry point
│       └── seed.js                 # Auto-seeds first admin on startup
│
├── src/                            # React TypeScript frontend
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx     # Admin sidebar + header shell
│   │   │   └── ProtectedRoute.tsx  # JWT-based route guard
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── AnnouncementSection.tsx
│   │   │   ├── DivisionSection.tsx
│   │   │   └── UpcomingEventSection.tsx
│   │   └── layout/
│   │       ├── Navbar.tsx          # Responsive navbar with dark mode toggle
│   │       ├── Footer.tsx          # Site footer with links
│   │       ├── Layout.tsx          # Wraps public pages
│   │       └── ThemeToggle.tsx     # Light/dark mode button
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── ArchivedEventsPage.tsx
│   │   ├── GalleryPage.tsx
│   │   ├── AnnouncementsPage.tsx
│   │   ├── ResourcesPage.tsx
│   │   ├── JoinPage.tsx
│   │   └── admin/
│   │       ├── AdminLogin.tsx
│   │       ├── AdminDashboard.tsx
│   │       ├── ManageTeam.tsx
│   │       ├── ManageFaculty.tsx
│   │       ├── ManageGallery.tsx
│   │       ├── ManageAnnouncements.tsx
│   │       ├── ManageEvents.tsx
│   │       ├── ManageApplications.tsx
│   │       └── ManageAdmins.tsx
│   ├── services/
│   │   └── api.ts                  # Base API URL config
│   ├── theme/
│   │   ├── ThemeContext.tsx         # Light/dark theme provider
│   │   └── globalStyles.tsx        # Global MUI theme overrides
│   ├── hooks/                      # Custom React hooks
│   ├── utils/                      # Utility/helper functions
│   └── App.tsx                     # Root router and route definitions
│
├── public/                         # Static public assets
├── .gitignore
├── package.json                    # Frontend dependencies
├── tsconfig.json                   # TypeScript configuration
└── README.md
```

---

## 📡 API Reference

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Server health check |
| `POST` | `/api/auth/login` | ❌ | Admin login (returns JWT) |
| `PUT` | `/api/auth/change-password` | ✅ | Change own password |
| `GET` | `/api/team` | ❌ | Get all team members |
| `POST` | `/api/team` | ✅ | Add a team member |
| `PUT` | `/api/team/:id` | ✅ | Update a team member |
| `DELETE` | `/api/team/:id` | ✅ | Delete a team member |
| `GET` | `/api/faculty` | ❌ | Get all faculty coordinators |
| `POST` | `/api/faculty` | ✅ | Add faculty coordinator |
| `PUT` | `/api/faculty/:id` | ✅ | Update faculty coordinator |
| `DELETE` | `/api/faculty/:id` | ✅ | Delete faculty coordinator |
| `GET` | `/api/gallery` | ❌ | Get all gallery images |
| `POST` | `/api/gallery` | ✅ | Upload a gallery image |
| `DELETE` | `/api/gallery/:id` | ✅ | Delete a gallery image |
| `GET` | `/api/events` | ❌ | Get active (non-archived) events |
| `GET` | `/api/events/archive` | ❌ | Get archived events |
| `POST` | `/api/events` | ✅ | Create an event |
| `PUT` | `/api/events/:id` | ✅ | Update an event |
| `DELETE` | `/api/events/:id` | ✅ | Delete an event |
| `GET` | `/api/announcements` | ❌ | Get all announcements |
| `POST` | `/api/announcements` | ✅ | Create an announcement |
| `PUT` | `/api/announcements/:id` | ✅ | Update an announcement |
| `DELETE` | `/api/announcements/:id` | ✅ | Delete an announcement |
| `POST` | `/api/join` | ❌ | Submit a join application |
| `GET` | `/api/join` | ✅ | Get all applications |
| `PUT` | `/api/join/:id` | ✅ | Update application status |
| `DELETE` | `/api/join/:id` | ✅ | Delete an application |
| `GET` | `/api/admins` | ✅ | Get all admins (global only) |
| `POST` | `/api/admins` | ✅ | Create a new admin |
| `PUT` | `/api/admins/:id/reset-password` | ✅ | Reset another admin's password |
| `DELETE` | `/api/admins/:id` | ✅ | Delete an admin |

> ✅ = Requires `Authorization: Bearer <token>` header

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **MongoDB Atlas** account (free tier works)
- A **Cloudinary** account (free tier works)

---

### Frontend Setup

```bash
# 1. Clone the repository
git clone https://github.com/Anikeshroy/Code-Club-Website.git
cd Code-Club-Website

# 2. Install dependencies
npm install

# 3. Create a .env file in the root
echo "REACT_APP_API_BASE_URL=http://localhost:5000/api" > .env

# 4. Start the development server
npm start
```

The app will be available at `http://localhost:3000`.

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create the .env file (see Environment Variables section)
cp .env.example .env
# Then edit .env with your own values

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

> **Note:** On first startup, if no admin exists in the database, the `seed.js` script automatically creates a default admin account. Check `backend/src/seed.js` for credentials and **change the password immediately** after first login.

---

## 🔐 Environment Variables

### Frontend (`.env` in root)

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)

```env
PORT=5000

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/code-club?retryWrites=true&w=majority

# JWT secret key (use a long, random string)
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# Cloudinary credentials (from your Cloudinary dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

---

## ☁️ Deployment

| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend (React) — auto-deploys from `main` branch |
| **Render** | Backend (Express) — deployed as a Web Service |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image hosting CDN |

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set **Build Command**: `npm run build`
3. Set **Output Directory**: `build`
4. Add `REACT_APP_API_BASE_URL` as an environment variable in Vercel settings

### Backend (Render)

1. Connect your GitHub repo to Render
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add all backend environment variables in Render's dashboard

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

<p align="center">Made with ❤️ by the Code Club — GEC Jamui</p>
