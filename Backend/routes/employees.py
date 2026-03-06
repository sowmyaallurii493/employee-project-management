from fastapi import APIRouter
from database import get_connection
from schemas import Employee

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.post("/")
def create_employee(emp: Employee):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO employees
        (emp_no,name,father_name,gender,type,joining_date,email,mobile,dob,picture)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        """,
        emp.empNo,
        emp.name,
        emp.fatherName,
        emp.gender,
        emp.type,
        emp.joiningDate,
        emp.email,
        emp.mobile,
        emp.dob,
        emp.picture
    )

    conn.commit()
    conn.close()

    return {"message": "Employee created"}



@router.get("/")
def get_employees():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM employees")
    rows = cursor.fetchall()

    employees = []

    for row in rows:
        employees.append({
            "id": str(row.id),
            "empNo": row.emp_no,
            "name": row.name,
            "fatherName": row.father_name,
            "gender": row.gender,
            "type": row.type,
            "joiningDate": str(row.joining_date) if row.joining_date else "",
            "email": row.email,
            "mobile": row.mobile,
            "dob": str(row.dob) if row.dob else "",
            "picture": row.picture or ""
        })

    conn.close()
    return employees

@router.put("/{id}")
def update_employee(id: str, emp: Employee):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE employees
        SET emp_no=?,
            name=?,
            father_name=?,
            gender=?,
            type=?,
            joining_date=?,
            email=?,
            mobile=?,
            dob=?,
            picture=?
        WHERE id=?
    """,
        emp.empNo,
        emp.name,
        emp.fatherName,
        emp.gender,
        emp.type,
        emp.joiningDate,
        emp.email,
        emp.mobile,
        emp.dob,
        emp.picture,
        id
    )

    conn.commit()
    conn.close()

    return {"message": "Employee updated"}

@router.delete("/{id}")
def delete_employee(id: str):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM employees WHERE id=?", id)

    conn.commit()
    conn.close()

    return {"message": "Employee deleted"}