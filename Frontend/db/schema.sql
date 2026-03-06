-- Employee & Project Management - SQL Server Schema
-- Run this script in your SQL Server database.

-- Employees table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'employees')
BEGIN
  CREATE TABLE employees (
    id           UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    emp_no        NVARCHAR(50) NOT NULL,
    name          NVARCHAR(255) NOT NULL,
    father_name   NVARCHAR(255) NULL,
    gender        NVARCHAR(20) NULL,
    type          NVARCHAR(50) NULL,
    joining_date  DATE NULL,
    email         NVARCHAR(255) NOT NULL,
    mobile        NVARCHAR(50) NULL,
    dob           DATE NULL,
    picture       NVARCHAR(MAX) NULL,
    created_at    DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at    DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_employees_emp_no UNIQUE (emp_no)
  );

  CREATE INDEX IX_employees_emp_no ON employees(emp_no);
  CREATE INDEX IX_employees_email ON employees(email);
END
GO

-- Projects table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'projects')
BEGIN
  CREATE TABLE projects (
    id           UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    project_id   NVARCHAR(50) NOT NULL,
    name         NVARCHAR(255) NOT NULL,
    description  NVARCHAR(MAX) NULL,
    status       NVARCHAR(50) NOT NULL DEFAULT 'Active',
    created_at   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at   DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_projects_project_id UNIQUE (project_id)
  );

  CREATE INDEX IX_projects_project_id ON projects(project_id);
  CREATE INDEX IX_projects_status ON projects(status);
END
GO

-- Project-Employee assignment (many-to-many)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'project_employees')
BEGIN
  CREATE TABLE project_employees (
    id           UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    project_id   UNIQUEIDENTIFIER NOT NULL,
    employee_id  UNIQUEIDENTIFIER NOT NULL,
    assigned_at  DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_project_employees_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT FK_project_employees_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    CONSTRAINT UQ_project_employees UNIQUE (project_id, employee_id)
  );

  CREATE INDEX IX_project_employees_project ON project_employees(project_id);
  CREATE INDEX IX_project_employees_employee ON project_employees(employee_id);
END
GO

-- Trigger: update updated_at on employees
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_employees_updated_at')
  DROP TRIGGER TR_employees_updated_at;
GO
CREATE TRIGGER TR_employees_updated_at
  ON employees
  AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE e
  SET e.updated_at = SYSDATETIME()
  FROM employees e
  INNER JOIN inserted i ON e.id = i.id;
END
GO

-- Trigger: update updated_at on projects
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_projects_updated_at')
  DROP TRIGGER TR_projects_updated_at;
GO
CREATE TRIGGER TR_projects_updated_at
  ON projects
  AFTER UPDATE
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE p
  SET p.updated_at = SYSDATETIME()
  FROM projects p
  INNER JOIN inserted i ON p.id = i.id;
END
GO
