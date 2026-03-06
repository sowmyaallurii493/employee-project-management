const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_REGEX = /^[0-9+\-\s()]{8,20}$/

export interface EmployeeErrors {
  empNo?: string
  name?: string
  fatherName?: string
  gender?: string
  type?: string
  joiningDate?: string
  email?: string
  mobile?: string
  dob?: string
  picture?: string
}

export interface ProjectErrors {
  projectId?: string
  name?: string
  description?: string
  status?: string
  employees?: string
}

export function validateEmployee(form: {
  empNo: string
  name: string
  fatherName: string
  gender: string
  type: string
  joiningDate: string
  email: string
  mobile: string
  dob: string
}): EmployeeErrors {
  const errors: EmployeeErrors = {}
  if (!form.empNo?.trim()) errors.empNo = 'Employee number is required'
  if (!form.name?.trim()) errors.name = 'Full name is required'
  if (!form.email?.trim()) {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (form.mobile?.trim() && !MOBILE_REGEX.test(form.mobile.trim())) {
    errors.mobile = 'Enter a valid phone number'
  }
  return errors
}

export function validateProject(form: {
  projectId: string
  name: string
  description: string
  status: string
}): ProjectErrors {
  const errors: ProjectErrors = {}
  if (!form.projectId?.trim()) errors.projectId = 'Project ID is required'
  if (!form.name?.trim()) errors.name = 'Project name is required'
  return errors
}
