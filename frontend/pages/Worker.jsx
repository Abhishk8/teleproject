import { useEffect, useState } from "react";
import api from "../api/api";

function Workers() {
  const [workers, setWorkers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: ""
  });

  useEffect(() => {
    loadWorkers();
    loadTasks();
  }, []);

  const loadWorkers = async () => {
    const res = await api.get("/workers/");
    setWorkers(res.data);
  };

  const loadTasks = async () => {
    const res = await api.get("/tasks/");
    setTasks(res.data);
  };

  const resetForm = () => {
    setForm({ name: "", email: "", skills: "" });
    setEditingId(null);
  };

  const submitWorker = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      skills: form.skills.split(",").map(s => s.trim())
    };

    if (editingId) {
      await api.put(`/workers/${editingId}`, payload);
    } else {
      await api.post("/workers/", payload);
    }

    resetForm();
    loadWorkers();
  };

  const editWorker = (worker) => {
    setEditingId(worker.id);
    setForm({
      name: worker.name,
      email: worker.email,
      skills: worker.skills.join(", ")
    });
  };

  const assignTask = async (taskId, workerId) => {
    const task = tasks.find(t => t.id === taskId);

    await api.put(`/tasks/${taskId}`, {
      ...task,
      assigned_to: workerId
    });

    loadTasks();
  };

  return (
    <div className="container mt-5">

      {/* Worker Form Card */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h4 className="mb-4">
            {editingId ? "Edit Worker" : "Add Worker"}
          </h4>

          <form onSubmit={submitWorker}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <input
                  className="form-control"
                  placeholder="Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <input
                  className="form-control"
                  placeholder="Skills (comma separated)"
                  value={form.skills}
                  onChange={e => setForm({ ...form, skills: e.target.value })}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Worker" : "Add Worker"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Worker List */}
      <div className="card shadow mb-4">
        <div className="card-body">
          <h4 className="mb-3">Workers List</h4>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(worker => (
                  <tr key={worker.id}>
                    <td>{worker.name}</td>
                    <td>{worker.email}</td>
                    <td>
                      {worker.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="badge bg-info text-dark me-1"
                        >
                          {skill}
                        </span>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => editWorker(worker)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task Assignment */}
      <div className="card shadow">
        <div className="card-body">
          <h4 className="mb-3">Assign Tasks Manually</h4>

          {tasks.filter(task => !task.assigned_to).length === 0 && (
            <p className="text-muted">No unassigned tasks.</p>
          )}

          {tasks
            .filter(task => !task.assigned_to)
            .map(task => (
              <div
                key={task.id}
                className="d-flex align-items-center gap-3 mb-3"
              >
                <div>
                  <strong>Task #{task.id}</strong> (Asset {task.asset_id})
                </div>

                <select
                  className="form-select w-auto"
                  defaultValue=""
                  onChange={(e) =>
                    assignTask(task.id, Number(e.target.value))
                  }
                >
                  <option value="">Assign to...</option>
                  {workers.map(worker => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}

export default Workers;