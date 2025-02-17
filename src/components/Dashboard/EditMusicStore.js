import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditMusicStore = ({ store, setEditStore, setShowAlert }) => {
  const [name, setName] = useState(store.name || "");
  const [contact, setContact] = useState(store.contact || "");
  const [bio, setBio] = useState(store.bio || ""); // Added bio state
  const [logo, setLogo] = useState(store.logo || "");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [newLogo, setNewLogo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState(store.status || ""); 


  useEffect(() => {
    setName(store.name || "");
    setContact(store.contact || "");
    setBio(store.bio || "");
    setLogo(store.logo || "");
    setStatus(store.status || ""); 

    setFeaturedImage(store.featuredImage || ""); // Ensure featuredImage is set here
  }, [store]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("contact", contact);
    formData.append("bio", bio);
    formData.append("status", status); 

    if (newLogo) {
      formData.append("logo", newLogo); // Append the new logo if uploaded
    }
    if (featuredImage) {
      formData.append("featuredImage", featuredImage); // Append the new logo if uploaded
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/musicstore/${store._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setShowAlert(true); // Show success alert
      setEditStore(null); // Close the edit form
    } catch (error) {
      console.error("Error updating music store:", error);
      setErrorMessage("Error updating the store. Please try again.");
    }
  };

  const handleStatusToggle = () => {
    setStatus((prevStatus) => {
      const newStatus = prevStatus === "published" ? "draft" : "published";
      console.log("Toggled Status:", newStatus); // Debugging log
      return newStatus;
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogo(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  return (
    <div className="edit-music-store">
      <h3>Edit Music Store</h3>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>




        <div className="form-group">
          <label>Bio</label>
          <CKEditor
            editor={ClassicEditor}
            data={bio} // use 'data' instead of 'value' for CKEditor
            onChange={(event, editor) => {
              const data = editor.getData();
              setBio(data); // Update the bio state with the editor's content
            }}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "|",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "|",
                "undo",
                "redo",
              ],
              placeholder: "Enter the bio for the store here...",
            }}
          />
        </div>

        
        <div className="form-group">
          <label>Contact</label>
          <input
            type="text"
            className="form-control"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            
          />
        </div>

        <div className="form-group">
          <label>Current Logo</label>
          {logo ? (
            <div>
              <img
                src={`${process.env.REACT_APP_API_URL}/${logo}`}
                alt={name}
                style={{ width: "100px" }}
              />
            </div>
          ) : (
            <p>No Logo</p>
          )}
        </div>

        <div className="form-group">
          <label>Upload New Logo (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleLogoChange}
            
          />
        </div>

        <div className="form-group">
          <label>Current Featured Image</label>
          {featuredImage ? ( // Change this to check 'featuredImage' state
            <div>
              <img
                src={`${process.env.REACT_APP_API_URL}/${store.featuredImage}`} // Reference store.featuredImage for current image
                alt={name}
                style={{ width: "100px" }}
              />
            </div>
          ) : (
            <p>No Featured Image</p>
          )}
        </div>

        <div className="form-group">
          <label>Featured Image</label>
          <input
            type="file"
            name="featuredImage"
            onChange={handleFileChange}
            className="form-control"
            
          />
        </div>

        <div className="form-group">
            <label>Status</label>
            <div className="custom-switch">
              <input
                type="checkbox"
                id="statusCont"
                checked={status === "published"} // Check if local status is 'publish'
                onChange={handleStatusToggle} // Call the toggle function
              />
              <label className="slider" htmlFor="statusCont">
                {" "}
              </label>
              <span className="custom-switch-label">
                {status === "published" ? "Published" : "Draft"}
              </span>
            </div>
          </div>

        <div className="form-group d-flex">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={() => setEditStore(null)} // Close the edit form
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMusicStore;
