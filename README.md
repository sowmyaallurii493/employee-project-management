# Employee Project Management System

A full-stack application to manage employees and projects, and assign employees to projects.

This project was built using **Next.js for the frontend** and **FastAPI for the backend**, with **SQL Server as the database**.

---

## Features

### Employee Management
- Add Employee
- Edit Employee
- Delete Employee
- Upload employee profile picture

### Project Management
- Add Project
- Edit Project
- Delete Project

### Employee Assignment
- Assign employees to projects
- Remove employees from projects

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Fetch API

### Backend
- FastAPI
- Python
- REST APIs

### Database
- SQL Server

---

## Project Structure

```
nextjs-employee-project-ui
│
├── Backend
│   ├── main.py
│   ├── database.py
│   ├── models
│   │   ├── employees.py
│   │   └── projects.py
│   ├── schemas
│   │   ├── employee_schema.py
│   │   └── project_schema.py
│   └── utils
│       └── db_utils.py
│
├── Frontend
│   ├── app
│   │   ├── employees
│   │   ├── projects
│   │   └── context
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Backend Setup

Navigate to backend folder:

```
cd Backend
```

Create virtual environment:

```
python -m venv .venv
```

Activate environment:

```
.venv\Scripts\activate
```

Install dependencies:

```
pip install fastapi uvicorn pyodbc
```

Run backend server:

```
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger API documentation:

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Navigate to frontend folder:

```
cd Frontend
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## API Endpoints

### Employees

```
GET /employees
POST /employees
PUT /employees/{id}
DELETE /employees/{id}
```

### Projects

```
GET /projects
POST /projects
PUT /projects/{id}
DELETE /projects/{id}
```

### Employee Assignment

Employees can be assigned to projects through the project assignment feature.

---

## Communication Between Frontend and Backend

The frontend communicates with the backend using **REST APIs**.

Data is fetched using **Fetch API requests** such as:

- GET – retrieve data
- POST – create records
- PUT – update records
- DELETE – remove records

---

## How the System Works

1. User interacts with the **Next.js frontend UI**
2. The frontend sends **HTTP requests to FastAPI backend**
3. FastAPI processes the request
4. Backend queries **SQL Server database**
5. Data is returned to the frontend
6. UI updates dynamically

---

## Author

Sowmya Alluri