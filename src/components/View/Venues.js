import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { BsFillGeoAltFill } from "react-icons/bs";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import Banner from "./Banner";
import { Link } from "react-router-dom";
import WelcomeModal from "./WelcomeModal";
import "./frontend.css";

gsap.registerPlugin(Draggable);

const Venues = ({ onNavigate }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRefs = useRef([]);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/venues`
        );
        const publishedVenues = response.data.filter(
          (venue) => venue.status === "published"
        );
        setVenues(publishedVenues);
      } catch (error) {
        setError("Failed to fetch venues. Please try again later.");
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const isMobile = () => window.innerWidth <= 500;

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  const categoryOrder = [
    "Hot Picks",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Function to group venues by category and shuffle the venues in each category
  const groupVenuesByCategory = () => {
    const groupedVenues = {};
  
    venues.forEach((venue) => {
      if (!groupedVenues[venue.category]) {
        groupedVenues[venue.category] = [];
      }
      groupedVenues[venue.category].push(venue);
    });
  
    const orderedGroupedVenues = {};
    categoryOrder.forEach((category) => {
      if (groupedVenues[category]) {
        orderedGroupedVenues[category] = groupedVenues[category]; // No shuffle
      }
    });
  
    return orderedGroupedVenues;
  };
  

  const groupedVenues = groupVenuesByCategory();

  const scrollCarousel = (direction, index) => {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      const item = carousel.querySelector(".venueImage");
      const itemWidth = item ? item.clientWidth : 0;
      const scrollAmount = itemWidth * 3;

      let newScrollPosition = carousel.scrollLeft + scrollAmount * direction;
      newScrollPosition = Math.max(
        0,
        Math.min(newScrollPosition, carousel.scrollWidth - carousel.clientWidth)
      );

      gsap.to(carousel, {
        scrollLeft: newScrollPosition,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  useEffect(() => {
    if (isMobile()) {
      carouselRefs.current.forEach((carousel) => {
        if (carousel) {
          gsap.killTweensOf(carousel);

          Draggable.create(carousel, {
            type: "x",
            bounds: {
              minX: -carousel.scrollWidth + carousel.clientWidth,
              maxX: 0,
            },
            inertia: true,
            throwProps: true,
            edgeResistance: 0.65,
            onThrowUpdate: () => {
              gsap.to(carousel, { x: carousel._gsap.x, ease: "power2.out" });
            },
            snap: {
              x: (value) => Math.round(value / 16.67) * 200,
            },
          });
        }
      });
    }
  }, [groupedVenues]);

  const handleClick = (venue) => {
    if (onNavigate) {
      onNavigate(`/venuedetail/${venue._id}`);
    }
  };



  return (
    <div className="bg-custom">
      <WelcomeModal />

      <div className="container-fluid p-0">
      <Banner />

        {Object.keys(groupedVenues).map((category, index) => {
          const carousel = carouselRefs.current[index];
          const isScrollable =
            carousel && carousel.scrollWidth > carousel.clientWidth;

          return (
            <div key={category} className="category-wrapper">
              <div className="div mb-2">
                <h2 className="my-2 fav-title">{category}</h2>
                <hr />
              </div>

              <div className="row">
                <div className="col p-relative">
                  {isScrollable && (
                    <button
                      className="arrow left react-multiple-carousel__arrow react-multiple-carousel__arrow--left"
                      onClick={() => scrollCarousel(-1, index)}
                    >
                      <BsChevronCompactLeft />
                    </button>
                  )}
                  <div
                    className="venueCarousel"
                    ref={(el) => (carouselRefs.current[index] = el)}
                    style={{
                      display: "flex",
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    {groupedVenues[category].map((venue) => (
                      <div
                        key={venue._id}
                        className="venueImage"
                        style={{ flex: "0 0 16.67%", padding: "0 5px" }}
                      >
                        <div onClick={() => handleClick(venue)}>
                          <div className="artistImage">
                            {venue.featuredImage ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${venue.featuredImage}`}
                                alt={venue.title}
                                width="100%"
                                loading="lazy"
                              />
                            ) : (
                              <div className="image-placeholder"></div>
                            )}
                            {venue.isNew && (
                              <span className="newLabel">Recently Added</span>
                            )}
                            <div className="artContent">
                              <h4 className="artTitle">{venue.title}</h4>
                              {venue.location && (
                                <span className="location">
                                  <BsFillGeoAltFill /> {venue.location}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isScrollable && (
                    <button
                      className="arrow right react-multiple-carousel__arrow react-multiple-carousel__arrow--right"
                      onClick={() => scrollCarousel(1, index)}
                    >
                      <BsChevronCompactRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Venues;
