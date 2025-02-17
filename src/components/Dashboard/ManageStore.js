// src/components/ManageMusicStore.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import EditMusicStore from "./EditMusicStore"; 
const ManageMusicStore = () => {
  const [stores, setStores] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStores, setFilteredStores] = useState([]); 
  const [editStore, setEditStore] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch music stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore`
        ); // Update endpoint
        setStores(response.data); // Update state
      } catch (error) {
        console.error("Error fetching music stores:", error);
      }
    };

    fetchStores();
  }, []);

  // Filter music stores based on search term
  useEffect(() => {
    const filtered = stores.filter((store) => {
      return (
        (store.name &&
          store.name.toLowerCase().includes(searchTerm.toLowerCase())) ||

        (store.contact &&
          store.contact.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredStores(filtered);
  }, [searchTerm, stores]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // Delete store
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this store?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/musicstore/${id}`
      ); // Update endpoint
      setStores(stores.filter((store) => store._id !== id)); // Update state
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  // Edit store
  const handleEdit = (store) => {
    setEditStore(store);
  };

  return (
    <div className="stores">
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

      {editStore ? (
        <EditMusicStore
          store={editStore} // Update props
          setEditStore={setEditStore}
          setShowAlert={setShowAlert}
        />
      ) : (
        <>
          <h3>Manage Music Stores</h3>
          <p>Total Entries: {stores.length}</p> {/* Update label */}
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or contact" // Update placeholder
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </form>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Logo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store._id}>
                  <td>{store.name || "No Name"}</td>
                  <td>{store.contact || "No Contact"}</td>
                  <td>{store.status || "No Status"}</td>
                  <td>
                    {store.logo ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${store.logo}`}
                        alt={store.name}
                        style={{ width: "50px" }}
                      />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => handleEdit(store)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(store._id)}
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

export default ManageMusicStore;
