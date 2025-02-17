import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddArtistForm = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [galleryFileNames, setGalleryFileNames] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMainImageFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImageFiles(files);
    setGalleryFileNames(files.map((file) => file.name));
  };

  const handleStatusToggle = () => {
    setIsPublished((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("speciality", speciality);
    formData.append("description", description);
    formData.append("videoUrl", videoUrl);
    formData.append("audioUrl", audioUrl);
    formData.append("image", mainImageFile);
    formData.append("isPublished", isPublished ? "published" : "draft"); // Set published status

    galleryImageFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/artists`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Artist created:", response.data);
      setShowAlert(true);
      // Reset form fields
      setTitle("");
      setCategory("");
      setSpeciality("");
      setDescription("");
      setVideoUrl("");
      setAudioUrl("");
      setMainImageFile(null);
      setGalleryImageFiles([]);
      setFileName("No file chosen");
      setGalleryFileNames([]);
      setIsPublished(false); // Reset published status
    } catch (error) {
      console.error("Error creating artist:", error);
    }
  };

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

  return (
    <>
      <h3>Add New Artist</h3>
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
          <label htmlFor="gallery">Artist Gallery</label>
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
            Artist added successfully!
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
          Add Artist
        </button>
      </form>
    </>
  );
};

export default AddArtistForm;


const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories`,
        { name: categoryName }
      );
      setCategories([...categories, response.data]);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      setCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleEdit = async (id, newName) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/categories/${id}`, {
        name: newName,
      });
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, name: newName } : category
        )
      );
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

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

  return (
    <div>
      <h3>Add Artist Category</h3>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group row">
          <label htmlFor="categoryName" className="col-sm-12 col-form-label">
            Category Name
          </label>
          <div className="col-sm-12">
            <input
              type="text"
              className="form-control"
              id="categoryName"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div className="col-sm-12">
            {showAlert && (
              <div
                className="alert alert-success alert-dismissible fade show"
                role="alert"
              >
                Success!
                {/* <button
                  type="button"
                  className="close"
                  onClick={() => setShowAlert(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button> */}
              </div>
            )}
            <button type="submit" className="btn btn-dark mt-3">
              Add Category
            </button>
          </div>
        </div>
      </form>

      {/* Table to show all categories */}
      <h3 className="mt-5">All Categories</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    handleEdit(category._id, prompt("Enter new category name"))
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={() => handleDelete(category._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { AddArtistForm, AddCategoryForm };
