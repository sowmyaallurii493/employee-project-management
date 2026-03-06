export interface Employee {
  id: string
  empNo: string
  name: string
  fatherName: string
  gender: string
  type: string
  joiningDate: string
  email: string
  mobile: string
  dob: string
  picture: string
}

export interface Project {
  id: string
  projectId: string
  name: string
  description: string
  status: string
  employees: string[]
}
