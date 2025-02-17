import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import ReactPlayer from "react-player";
import { FaWhatsapp } from "react-icons/fa"; 
import "./frontend.css";

const BsArrowLeftSquareFill = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsArrowLeftSquareFill }))
);


const ArtistDetail = ({onNavigate}) => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [formMessage, setFormMessage] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);  
  const [showVideo, setShowVideo] = useState(false);


  
  const navigate = useNavigate();

  const handleBack = () => {
    setProgress(50); 
    
    if (onNavigate) {
      onNavigate(`/musicians`);
    }
  };
  

  // Video URL Functions

  function getEmbedUrl(url) {
    if (!url) {
      console.error("URL is null or undefined");
      return { embedUrl: null, thumbnailUrl: null };
    }
  
    const extractVideoId = (url) => {
      const regex =
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };
  
    const videoId = extractVideoId(url);
    if (!videoId) {
      console.error("Invalid or unsupported YouTube URL:", url);
      return { embedUrl: null, thumbnailUrl: null };
    }
  
    return {
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }
  
  const handlePlayVideo = () => {
    setShowVideo(true);
  };


  const addTargetToLinks = (html) => {
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  useEffect(() => {
    const fetchArtist = async () => {
      setProgress(30); 
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/artists/${id}`
        );
        setArtist(response.data);
        setLoading(false);

        // Load images to get their dimensions
        const imagePromises = response.data.galleryImages.map(async (img) => {
          const src = `${process.env.REACT_APP_API_URL}/${img}`;
          return new Promise((resolve) => {
            const image = new Image();
            image.src = src;
            image.onload = () =>
              resolve({ src, width: image.width, height: image.height });
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
      } catch (error) {
        console.error("Error fetching artist:", error);
        
      }finally {
        setProgress(100);  
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      artistName: artist?.title,
    };

    emailjs
      .send(
        "service_3hkljmf",
        "template_tg0y1rn",
        templateParams,
        "q1l_DC7jwQvu80xJ5"
      )
      .then((response) => {
        setFormMessage("Booking request sent successfully!");
        setFormData({ name: "", phone: "", email: "" });
      })
      .catch((error) => {
        setFormMessage("Failed to send booking request. Please try again.");
        console.error("Error sending booking request:", error);
      });
  };



  if (!artist) return <div></div>;

  // Categories that should hide Category and Speciality fields
  const hiddenCategories = ["Wedding Packages", "VIP"];
  const shouldHideDetails = hiddenCategories.includes(artist.category);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;

  return (
    <div className="artist-detail bg-custom">
      <div className="container">
      
      <span onClick={handleBack} className="back-btn">
      <BsArrowLeftSquareFill  size={30} className="my-2"/> {/* Arrow icon */}
    </span>


  {loading ? (
          <div className="spinner">Loading artist details...</div>
        ) : (
          <div className="artist-video">
  {!showVideo ? (
    <div
      className="video-placeholder"
      style={{
        position: "relative",
        paddingBottom: "56.25%", // 16:9 Aspect Ratio
        height: 0,
        backgroundImage: `url(${getEmbedUrl(artist.videoUrl)?.thumbnailUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        cursor: "pointer",
      }}
      onClick={handlePlayVideo}
    >
      <button
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "50%",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        ▶
      </button>
    </div>
  ) : (
    <iframe
      width="100%"
      height="500"
      src={getEmbedUrl(artist.videoUrl)?.embedUrl}
      title={artist.title}
      frameBorder="0"
      allowFullScreen
    ></iframe>
  )}
</div>
        )}

        {artist.audioUrl && (
          <div className="artist-audio">
            <ReactPlayer url={artist.audioUrl} />
          </div>
        )}
        <h1>{loading ? "" : artist?.title}</h1>

        {/* Conditionally show Category and Speciality */}
        {!shouldHideDetails && (
          <>
            <div>
              Category: <span>{loading ? "" : artist?.category || "N/A"}</span>
            </div>
            <div>
              Music Style: <span>{loading ? "" : artist.speciality || "N/A" }</span>
            </div>
          </>
        )}

        <div id="description" className="mt-3">
          <div className="row">
            <div
              className={`col-md-${
                artist.galleryImages.length || artist.imageUrl ? "6" : "12"
              }`}
            >
              <h4>About</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    addTargetToLinks(artist.description) ||
                    "<em>Description not available yet</em>",
                }}
              />

              {/* WhatsApp Share Button */}
              <div className="whatsapp-share my-5">
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  <FaWhatsapp /> Share with Friends
                </a>
              </div>
            </div>

            {(artist.galleryImages.length || artist.imageUrl) && (
              <div className={`col-md-${artist.imageUrl ? "6" : "12"}`}>
                {artist.imageUrl && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                    alt={artist.title}
                    className="artist-image mb-2"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}

                {artist.galleryImages.length > 0 && (
                  <div className="gallery-container">
                    <h4>Gallery</h4>
                    <Gallery>
                      <div className="grid-container">
                        {images.map((img, index) => (
                          <Item
                            key={index}
                            original={img.src}
                            thumbnail={img.src}
                            width={img.width}
                            height={img.height}
                          >
                            {({ ref, open }) => (
                              <img
                                ref={ref}
                                onClick={open}
                                src={img.src}
                                alt={`Galleryimage ${index + 1}`}
                                className="grid-item"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                          </Item>
                        ))}
                      </div>
                    </Gallery>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="artistForm mt-3">
          <h1 className="mx-2 my-2">Book Now</h1>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <button type="submit" className="btn enquirybtn">
                  Book Now
                </button>
              </div>
            </div>
          </form>
          {formMessage && <p className="form-message">{formMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetail;
