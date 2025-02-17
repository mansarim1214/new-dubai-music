import React, { useState } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const EditWeddingVip = ({ weddingVip, setEditWeddingVip, setShowAlert }) => {
  const [title, setTitle] = useState(weddingVip.title);
  const [description, setDescription] = useState(weddingVip.description);
  const [videoUrl, setVideoUrl] = useState(weddingVip.videoUrl);
  const [category, setCategory] = useState(weddingVip.category || ""); // State for category
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [galleryImages, setGalleryImages] = useState(weddingVip.galleryImages || []);
  const [isPublished, setIsPublished] = useState(weddingVip.status); 
  const [newGalleryImages, setNewGalleryImages] = useState([]);

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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/weddingvip/${weddingVip._id}/gallery`, {
        data: { image: imageToRemove },
      });

      setGalleryImages(galleryImages.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing gallery image:', error);
    }
  };

  const removeNewGalleryImage = (index) => {
    setNewGalleryImages(newGalleryImages.filter((_, i) => i !== index));
  };



  const handleStatusToggle = () => {
    setIsPublished((prevStatus) => {
      const newStatus = prevStatus === 'published' ? 'draft' : 'published' // Toggle published status

    return newStatus;
  });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const weddingVipId = weddingVip._id;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videoUrl', videoUrl);
    formData.append('category', category); // Append category
    formData.append('isPublished', isPublished); // Add published status


    if (image) {
      formData.append('image', image); // Append main image file
    }

    // Append new gallery images
    newGalleryImages.forEach((img) => {
      formData.append('galleryImages', img);
    });

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/weddingvip/${weddingVipId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );



      console.log('Wedding VIP updated successfully:', response.data);
      setShowAlert({ type: 'success', message: 'Wedding VIP updated successfully!' });
      setEditWeddingVip(null);
    } catch (error) {
      console.error('Error updating wedding VIP:', error.response ? error.response.data : error.message);
      setShowAlert({ type: 'danger', message: 'Failed to update wedding VIP.' });
    }
  };

  return (
    <>
      <h3>Edit Wedding VIP</h3>
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
              placeholder: "Enter wedding VIP bio",
            }}
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
            <option value="">Select a category</option>
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
          <label htmlFor="image">Wedding VIP Photo</label>
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
                    alt={`Gallery img ${index + 1}`}
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
                        alt={`New Gallery img ${index + 1}`}
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


          {/* Toggle for Publish/Draft */}
          <div className="form-group">
          <label>Status</label>
          <div className="custom-switch">
            <input
              type="checkbox"
              id="statusSwitch"
              checked = {isPublished === "published"}
              name={isPublished}
              onChange={handleStatusToggle} // Update on change
            />
            <label className="slider" htmlFor="statusSwitch"></label>
            <span className="custom-switch-label">
              {isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        

        <button type="submit" className="btn btn-lg btn-dark mt-5">
          Update Wedding VIP
        </button>
        <button
          type="button"
          className="btn btn-secondary ml-3 mt-5"
          onClick={() => setEditWeddingVip(null)}
        >
          Cancel
        </button>
      </form>
    </>
  );
};

export default EditWeddingVip;
