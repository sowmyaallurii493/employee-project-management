'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import type { Employee, Project } from '../types'

const API = "http://127.0.0.1:8000"

interface AppState {
  employees: Employee[]
  projects: Project[]
}

interface AppContextValue extends AppState {
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  addEmployee: (emp: Employee) => Promise<void>
  updateEmployee: (emp: Employee) => Promise<void>
  deleteEmployee: (id: string) => Promise<void>
  addProject: (proj: Project) => Promise<void>
  updateProject: (proj: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {

  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  // Load data from backend when app starts
  useEffect(() => {

    fetch(`${API}/employees/`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error(err))

    fetch(`${API}/projects/`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err))

  }, [])

  // EMPLOYEE FUNCTIONS

  const addEmployee = useCallback(async (emp: Employee) => {

    await fetch(`${API}/employees/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp)
    })

    const res = await fetch(`${API}/employees/`)
    const data = await res.json()
    setEmployees(data)

  }, [])

  const updateEmployee = useCallback(async (emp: Employee) => {

    await fetch(`${API}/employees/${emp.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emp)
    })

    const res = await fetch(`${API}/employees/`)
    const data = await res.json()
    setEmployees(data)

  }, [])

  const deleteEmployee = useCallback(async (id: string) => {

    await fetch(`${API}/employees/${id}`, {
      method: "DELETE"
    })

    const res = await fetch(`${API}/employees/`)
    const data = await res.json()
    setEmployees(data)

  }, [])

  // PROJECT FUNCTIONS

  const addProject = useCallback(async (proj: Project) => {

    await fetch(`${API}/projects/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proj)
    })

    const res = await fetch(`${API}/projects/`)
    const data = await res.json()
    setProjects(data)

  }, [])

  const updateProject = useCallback(async (proj: Project) => {

    await fetch(`${API}/projects/${proj.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proj)
    })

    const res = await fetch(`${API}/projects/`)
    const data = await res.json()
    setProjects(data)

  }, [])

  const deleteProject = useCallback(async (id: string) => {

    await fetch(`${API}/projects/${id}`, {
      method: "DELETE"
    })

    const res = await fetch(`${API}/projects/`)
    const data = await res.json()
    setProjects(data)

  }, [])

  const value: AppContextValue = {
    employees,
    projects,
    setEmployees,
    setProjects,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addProject,
    updateProject,
    deleteProject
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}