from pydantic import BaseModel
from typing import List, Optional

class Employee(BaseModel):
    id: Optional[str] = None
    empNo: str
    name: str
    fatherName: Optional[str] = ""
    gender: Optional[str] = ""
    type: Optional[str] = ""
    joiningDate: Optional[str] = ""
    email: str
    mobile: Optional[str] = ""
    dob: Optional[str] = ""
    picture: Optional[str] = ""


class Project(BaseModel):
    id: Optional[str] = None
    projectId: str
    name: str
    description: Optional[str] = ""
    status: Optional[str] = "Active"
    employees: List[str] = []