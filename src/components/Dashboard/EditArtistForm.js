import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditArtist = ({ artist, setEditArtist, setShowAlert }) => {
  const [title, setTitle] = useState(artist.title);
  const [category, setCategory] = useState(artist.category);
  const [speciality, setSpeciality] = useState(artist.speciality);
  const [description, setDescription] = useState(artist.description);
  const [videoUrl, setVideoUrl] = useState(artist.videoUrl);
  const [audioUrl, setAudioUrl] = useState(artist.audioUrl);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState(
    artist.galleryImages || []
  );
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [isPublished, setIsPublished] = useState(artist.status); // Added published status

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setFileName(file ? file.name : "No file chosen");
  };

  const handleGalleryImagesChange = (e) => {
    setNewGalleryImages([...newGalleryImages, ...Array.from(e.target.files)]);
  };

  const removeGalleryImage = async (index) => {
    const imageToRemove = galleryImages[index];

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/artists/${artist._id}/gallery`,
        {
          data: { image: imageToRemove },
        }
      );

      setGalleryImages(galleryImages.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing gallery image:", error);
    }
  };

  const removeNewGalleryImage = (index) => {
    setNewGalleryImages(newGalleryImages.filter((_, i) => i !== index));
  };

  const handleStatusToggle = () => {
    setIsPublished((prevStatus) =>
      prevStatus === "published" ? "draft" : "published"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const artistId = artist._id; // Use the artist's ID from the props

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("speciality", speciality);
    formData.append("description", description);
    formData.append("videoUrl", videoUrl);
    formData.append("audioUrl", audioUrl);

    if (image) {
      formData.append("image", image); // Field name 'image'
    }

    formData.append("isPublished", isPublished); // Add published status

    // Append new gallery images
    newGalleryImages.forEach((img) => {
      formData.append("galleryImages", img); // Field name 'galleryImages'
    });

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/artists/${artistId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Artist updated successfully:", response.data);
      setShowAlert({
        type: "success",
        message: "Artist updated successfully!",
      });
      setEditArtist(null);
    } catch (error) {
      console.error(
        "Error updating artist:",
        error.response ? error.response.data : error.message
      );
      setShowAlert({ type: "danger", message: "Failed to update artist." });
    }
  };

  return (
    <>
      <h3>Edit Artist</h3>
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
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="speciality">Speciality</label>
          <input
            type="text"
            className="form-control"
            id="speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            placeholder="Artist Speciality"
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
              placeholder: "Enter artist bio",
            }}
          />
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
          <label htmlFor="audioUrl">Audio URL</label>
          <input
            type="text"
            className="form-control"
            id="audioUrl"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="Enter audio URL"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Artist Photo</label>
          <div className="custom-file-input-wrapper">
            <input
              type="file"
              className="form-control-file"
              id="image"
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
          <label>Gallery Images</label>
          <div>
            <input
              type="file"
              multiple
              className="form-control"
              onChange={handleGalleryImagesChange}
            />
          </div>
          <div className="gallery-container mt-3">
            <h5>Existing Gallery Images</h5>
            <div className="grid-container">
              {galleryImages.map((img, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${img}`}
                    alt={`Galleryimg ${index + 1}`}
                    className="img-fluid"
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => removeGalleryImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {newGalleryImages.length > 0 && (
              <>
                <h5 className="mt-4">New Gallery Images</h5>
                <div className="grid-container">
                  {newGalleryImages.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`New Galleryimg ${index + 1}`}
                        className="img-fluid"
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => removeNewGalleryImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="custom-switch">
            <input
              type="checkbox"
              id="statusSwitch"
              checked={isPublished === "published"} 
              onChange={handleStatusToggle} 
            />
            <label className="slider" htmlFor="statusSwitch"></label>
            <span className="custom-switch-label">
              {isPublished === "published" ? "Published" : "Draft"}{" "}
             
            </span>
          </div>
        </div>

        <button type="submit" className="btn btn-lg btn-dark mt-5">
          Update Artist
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-3 mt-5"
          onClick={() => setEditArtist(null)}
        >
          Cancel
        </button>
      </form>
    </>
  );
};

export default EditArtist;
