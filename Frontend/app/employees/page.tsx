'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { v4 as uuid } from 'uuid'
import Modal from '../Modal'
import { useApp } from '../context/AppContext'
import { validateEmployee, type EmployeeErrors } from '../lib/validation'
import type { Employee } from '../types'

const emptyForm: Employee = {
  id: '',
  empNo: '',
  name: '',
  fatherName: '',
  gender: '',
  type: '',
  joiningDate: '',
  email: '',
  mobile: '',
  dob: '',
  picture: '',
}

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useApp()
  const [form, setForm] = useState<Employee>(emptyForm)
  const [editing, setEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [errors, setErrors] = useState<EmployeeErrors>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof EmployeeErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function handlePictureChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setForm((f) => ({ ...f, picture: reader.result as string }))
    reader.readAsDataURL(file)
  }

  function clearPicture() {
    setForm((f) => ({ ...f, picture: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function openAddModal() {
    setForm(emptyForm)
    setEditing(false)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
    setModalOpen(true)
  }

  function openEditModal(emp: Employee) {
    setForm(emp)
    setEditing(true)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setForm(emptyForm)
    setEditing(false)
    setErrors({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function saveEmployee() {
    const nextErrors = validateEmployee(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (editing) {
      updateEmployee(form)
    } else {
      addEmployee({ ...form, id: uuid() })
    }
    closeModal()
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="card-title" style={{ marginBottom: 0 }}>Employees</h2>
          <button type="button" className="btn btn-primary" onClick={openAddModal}>
            Add employee
          </button>
        </div>
        <div className="table-wrap" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <p>No employees yet. Click &quot;Add employee&quot; to create one.</p>
                  </td>
                </tr>
              ) : (
                employees.map((e) => (
                  <tr key={e.id}>
                    <td>
                      {e.picture ? (
                        <img src={e.picture} alt="" className="avatar-sm" />
                      ) : (
                        <span className="avatar-placeholder">{e.name?.charAt(0)?.toUpperCase() || '?'}</span>
                      )}
                    </td>
                    <td>{e.empNo || '—'}</td>
                    <td>{e.name || '—'}</td>
                    <td>{e.email || '—'}</td>
                    <td>{e.mobile || '—'}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditModal(e)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteEmployee(e.id)}
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
        title={editing ? 'Edit employee' : 'Add employee'}
      >
        <div className="form-row form-row-3">
          <div className={`form-group ${errors.empNo ? 'has-error' : ''}`}>
            <label>Employee No</label>
            <input
              name="empNo"
              placeholder="e.g. EMP001"
              value={form.empNo}
              onChange={handleChange}
            />
            {errors.empNo && <span className="error-message">{errors.empNo}</span>}
          </div>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>Full name</label>
            <input
              name="name"
              placeholder="Employee name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Father&apos;s name</label>
            <input
              name="fatherName"
              placeholder="Father's name"
              value={form.fatherName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row form-row-2">
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Employment type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="">Select type</option>
              <option>Permanent</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <div className="form-row form-row-2">
          <div className="form-group">
            <label>Joining date</label>
            <input
              type="date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Date of birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row form-row-2">
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className={`form-group ${errors.mobile ? 'has-error' : ''}`}>
            <label>Mobile</label>
            <input
              name="mobile"
              placeholder="Phone number"
              value={form.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label>Profile picture</label>
          <div className="upload-area">
            {form.picture ? (
              <>
                <img src={form.picture} alt="Preview" className="upload-preview" />
                <div className="upload-input-wrap">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePictureChange}
                  />
                  <button type="button" className="btn btn-secondary btn-sm" onClick={clearPicture} style={{ marginTop: 8 }}>
                    Remove photo
                  </button>
                </div>
              </>
            ) : (
              <div className="upload-input-wrap" style={{ width: '100%' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                />
              </div>
            )}
          </div>
        </div>

        <div className="btn-group">
          <button type="button" className="btn btn-primary" onClick={saveEmployee}>
            {editing ? 'Update employee' : 'Add employee'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
