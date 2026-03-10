from fastapi import APIRouter
from database import get_connection
from schemas import Project

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("/")
def create_project(project: Project):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO projects (project_id, name, description, status)
            VALUES (%s,%s,%s,%s)
            RETURNING id
            """,
            (
                project.projectId,
                project.name,
                project.description or None,
                project.status
            )
        )

        project_id = cursor.fetchone()[0]

        for emp_name in project.employees:
            cursor.execute(
                "SELECT id FROM employees WHERE name=%s",
                (emp_name,)
            )

            emp = cursor.fetchone()

            if emp:
                cursor.execute(
                    """
                    INSERT INTO project_assignments (project_id, employee_id)
                    VALUES (%s,%s)
                    """,
                    (project_id, emp[0])
                )

        conn.commit()
        conn.close()

        return {"message": "Project created"}

    except Exception as e:
        return {"error": str(e)}


@router.get("/")
def get_projects():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT p.id, p.project_id, p.name, p.description, p.status, e.name
            FROM projects p
            LEFT JOIN project_assignments pe ON p.id = pe.project_id
            LEFT JOIN employees e ON pe.employee_id = e.id
            """
        )

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

    except Exception as e:
        return {"error": str(e)}


@router.put("/{id}")
def update_project(id: str, project: Project):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE projects
            SET project_id=%s,
                name=%s,
                description=%s,
                status=%s
            WHERE id=%s
            """,
            (
                project.projectId,
                project.name,
                project.description or None,
                project.status,
                id
            )
        )

        cursor.execute(
            "DELETE FROM project_assignments WHERE project_id=%s",
            (id,)
        )

        for emp_name in project.employees:
            cursor.execute(
                "SELECT id FROM employees WHERE name=%s",
                (emp_name,)
            )

            emp = cursor.fetchone()

            if emp:
                cursor.execute(
                    """
                    INSERT INTO project_assignments (project_id, employee_id)
                    VALUES (%s,%s)
                    """,
                    (id, emp[0])
                )

        conn.commit()
        conn.close()

        return {"message": "Project updated"}

    except Exception as e:
        return {"error": str(e)}


@router.delete("/{id}")
def delete_project(id: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM projects WHERE id=%s",
            (id,)
        )

        conn.commit()
        conn.close()

        return {"message": "Project deleted"}

    except Exception as e:
        return {"error": str(e)}