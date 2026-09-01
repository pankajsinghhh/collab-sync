<div align="center">

# 🚀 CollabSync

### A modern fullstack project management tool for teams

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-endpoints) · [Screenshots](#-screenshots)

</div>

---

## 📌 Overview

**CollabSync** is a fullstack project management application built for teams to collaborate efficiently. It supports project creation, kanban-style task management, role-based access control, subtasks, file attachments, and a complete authentication system with email verification.

---

## ✨ Features

### 🔐 Authentication
- Register & Login with JWT (Access + Refresh tokens)
- Email verification on signup
- Forgot & Reset password via email
- Secure cookie-based session management

### 📁 Project Management
- Create, update, and delete projects
- View all projects you're a member of
- See member count and your role per project

### ✅ Task Management (Kanban Board)
- Create tasks with title, description, status, and assignee
- Kanban board with **Todo / In Progress / Done** columns
- Delete tasks
- File attachments on tasks
- Subtask support inside tasks

### 👥 Team Management
- Add members to projects via email
- Assign roles: **Admin**, **Project Admin**, **Member**
- Update and remove members

### 🛡️ Role-Based Access Control

| Feature | Admin | Project Admin | Member |
|---|---|---|---|
| Create/Delete Project | ✅ | ❌ | ❌ |
| Manage Members | ✅ | ❌ | ❌ |
| Create/Delete Tasks | ✅ | ✅ | ❌ |
| View Tasks | ✅ | ✅ | ✅ |
| Create/Delete Subtasks | ✅ | ✅ | ❌ |
| Update Subtask Status | ✅ | ✅ | ✅ |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v5 | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Nodemailer + Mailgen | Email service |
| Multer | File uploads |
| Express Validator | Input validation |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS v4 | Styling |
| Context API | Global state (auth) |
| Vite | Build tool |

---

## 📁 Project Structure

```
collabsync/
├── src/                          # Backend source
│   ├── controllers/              # Route handlers
│   │   ├── auth.controllers.js
│   │   ├── project.controllers.js
│   │   ├── task.controllers.js
│   │   └── healthcheck.controllers.js
│   ├── models/                   # Mongoose schemas
│   │   ├── user.models.js
│   │   ├── project.models.js
│   │   ├── projectmember.models.js
│   │   ├── task.models.js
│   │   ├── subtask.models.js
│   │   └── note.models.js
│   ├── routes/                   # Express routes
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   └── healthcheck.routes.js
│   ├── middlewares/              # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── multer.middleware.js
│   │   └── validator.middleware.js
│   ├── utils/                    # Helpers
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   ├── constants.js
│   │   └── mail.js
│   ├── validators/               # Input validators
│   │   └── index.js
│   ├── db/                       # Database connection
│   │   └── index.js
│   ├── app.js                    # Express app setup
│   └── index.js                  # Entry point
│
├── client/                       # Frontend source
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── project/
│   │   │       └── ProjectDetail.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── public/
│   └── images/                   # Uploaded files
├── package.json
└── .env
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Mailtrap account (for email testing)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/collabsync.git
cd collabsync
```

### 2. Setup environment variables
Create a `.env` file in the root:
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

CORS_ORIGIN=http://localhost:5173

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password

MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_pass

SERVER_URL=http://localhost:8000
```

### 3. Install & run backend
```bash
npm install
npm run dev
```

### 4. Install & run frontend
```bash
cd client
npm install
npm run dev
```

### 5. Open in browser
```
Frontend → http://localhost:5173
Backend  → http://localhost:8000
```

---

## 📡 API Endpoints

### Auth Routes `/api/v1/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/logout` | Logout user | ✅ |
| GET | `/current-user` | Get logged in user | ✅ |
| POST | `/change-password` | Change password | ✅ |
| POST | `/refresh-token` | Refresh access token | ❌ |
| GET | `/verify-email/:token` | Verify email | ❌ |
| POST | `/forgot-password` | Request password reset | ❌ |
| POST | `/reset-password/:token` | Reset password | ❌ |
| POST | `/resend-email-verification` | Resend verification | ✅ |

### Project Routes `/api/v1/projects`
| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/` | Get all projects | Any |
| POST | `/` | Create project | Any |
| GET | `/:projectId` | Get project by ID | Any |
| PUT | `/:projectId` | Update project | Admin |
| DELETE | `/:projectId` | Delete project | Admin |
| GET | `/:projectId/members` | Get members | Any |
| POST | `/:projectId/members` | Add member | Admin |
| PUT | `/:projectId/members/:userId` | Update member role | Admin |
| DELETE | `/:projectId/members/:userId` | Remove member | Admin |

### Task Routes `/api/v1/projects`
| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/:projectId/tasks` | Get all tasks | Any |
| POST | `/:projectId/tasks` | Create task | Any |
| GET | `/:projectId/tasks/:taskId` | Get task by ID | Any |
| PUT | `/:projectId/tasks/:taskId` | Update task | Admin |
| DELETE | `/:projectId/tasks/:taskId` | Delete task | Admin |
| POST | `/:projectId/tasks/:taskId/subtasks` | Create subtask | Any |
| PUT | `/:projectId/tasks/:taskId/subtasks/:subtaskId` | Update subtask | Any |
| DELETE | `/:projectId/tasks/:taskId/subtasks/:subtaskId` | Delete subtask | Admin |

---

## 🗄️ Data Models

```
User
├── username, email, password, fullName
├── avatar { url, localPath }
├── isEmailVerified
├── refreshToken
├── forgotPasswordToken + Expiry
└── emailVerificationToken + Expiry

Project
├── name, description
└── createdBy → User

ProjectMember
├── user → User
├── project → Project
└── role (admin | project_admin | member)

Task
├── title, description
├── project → Project
├── assignedTo → User
├── assignedBy → User
├── status (todo | in_progress | done)
└── attachments [{ url, mimetype, size }]

Subtask
├── title
├── task → Task
├── isCompleted
└── createdBy → User

ProjectNote
├── content
├── project → Project
└── createdBy → User
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

<div align="center">

Built with ❤️ by **Pankaj Singh**

⭐ Star this repo if you found it helpful!

</div>