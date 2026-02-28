import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function PlanForm() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);
  const [plan, setPlan] = useState({
    asset_id: "",
    frequency_days: 30,
    next_due: "",
    instructions: ""
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const res = await api.get("/assets/");
    setAssets(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (plan.frequency_days <= 0) {
      alert("Frequency must be greater than 0");
      return;
    }

    try {
      await api.post("/maintenance-plans/", plan);
      navigate("/plans");
    } catch (err) {
      alert("Invalid Asset ID or error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                Create Maintenance Plan
              </h3>

              <form onSubmit={submit}>
                {/* Asset */}
                <div className="mb-3">
                  <label className="form-label">Asset</label>
                  <select
                    className="form-select"
                    value={plan.asset_id}
                    onChange={e =>
                      setPlan({ ...plan, asset_id: Number(e.target.value) })
                    }
                    required
                  >
                    <option value="">Select Asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.asset_tag} - {asset.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Frequency */}
                <div className="mb-3">
                  <label className="form-label">Frequency (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={plan.frequency_days}
                    onChange={e =>
                      setPlan({
                        ...plan,
                        frequency_days: Number(e.target.value)
                      })
                    }
                    required
                  />
                </div>

                {/* Next Due */}
                <div className="mb-3">
                  <label className="form-label">Next Due</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={plan.next_due}
                    onChange={e =>
                      setPlan({ ...plan, next_due: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Instructions */}
                <div className="mb-3">
                  <label className="form-label">Instructions</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={plan.instructions}
                    onChange={e =>
                      setPlan({ ...plan, instructions: e.target.value })
                    }
                  />
                </div>

                {/* Submit */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Save Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanForm;