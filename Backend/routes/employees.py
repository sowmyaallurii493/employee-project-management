from fastapi import APIRouter
from database import get_connection
from schemas import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.post("/")
def create_employee(emp: Employee):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO employees
            (emp_no, name, father_name, gender, type, joining_date, email, mobile, dob, picture)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                emp.empNo,
                emp.name,
                emp.fatherName or None,
                emp.gender or None,
                emp.type or None,
                emp.joiningDate or None,
                emp.email,
                emp.mobile or None,
                emp.dob or None,
                emp.picture or None
            )
        )

        conn.commit()
        conn.close()

        return {"message": "Employee created"}

    except Exception as e:
        return {"error": str(e)}


@router.get("/")
def get_employees():
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM employees")
        rows = cursor.fetchall()

        employees = []

        for row in rows:
            employees.append({
                "id": str(row[0]),
                "empNo": row[1],
                "name": row[2],
                "fatherName": row[3],
                "gender": row[4],
                "type": row[5],
                "joiningDate": str(row[6]) if row[6] else "",
                "email": row[7],
                "mobile": row[8],
                "dob": str(row[9]) if row[9] else "",
                "picture": row[10] or "",
                "createdAt": str(row[11]) if row[11] else "",
                "updatedAt": str(row[12]) if row[12] else ""
            })

        conn.close()
        return employees

    except Exception as e:
        return {"error": str(e)}

@router.put("/{id}")
def update_employee(id: str, emp: Employee):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE employees
            SET emp_no=%s,
                name=%s,
                father_name=%s,
                gender=%s,
                type=%s,
                joining_date=%s,
                email=%s,
                mobile=%s,
                dob=%s,
                picture=%s
            WHERE id=%s
            """,
            (
                emp.empNo,
                emp.name,
                emp.fatherName or None,
                emp.gender or None,
                emp.type or None,
                emp.joiningDate or None,
                emp.email,
                emp.mobile or None,
                emp.dob or None,
                emp.picture or None,
                id
            )
        )

        conn.commit()
        conn.close()

        return {"message": "Employee updated"}

    except Exception as e:
        return {"error": str(e)}


@router.delete("/{id}")
def delete_employee(id: str):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM employees WHERE id=%s", (id,))

        conn.commit()
        conn.close()

        return {"message": "Employee deleted"}

    except Exception as e:
        return {"error": str(e)}

        