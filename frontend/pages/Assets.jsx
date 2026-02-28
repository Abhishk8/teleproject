import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Assets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const res = await api.get("/assets/");
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAsset = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    await api.delete(`/assets/${id}`);
    loadAssets();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Assets</h2>
        <Link to="/assets/new" className="btn btn-success">
          + Add Asset
        </Link>
      </div>

      <div className="card shadow">
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Asset Tag</th>
                <th>Type</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map(a => (
                  <tr key={a.id}>
                    <td>{a.asset_tag}</td>
                    <td>{a.type}</td>
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
                    <td>
                      <Link
                        to={`/assets/${a.id}/edit`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteAsset(a.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-3">
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

export default Assets;