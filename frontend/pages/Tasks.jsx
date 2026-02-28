import { useEffect, useState } from "react";
import api from "../api/api";

function Tasks() {
  const workerId = 1; // simulate login
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await api.get("/tasks/");
    setTasks(res.data.filter(t => t.assigned_to === workerId));
  };

  const updateTask = async (task, status) => {
    await api.put(`/tasks/${task.id}`, {
      ...task,
      status
    });
    loadTasks();
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "IN_PROGRESS":
        return "warning";
      case "DONE":
        return "success";
      default:
        return "dark";
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="mb-4">My Tasks</h3>

          {tasks.length > 0 ? (
            <div className="row">
              {tasks.map(t => (
                <div key={t.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Asset #{t.asset_id}</h5>

                      <p>
                        Status:{" "}
                        <span className={`badge bg-${getBadgeColor(t.status)}`}>
                          {t.status}
                        </span>
                      </p>

                      {t.status === "PENDING" && (
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => updateTask(t, "IN_PROGRESS")}
                        >
                          Start
                        </button>
                      )}

                      {t.status === "IN_PROGRESS" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateTask(t, "DONE")}
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No tasks assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;