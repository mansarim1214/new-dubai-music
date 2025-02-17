import React, { useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddWeddingVip = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [category, setCategory] = useState(""); // State for category
  const [fileName, setFileName] = useState("No file chosen");
  const [showAlert, setShowAlert] = useState(false);
  const [galleryFileNames, setGalleryFileNames] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null); // State for main image
  const [galleryImageFiles, setGalleryImageFiles] = useState([]); // State for gallery images
  const [isPublished, setIsPublished] = useState(false);


  // Handle main image file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMainImageFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  // Handle gallery images file change
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImageFiles(files);
    setGalleryFileNames(files.map((file) => file.name));
  };


  const handleStatusToggle = () => {
    setIsPublished((prev) => !prev);
  };


  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoUrl", videoUrl);
    formData.append("category", category); // Append selected category
    formData.append("image", mainImageFile); // Append main image file
    formData.append("isPublished", isPublished ? "published" : "draft"); // Set published status


    galleryImageFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/weddingvip`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Wedding-VIP created:", response.data);
      setShowAlert(true);
      // Reset form fields
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setCategory(""); // Reset category
      setMainImageFile(null);
      setGalleryImageFiles([]);
      setFileName("No file chosen");
      setGalleryFileNames([]);
      setIsPublished(false); // Reset published status

    } catch (error) {
      console.error("Error creating wedding-vip:", error);
    }
  };

  return (
    <>
      <h3>Add New Wedding VIP</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
            config={{
              placeholder: "Enter wedding-VIP bio",
            }}
          />
        </div>

        {/* Category selection dropdown */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Wedding/Engagement Packages">Wedding/Engagement Packages</option>
            <option value="VIP Bookings">VIP Bookings</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="videoUrl">Video URL</label>
          <input
            type="text"
            className="form-control"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter video URL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Wedding/VIP Photo</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              className="form-control-file"
              id="image"
              required
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => document.getElementById("image").click()}
            >
              Upload Photo
            </button>
            <span id="file-name">{fileName}</span>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="gallery">Gallery</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              className="form-control-file"
              id="gallery"
              multiple
              onChange={handleGalleryChange}
            />
            <button
              type="button"
              className="btn btn-dark"
              onClick={() => document.getElementById("gallery").click()}
            >
              Upload Gallery Images
            </button>
            <span id="file-name">
              {galleryFileNames.join(", ") || "No files chosen"}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="custom-switch">
            <input
              type="checkbox"
              id="statusSwitch"
              checked={isPublished}
              onChange={handleStatusToggle}
            />
            <label className="slider" htmlFor="statusSwitch"></label>
            <span className="custom-switch-label">
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        {showAlert && (
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            Wedding VIP added successfully!
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
          Add Wedding VIP
        </button>
      </form>
    </>
  );
};

export default AddWeddingVip;
