import React, { useState, useEffect } from "react";
import axios from "axios";
import EditArtistForm from "./EditArtistForm";
import "./Dashboard.css";

const ViewArtists = () => {
  const [artists, setArtists] = useState([]);
  const [editArtist, setEditArtist] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/artists`);
        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  useEffect(() => {
    // Filter artists based on search term
    const filtered = artists.filter((artist) => {
      const title = artist.title ? artist.title.toLowerCase() : '';
      const category = artist.category ? artist.category.toLowerCase() : '';
      const speciality = artist.speciality ? artist.speciality.toLowerCase() : '';
      const search = searchTerm.toLowerCase();
    
      return title.includes(search) || category.includes(search) || speciality.includes(search);
    });
    
    setFilteredArtists(filtered);
  }, [searchTerm, artists]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this artist?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/artists/${id}`);
      setArtists(artists.filter((artist) => artist._id !== id));
      setShowAlert(true);
    } catch (error) {
      console.error("Error deleting artist:", error);
    }
  };

  const handleEdit = (artist) => {
    setEditArtist(artist);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, you can perform search or filter logic here
  };

  return (
    <div>
      
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
      
      {/* Artists Table */}
      {editArtist ? (
        <EditArtistForm
          artist={editArtist}
          setEditArtist={setEditArtist}
          setShowAlert={setShowAlert}
        />
      ) : (

        <>
        
        <h3>All Artists</h3>
      <p>Total Entries: {artists.length}</p>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="form-group d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, category, or speciality"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          
        </div>
      </form>
        
        <table className="table table-responsive" width={'100%'}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Category</th>
              <th>Speciality</th>
              <th>Description</th>
              <th>Video URL</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtists.map((artist) => (
              <tr key={artist._id}>
                <td>{artist.title}</td>
                <td>{artist.isPublished}</td>
                <td>{artist.category}</td>
                <td>{artist.speciality}</td>
                <td>{artist.description}</td>
                <td>{artist.videoUrl}</td>
                <td>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                    alt={artist.title}
                    style={{ width: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => handleEdit(artist)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(artist._id)}
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

export default ViewArtists;
