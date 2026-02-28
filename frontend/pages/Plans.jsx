import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Plans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await api.get("/maintenance-plans/");
      setPlans(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    await api.delete(`/maintenance-plans/${id}`);
    loadPlans();
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">Maintenance Plans</h3>
            <Link to="/plans/new" className="btn btn-primary">
              + Add Plan
            </Link>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Asset ID</th>
                  <th>Frequency (Days)</th>
                  <th>Next Due</th>
                  <th>Instructions</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.length > 0 ? (
                  plans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.asset_id}</td>
                      <td>{plan.frequency_days}</td>
                      <td>{new Date(plan.next_due).toLocaleString()}</td>
                      <td>{plan.instructions}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deletePlan(plan.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No maintenance plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Plans;