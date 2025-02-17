import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import { FaWhatsapp } from "react-icons/fa";
import "./frontend.css"; // Import the CSS file for styling

const BsArrowLeftSquareFill = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsArrowLeftSquareFill }))
);
const BsTelephone = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsTelephone }))
);

const VenueDetail = ({ onNavigate }) => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const handleBack = () => {
    setProgress(50);

    if (onNavigate) {
      onNavigate(`/venues`);
    }
  };

  useEffect(() => {
    const fetchVenue = async () => {
      setProgress(30);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/venues/${id}`
        );
        setVenue(response.data);
        setLoading(false);

        // Load images to get their dimensions
        const imagePromises = response.data.gallery.map(async (img) => {
          const src = `${process.env.REACT_APP_API_URL}/${img}`;
          return new Promise((resolve) => {
            const image = new Image();
            image.src = src;
            image.onload = () =>
              resolve({ src, width: image.width, height: image.height });
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        setGalleryImages(loadedImages);
      } catch (error) {
        console.error("Error fetching venue:", error);
        setError("Failed to fetch venue. Please try again later.");
      } finally {
        setProgress(100);
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=Check out this: ${window.location.href}`;

  const addTargetToLinks = (html) => {
    return html.replace(
      /<a /g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
  };

  return (
    <div className="venue-detail bg-custom">
      <div className="container">
        {/* Static Content */}
        <Suspense fallback={<div>Loading Back Button...</div>}>
          <span onClick={handleBack} className="back-btn">
            <BsArrowLeftSquareFill size={30} className="my-2" />
          </span>
        </Suspense>

        <h1>{loading ? "" : venue?.title}</h1>

        <div>
          Location:{" "}
          <span>{loading ? "" : venue?.location || "N/A"}</span>
        </div>

        {/* Dynamic Content */}
        {!loading && !error && venue && (
          <>
            <div id="description" className="mt-3">
              <div className="row">
                <div
                  className={`col-md-${
                    galleryImages.length || venue.featuredImage ? "6" : "12"
                  }`}
                >
                  <h4>About</h4>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        addTargetToLinks(venue.description) ||
                        "<em>Description not available yet</em>",
                    }}
                  />

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

                {(galleryImages.length || venue.featuredImage) && (
                  <div className={`col-md-${venue.featuredImage ? "6" : "12"}`}>
                    {venue.featuredImage && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${venue.featuredImage}`}
                        alt={venue.title}
                        className="venue-image mb-2"
                        style={{ width: "100%", height: "auto" }}
                        loading="lazy"
                      />
                    )}
                    {galleryImages.length > 0 && (
                      <div className="gallery-container">
                        <h4>Gallery</h4>
                        <Gallery>
                          <div className="grid-container">
                            {galleryImages.map((img, index) => (
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
                                    alt={`galleryimg ${index + 1}`}
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

            {venue.contact && (
              <div className="venueForm mt-3">
                <div className="my-2">
                  <h1>Contact Venue</h1>
                  <a
                    href={`tel:${venue.contact}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-call"
                  >
                    <BsTelephone /> Call Now
                  </a>
                </div>
              </div>
            )}
          </>
        )}

        {error && <div>Error: {error}</div>}
      </div>
    </div>
  );
};

export default VenueDetail;
