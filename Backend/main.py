from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import employees, projects

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(employees.router)
app.include_router(projects.router)

@app.get("/")
def root():
    return {"message": "Employee Project API running"}