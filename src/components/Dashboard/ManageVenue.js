// src/components/Venues.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import EditVenue from './EditVenue';

const ManageVenue = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [editVenue, setEditVenue] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/venues`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };

    fetchVenues();
  }, []);

  useEffect(() => {
    const filtered = venues.filter((venue) => {
      return (
        (venue.title && venue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (venue.category && venue.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (venue.location && venue.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredVenues(filtered);
  }, [searchTerm, venues]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this venue?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/venues/${id}`);
      setVenues(venues.filter((venue) => venue._id !== id));
      setShowAlert(true);
    } catch (error) {
      console.error('Error deleting venue:', error);
    }
  };

  const handleEdit = (venue) => {
    setEditVenue(venue);
  };

  return (
    <div className="venues">
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

      {editVenue ? (
        <EditVenue
          venue={editVenue}
          setEditVenue={setEditVenue}
          setShowAlert={setShowAlert}
        />
      ) : (
        <>
          <h3>Manage Venues</h3>
          <p>Total Entries: {venues.length}</p>

          <form onSubmit={handleSubmit} className="mb-3">
            <div className="form-group d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, category, or location"
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
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.map((venue) => (
                <tr key={venue._id}>
                  <td>{venue.title}</td>
                  <td>{venue.category}</td>
                  <td>{venue.location}</td>
                  <td>{venue.status}</td>
                  <td>
                    <button
                      className="btn btn-warning mr-2"
                      onClick={() => handleEdit(venue)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(venue._id)}
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

export default ManageVenue;
