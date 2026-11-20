
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:8080/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API);
      setEmployees(response.data);
    } catch (error) {
      alert("Unable to load employees. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const employee = {
      ...form,
      salary: Number(form.salary)
    };

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, employee);
        alert("Employee updated successfully!");
      } else {
        await axios.post(API, employee);
        alert("Employee added successfully!");
      }

      resetForm();
      fetchEmployees();
    } catch (error) {
      alert("Unable to save employee.");
    }
  };

  const handleEdit = (employee) => {
    setForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary || ""
    });

    setEditingId(employee.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      fetchEmployees();
    } catch (error) {
      alert("Unable to delete employee.");
    }
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      salary: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>EMS<span>.</span></h2>
        <p className="sidebar-label">MAIN MENU</p>
        <div className="nav-item active">▦ Dashboard</div>
       <a href="#employees" className="nav-item">
       ♙ Employees</a>
        <div className="sidebar-bottom">Employee Management System</div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>Employee Dashboard</h2>
            <p>Manage your organization's employees</p>
          </div>
          <button className="add-button" onClick={() => {
            resetForm();
            setShowForm(true);
          }}>
            + Add Employee
          </button>
        </header>

        <section className="stats">
          <div className="stat-card">
            <p>Total Employees</p>
            <h2>{employees.length}</h2>
            <span>Registered employees</span>
          </div>
          <div className="stat-card">
            <p>Departments</p>
            <h2>{new Set(employees.map(e => e.department)).size}</h2>
            <span>Active departments</span>
          </div>
          <div className="stat-card">
            <p>Search Results</p>
            <h2>{filteredEmployees.length}</h2>
            <span>Matching employees</span>
          </div>
        </section>

        <section className="employee-section" id="employees">
          <div className="section-header">
            <div>
              <h2>All Employees</h2>
              <p>View and manage employee records</p>
            </div>
            <input
              className="search"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="message">Loading employees...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>
                        <strong>{employee.firstName} {employee.lastName}</strong>
                        <small>ID: {employee.id}</small>
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>{employee.designation}</td>
                      <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>
                      <td>
                        <button className="edit-button" onClick={() => handleEdit(employee)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => handleDelete(employee.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="6" className="message">No employees found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="modal-backdrop">
            <form className="employee-form" onSubmit={handleSubmit}>
              <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

              {Object.keys(form).map((field) => (
                <label key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  <input
                    name={field}
                    type={field === "salary" ? "number" : "text"}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    min={field === "salary" ? "0" : undefined}
                    step={field === "salary" ? "0.01" : undefined}
                  />
                </label>
              ))}

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  {editingId ? "Update Employee" : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
