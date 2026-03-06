from fastapi import FastAPI
from routes import employees, projects
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(employees.router)
app.include_router(projects.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Employee Project API running"}