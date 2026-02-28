import { useEffect, useState } from "react";
import api from "../api/api";
import dayjs from "dayjs";

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const a = await api.get("/assets/");
      const t = await api.get("/tasks/");
      setAssets(a.data);
      setTasks(t.data);
    } catch (err) {
      console.error(err);
    }
  };

  const now = dayjs();

  const pending = tasks.filter(t => t.status === "PENDING").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const overdue = tasks.filter(t =>
    t.status !== "DONE" &&
    dayjs(t.due_ts).isBefore(now)
  ).length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Status Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Pending</h5>
              <h3>{pending}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <h3>{inProgress}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-danger shadow">
            <div className="card-body">
              <h5 className="card-title">Overdue</h5>
              <h3>{overdue}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          Assets Overview
        </div>
        <div className="card-body p-0">
          <table className="table table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>Asset Tag</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assets && assets.length > 0 ? (
                assets.map(a => (
                  <tr key={a.id}>
                    <td>{a.asset_tag}</td>
                    <td>
                      <span
                        className={`badge ${
                          a.status === "ACTIVE"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No assets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;