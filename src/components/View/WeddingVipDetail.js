import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import "./frontend.css";
import ReactPlayer from "react-player";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa"; // Import WhatsApp icon

const WeddingVIPDetail = ({onNavigate}) => {
  const { id } = useParams();
  const [weddingVIP, setWeddingVIP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [formMessage, setFormMessage] = useState("");
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);  
  
  const navigate = useNavigate();

  const handleBack = () => {
    setProgress(50); 
    if (onNavigate) {
      onNavigate(`/wedding-vip-packages`);
    }


  };

  // Video URL Functions
  function getEmbedUrl(url) {
    if (!url) {
      console.error("URL is null or undefined");
      return null; // Handle missing URL
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
      return null; // Or return a placeholder URL
    }

    // Return the embed URL format with the rel=0 parameter
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  }

  const addTargetToLinks = (html) => {
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  useEffect(() => {
    const fetchWeddingVIP = async () => {
      setProgress(30);  
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/weddingvip/${id}`
        );
        setWeddingVIP(response.data);
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
        console.error("Error fetching wedding VIP details:", error);
        setLoading(false);
      }finally {
        setProgress(100);  
        setLoading(false);
      }
    };

    fetchWeddingVIP();
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
      vipTitle: weddingVIP?.title,
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


  

  if (!weddingVIP) return <div className="store-detail bg-custom"></div>;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;

  return (
    <div className="artist-detail bg-custom">
      <div className="container">

      <Suspense fallback={<div>Loading Back Button...</div>}>
        <span onClick={handleBack} className="back-btn">
          <BsArrowLeftSquareFill size={30} className="my-2" />
        </span>

        </Suspense>

        {weddingVIP.videoUrl && (
          <div className="artist-video">
            <iframe
              width="100%"
              height="500"
              src={getEmbedUrl(weddingVIP.videoUrl)}
              title={weddingVIP.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {weddingVIP.audioUrl && (
          <div className="artist-audio">
            <ReactPlayer url={weddingVIP.audioUrl} />
          </div>
        )}
        <h1>{weddingVIP.title}</h1>

        <div id="description" className="mt-3">
          <div className="row">
            <div
              className={`col-md-${
                weddingVIP.galleryImages.length || weddingVIP.imageUrl ? "6" : "12"
              }`}
            >
              <h4>About</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    addTargetToLinks(weddingVIP.description) ||
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

            {(weddingVIP.galleryImages.length || weddingVIP.imageUrl) && (
              <div className={`col-md-${weddingVIP.imageUrl ? "6" : "12"}`}>
                {weddingVIP.imageUrl && (
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${weddingVIP.imageUrl}`}
                    alt={weddingVIP.title}
                    className="artist-image mb-2"
                    style={{ width: "100%", height: "auto" }}
                    loading="lazy"
                  />
                )}

                {weddingVIP.galleryImages.length > 0 && (
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
                                alt={`Gallery ${index + 1}`}
                                className="grid-item"
                                style={{ cursor: "pointer" }}
                                loading="lazy"
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

export default WeddingVIPDetail;
