# 📋 Task API

A simple RESTful Task Management API built with **Node.js**, **Express.js**, and **Swagger UI**.

## 🚀 Features

- CRUD operations for tasks
- Health check endpoint
- Swagger API documentation
- In-memory data storage

## 🛠️ Tech Stack

- Node.js
- Express.js
- Swagger UI

## 📦 Installation

```bash
git clone https://github.com/sathvik333m/CRUD_API.git
cd crud_api
npm install
```

## ▶️ Run

```bash
node index.js
```

Server: `http://localhost:3000`

Swagger Docs: `http://localhost:3000/docs`

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

> **Note:** This project uses in-memory storage, so data resets whenever the server restarts.