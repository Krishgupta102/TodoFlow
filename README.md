# TodoFlow — Full Stack Todo Application

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-brightgreen)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4-lightgrey)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8)](https://tailwindcss.com/)

A **production-quality, full-stack Todo application** built as an internship assignment. Features a multi-page React frontend, a RESTful Express API, and a MongoDB database — fully documented and GitHub-ready.

---

## 🚀 Features at a Glance

- ✅ Create, Read, Update, Delete (CRUD) todos
- 🔍 Search by title and description
- 🎛 Filter by priority and status
- 📊 Sort by date, due date, or priority
- ✔️ Toggle status between Pending and Completed
- 🗓 Due date tracking with overdue detection
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔔 Toast notifications for all user actions
- 💬 Delete confirmation dialogs
- ⏳ Loading skeleton cards and spinners
- 📋 Empty state illustrations

---

## 🛠 Tech Stack

| Layer      | Technologies                                    |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, React Router DOM, Axios, Tailwind CSS v3, React Icons |
| Backend    | Node.js, Express.js, Mongoose, dotenv, cors     |
| Database   | MongoDB                                         |
| Dev Tools  | nodemon, Vite HMR                               |

---

## 📁 Project Structure

```
todo-app/
├── client/                      # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Sticky navigation bar
│   │   │   ├── TodoCard.jsx     # Individual todo card
│   │   │   ├── Dialogs.jsx      # Form & confirm modals
│   │   │   ├── Toast.jsx        # Notification toasts
│   │   │   ├── Spinner.jsx      # Loading spinner
│   │   │   └── EmptyState.jsx   # Empty state illustration
│   │   ├── pages/
│   │   │   ├── TodosPage.jsx    # /todos — dashboard
│   │   │   └── TodoDetailPage.jsx # /todo?id= — detail view
│   │   ├── services/
│   │   │   ├── api.js           # Reusable Axios instance
│   │   │   └── todoService.js   # All API call functions
│   │   ├── hooks/
│   │   │   └── useTodos.js      # Custom todo state hook
│   │   ├── utils/
│   │   │   └── helpers.js       # Date, style, format utils
│   │   ├── App.jsx              # Router and layout
│   │   ├── main.jsx             # React root mount
│   │   └── index.css            # Global styles + Tailwind
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Node.js + Express backend
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   └── todoController.js    # Business logic
│   ├── models/
│   │   └── Todo.js              # Mongoose schema
│   ├── routes/
│   │   └── todoRoutes.js        # API routing
│   ├── middlewares/
│   │   ├── errorHandler.js      # Global error middleware
│   │   └── validator.js         # Request validation
│   ├── app.js                   # Express app setup
│   ├── server.js                # Entry point
│   └── .env                     # Environment variables
│
├── README.md
├── FEATURES.md
└── API.md
```

---

## ⚡ Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- **npm** v9+

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd todo-app-ziptrrip
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Edit the `.env` file to configure your MongoDB connection:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/todo-db
NODE_ENV=development
```

---

### 3. Setup the Frontend

```bash
cd client
npm install
```

---

## ▶️ Running the Application

### Start the Backend

```bash
# From the server/ directory
cd server
npm run dev      # Uses nodemon for hot-reload
# or
npm start        # Production start
```

The API will run at: **http://localhost:5000**

### Start the Frontend

```bash
# From the client/ directory
cd client
npm run dev
```

The app will run at: **http://localhost:5173**

---

## 🌐 Pages & Routes

| Route            | Description                      |
|------------------|----------------------------------|
| `/todos`         | Main dashboard — all todos       |
| `/todo?id=<id>`  | Detail view for a single todo    |

---

## 🧪 API Health Check

```
GET http://localhost:5000/api/health
```

Response:
```json
{ "success": true, "message": "Todo API is running 🚀" }
```

---

## 📸 Screenshots

> _Add screenshots of your running application here._

---

## 🔮 Future Improvements

- User authentication (JWT-based login/register)
- Drag-and-drop todo reordering
- Multiple todo lists / boards
- Due date calendar view
- Export todos to CSV/PDF
- Dark mode toggle
- Push notifications for due dates
- Collaborative todos with user invites

---

## 👤 Author

Built with ❤️ as part of an internship assignment.
