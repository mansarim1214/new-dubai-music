import React, { useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddMusicStore = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [store, setStore] = useState({
    name: "",
    bio: "",
    contact: "",
    logo: "",
    featuredImage: "",
    status: "draft", // Default to draft
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setStore((prevState) => ({ ...prevState, [name]: e.target.files[0] }));
  };

  const handleBioChange = (event, editor) => {
    const data = editor.getData();
    setStore((prevState) => ({ ...prevState, bio: data }));
  };

  const handleStatusToggle = () => {
    setStore((prevState) => ({
      ...prevState,
      status: prevState.status === "published" ? "draft" : "published",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", store.name);
    formData.append("bio", store.bio);
    formData.append("status", store.status); // Send status field
    formData.append("contact", store.contact);

    if (store.logo) {
      formData.append("logo", store.logo);
    }

    if (store.featuredImage) {
      formData.append("featuredImage", store.featuredImage);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/musicstore`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Music store saved successfully:", response.data);
      setShowAlert(true); // Set showAlert to true on successful submission

      // Redirect or reset form if needed
      setTimeout(() => {
        setShowAlert(false);
        // Navigate or reset form if needed
      }, 3000);
    } catch (error) {
      console.error("Error saving music store:", error);
      // Handle error state or display error message to user
    }
  };

  return (
    <div className="add-music-store">
      <h3>Add New Music Store</h3>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mt-3"
      >
        <div className="form-group">
          <label>Store Name</label>
          <input
            type="text"
            name="name"
            value={store.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Store Bio</label>
          <CKEditor
            editor={ClassicEditor}
            data={store.bio}
            onChange={handleBioChange}
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input
            type="text"
            name="contact"
            value={store.contact}
            onChange={handleChange}
            
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Featured Image</label>
          <input
            type="file"
            name="featuredImage"
            onChange={handleFileChange}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="custom-switch">
            <input
              type="checkbox"
              id="statusSwitch"
              checked={store.status === "published"}
              onChange={handleStatusToggle} // Update on change
            />
            <label className="slider" htmlFor="statusSwitch"></label>
            <span className="custom-switch-label">
              {store.status === "publish" ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {showAlert && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            Music store added successfully!
            <button
              type="button"
              className="close"
              onClick={() => setShowAlert(false)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}

        <button type="submit" className="btn btn-lg btn-dark mt-5">
          Add Music Store
        </button>
      </form>
    </div>
  );
};

export default AddMusicStore;
