# Cantilever Blog Website

A full-stack MERN blog platform with user registration, login/logout, and protected CRUD operations for blog posts.

## Features

- User registration and login/logout
- JWT-based authentication
- Create, read, update, and delete blog posts
- Protected author-only edit and delete actions
- Responsive React UI
- MongoDB database integration with Mongoose

## Tech Stack

Frontend: React, React Router, Axios, HTML, CSS, JavaScript

Backend: Node.js, Express

Database: MongoDB Atlas or local MongoDB, Mongoose

Auth: JSON Web Token, bcryptjs

## Project Structure

```
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Create the database

You can use MongoDB Atlas or a local MongoDB instance.

#### Option A: MongoDB Atlas

1. Create a free account at MongoDB Atlas.
2. Create a new cluster.
3. Add a database user with read/write access.
4. Add your IP address to Network Access, or allow access from your current network while testing.
5. Click **Connect** and choose **Drivers**.
6. Copy the connection string and replace the placeholders with your username, password, and database name.
7. Put that string into `backend/.env` as `MONGODB_URI`.

Example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cantilever_blog?retryWrites=true&w=majority
```

#### Option B: Local MongoDB

1. Install MongoDB Community Server.
2. Start the MongoDB service.
3. Use a local connection string such as:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cantilever_blog
```

### 3. Configure environment variables

Copy the example files and fill them in:

- `backend/.env.example` to `backend/.env`
- `frontend/.env.example` to `frontend/.env`

Backend environment values:

```env
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-long-secret
CLIENT_URL=http://localhost:5173
```

Frontend environment values:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the app

Start the backend:

```bash
npm run dev --workspace backend
```

Start the frontend in a second terminal:

```bash
npm run dev --workspace frontend
```

Or run both from the root:

```bash
npm run dev
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login a user |

### Posts

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /api/posts | Get all blog posts |
| GET | /api/posts/:id | Get a single post |
| GET | /api/posts/mine | Get authenticated user posts |
| POST | /api/posts | Create a post |
| PUT | /api/posts/:id | Update a post |
| DELETE | /api/posts/:id | Delete a post |

## How It Works

1. A user registers with name, email, and password.
2. The backend hashes the password with bcryptjs and returns a JWT.
3. The frontend stores the token and user profile in local storage.
4. Authenticated users can create posts and manage only their own posts.
5. Public visitors can read all posts and open individual post pages.

## Notes

- The project uses React Router for navigation.
- The backend rejects update and delete requests unless the authenticated user owns the post.
- The UI is responsive and designed for desktop and mobile.

---
