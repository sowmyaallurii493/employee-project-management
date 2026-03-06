'use client'

import { useState, useCallback, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Modal from '../Modal'
import { useApp } from '../context/AppContext'
import { validateProject, type ProjectErrors } from '../lib/validation'
import type { Project } from '../types'

const emptyProject: Project = {
  id: '',
  projectId: '',
  name: '',
  description: '',
  status: 'Active',
  employees: [],
}

export default function Projects() {
  const { employees, projects, addProject, updateProject, deleteProject } = useApp()
  const [form, setForm] = useState<Project>(emptyProject)
  const [editing, setEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [errors, setErrors] = useState<ProjectErrors>({})

  const change = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ProjectErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  function openAddModal() {
    setForm(emptyProject)
    setEditing(false)
    setErrors({})
    setModalOpen(true)
  }

  function openEditModal(p: Project) {
    setForm(p)
    setEditing(true)
    setErrors({})
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setForm(emptyProject)
    setEditing(false)
    setErrors({})
  }

  function toggleEmployee(employeeName: string) {
    setForm((prev) => {
      const current = prev.employees || []
      const has = current.includes(employeeName)
      return {
        ...prev,
        employees: has ? current.filter((n) => n !== employeeName) : [...current, employeeName],
      }
    })
  }

  function removeAssignedEmployee(index: number) {
    setForm({
      ...form,
      employees: form.employees.filter((_, i) => i !== index),
    })
  }

  function save() {
    const nextErrors = validateProject(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (editing) {
      updateProject(form)
    } else {
      addProject({ ...form, id: uuid() })
    }
    closeModal()
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Projects</h2>
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            Add project
          </button>
        </div>
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    <p>No projects yet. Click &quot;Add project&quot; to create one.</p>
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.projectId || '—'}</td>
                    <td>{p.name || '—'}</td>
                    <td>{p.status || '—'}</td>
                    <td>
                      {p.employees && p.employees.length > 0
                        ? p.employees.join(', ')
                        : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteProject(p.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit project' : 'Add project'}
      >
        <div className="form-row form-row-2">
          <div className={`form-group ${errors.projectId ? 'has-error' : ''}`}>
            <label>Project ID</label>
            <input
              name="projectId"
              placeholder="e.g. PRJ-001"
              value={form.projectId}
              onChange={change}
            />
            {errors.projectId && <span className="error-message">{errors.projectId}</span>}
          </div>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>Project name</label>
            <input
              name="name"
              placeholder="Project name"
              value={form.name}
              onChange={change}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 18 }}>
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Brief description of the project"
            value={form.description}
            onChange={change}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 18 }}>
          <label>Status</label>
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <h4 className="card-subtitle">Assign employees</h4>
        <p className="form-hint" style={{ marginBottom: 8, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Select one or more employees to assign to this project.
        </p>
        {employees.length === 0 ? (
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: 16 }}>
            No employees yet. Add employees from the Employees page first.
          </p>
        ) : (
          <div className={`multi-select-wrap ${errors.employees ? 'has-error' : ''}`} style={{ marginBottom: 16 }}>
            {employees.map((emp) => (
              <label key={emp.id} className="multi-select-option">
                <input
                  type="checkbox"
                  checked={form.employees.includes(emp.name)}
                  onChange={() => toggleEmployee(emp.name)}
                />
                <span>{emp.name} {emp.empNo ? `(${emp.empNo})` : ''}</span>
              </label>
            ))}
          </div>
        )}

        {form.employees.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <span className="card-subtitle" style={{ display: 'block', marginBottom: 8 }}>Assigned</span>
            <ul className="chip-list" style={{ marginTop: 0 }}>
              {form.employees.map((name, i) => (
                <li key={i} className="chip">
                  {name}
                  <button
                    type="button"
                    className="chip-remove"
                    onClick={() => removeAssignedEmployee(i)}
                    aria-label={`Remove ${name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="btn-group">
          <button type="button" className="btn btn-primary" onClick={save}>
            {editing ? 'Update project' : 'Add project'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
