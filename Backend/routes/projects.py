from fastapi import APIRouter
from database import get_connection
from schemas import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(project: Project):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO projects (project_id,name,description,status)
        VALUES (?,?,?,?)
        """,
        project.projectId,
        project.name,
        project.description,
        project.status
    )

    cursor.execute("SELECT id FROM projects WHERE project_id=?", project.projectId)
    project_id = cursor.fetchone()[0]

    for emp_name in project.employees:

        cursor.execute("SELECT id FROM employees WHERE name=?", emp_name)
        emp = cursor.fetchone()

        if emp:
            cursor.execute(
                "INSERT INTO project_employees (project_id,employee_id) VALUES (?,?)",
                project_id,
                emp[0]
            )

    conn.commit()
    conn.close()

    return {"message": "Project created"}


@router.get("/")
def get_projects():

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.id,p.project_id,p.name,p.description,p.status,e.name
        FROM projects p
        LEFT JOIN project_employees pe ON p.id = pe.project_id
        LEFT JOIN employees e ON pe.employee_id = e.id
    """)

    rows = cursor.fetchall()

    projects = {}

    for row in rows:

        pid = str(row[0])

        if pid not in projects:
            projects[pid] = {
                "id": pid,
                "projectId": row[1],
                "name": row[2],
                "description": row[3],
                "status": row[4],
                "employees": []
            }

        if row[5]:
            projects[pid]["employees"].append(row[5])

    conn.close()

    return list(projects.values())


@router.put("/{id}")
def update_project(id: str, project: Project):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE projects
        SET project_id=?,
            name=?,
            description=?,
            status=?
        WHERE id=?
    """,
        project.projectId,
        project.name,
        project.description,
        project.status,
        id
    )

    # remove old assignments
    cursor.execute("DELETE FROM project_employees WHERE project_id=?", id)

    # add new assignments
    for emp_name in project.employees:

        cursor.execute("SELECT id FROM employees WHERE name=?", emp_name)
        emp = cursor.fetchone()

        if emp:
            cursor.execute(
                "INSERT INTO project_employees (project_id,employee_id) VALUES (?,?)",
                id,
                emp[0]
            )

    conn.commit()
    conn.close()

    return {"message": "Project updated"}

@router.delete("/{id}")
def delete_project(id: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM projects WHERE id=?", id)

    conn.commit()
    conn.close()

    return {"message": "Project deleted"}