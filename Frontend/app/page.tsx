import Link from 'next/link'

interface Feature {
  title: string
  description: string
}

export default function Home() {
  const features: Feature[] = [
    {
      title: 'Employee CRUD',
      description: 'Add, edit, and manage employee records with details like name, contact, and employment type.',
    },
    {
      title: 'Project CRUD',
      description: 'Create and maintain projects with status, description, and team assignments.',
    },
    {
      title: 'Assign to Projects',
      description: 'Link employees to projects and see who is working on what at a glance.',
    },
    {
      title: 'Local State',
      description: 'All data is stored in the browser—no database required for this evaluation UI.',
    },
  ]

  return (
    <>
      <section className="hero">
        <h1>Employee & Project Management</h1>
        <p>
          A clean frontend for managing employees and projects. Use the menu above to get started.
        </p>
      </section>

      <div className="card">
        <h2 className="card-title">What you can do</h2>
        <ul className="feature-list">
          <li>Full employee CRUD with form validation</li>
          <li>Project creation and status tracking</li>
          <li>Assign employees to projects</li>
          <li>No database — local state only</li>
        </ul>

        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>

        <div className="btn-group" style={{ marginTop: 28 }}>
          <Link href="/employees" className="btn btn-primary">
            Go to Employees
          </Link>
          <Link href="/projects" className="btn btn-secondary">
            Go to Projects
          </Link>
        </div>
      </div>
    </>
  )
}
