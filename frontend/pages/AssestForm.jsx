import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState({
    asset_tag: "",
    type: "",
    location: "",
    vendor: "",
    installed_on: "",
    status: "ACTIVE"
  });

  useEffect(() => {
    if (id) fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    try {
      const res = await api.get(`/assets/${id}`);
      setAsset(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await api.put(`/assets/${id}`, asset);
      } else {
        await api.post("/assets/", asset);
      }
      navigate("/assets");
    } catch (err) {
      alert("Error saving asset");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          {id ? "Edit Asset" : "Create Asset"}
        </div>

        <div className="card-body">
          <form onSubmit={submit}>

            <div className="mb-3">
              <label className="form-label">Asset Tag</label>
              <input
                type="text"
                className="form-control"
                value={asset.asset_tag}
                onChange={e =>
                  setAsset({ ...asset, asset_tag: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Type</label>
              <input
                type="text"
                className="form-control"
                value={asset.type}
                onChange={e =>
                  setAsset({ ...asset, type: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                value={asset.location}
                onChange={e =>
                  setAsset({ ...asset, location: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Vendor</label>
              <input
                type="text"
                className="form-control"
                value={asset.vendor}
                onChange={e =>
                  setAsset({ ...asset, vendor: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Installed On</label>
              <input
                type="date"
                className="form-control"
                value={asset.installed_on || ""}
                onChange={e =>
                  setAsset({ ...asset, installed_on: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={asset.status}
                onChange={e =>
                  setAsset({ ...asset, status: e.target.value })
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="DECOMMISSIONED">DECOMMISSIONED</option>
              </select>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/assets")}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                {id ? "Update Asset" : "Create Asset"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AssetForm;