// src/components/ManageWeddingVip.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditWeddingVip from './EditWeddingVip';

const ManageWeddingVip = () => {
  const [weddingVips, setWeddingVips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWeddingVips, setFilteredWeddingVips] = useState([]);
  const [editWeddingVip, setEditWeddingVip] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchWeddingVips = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/weddingvip`);
        setWeddingVips(response.data);
      } catch (error) {
        console.error('Error fetching Wedding VIPs:', error);
      }
    };

    fetchWeddingVips();
  }, []);

  useEffect(() => {
    const filtered = weddingVips.filter((vip) => {
      return (
        (vip.title && vip.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vip.description && vip.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredWeddingVips(filtered);
  }, [searchTerm, weddingVips]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this Wedding VIP?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/weddingvip/${id}`);
      setWeddingVips(weddingVips.filter((vip) => vip._id !== id));
      setShowAlert(true);
    } catch (error) {
      console.error('Error deleting Wedding VIP:', error);
    }
  };

  const handleEdit = (vip) => {
    setEditWeddingVip(vip);
  };

  return (
    <div className="weddingvips">
      {showAlert && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Action successful!
          <button
            type="button"
            className="close"
            onClick={() => setShowAlert(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {editWeddingVip ? (
        <EditWeddingVip
          weddingVip={editWeddingVip}
          setEditWeddingVip={setEditWeddingVip}
          setShowAlert={setShowAlert}
        />
      ) : (
        <>
          <h3>Manage Wedding VIPs</h3>
          <p>Total Entries: {weddingVips.length}</p>

          <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>

          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWeddingVips.map((vip) => (
                <tr key={vip._id}>
                  <td>{vip.title}</td>
                  <td>{vip.category}</td>
                  <td>{vip.description}</td>
                  <td>{vip.isPublished}</td>

                  <td>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => handleEdit(vip)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(vip._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ManageWeddingVip;
