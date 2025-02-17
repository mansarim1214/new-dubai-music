import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./frontend.css";

gsap.registerPlugin(Draggable);

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });
  const carouselRef = useRef(null);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []); // Empty dependency array to run only on component mount

  useEffect(() => {
    if (carouselRef.current) {
      const updateArrowVisibility = () => {
        if (carouselRef.current) {
          const scrollWidth = carouselRef.current.scrollWidth;
          const clientWidth = carouselRef.current.clientWidth;
          const scrollLeft = carouselRef.current.scrollLeft;

          setShowArrows({
            left: scrollLeft > 0,
            right: scrollLeft < scrollWidth - clientWidth,
          });
        }
      };

      updateArrowVisibility(); // Initial check

      window.addEventListener("resize", updateArrowVisibility);
      return () => window.removeEventListener("resize", updateArrowVisibility);
    }
  }, [favorites]); // Dependency on favorites to recalculate arrow visibility when favorites change

  useEffect(() => {
    if (window.innerWidth <= 500 && carouselRef.current) {
      gsap.killTweensOf(carouselRef.current);
      
      Draggable.create(carouselRef.current, {
        type: "x",
        bounds: {
          minX: -carouselRef.current.scrollWidth + carouselRef.current.clientWidth,
          maxX: 0,
        },
        inertia: true,
        throwProps: true,
        edgeResistance: 0.65,
        onThrowUpdate: () => {
          gsap.to(carouselRef.current, { x: carouselRef.current._gsap.x, ease: "power2.out" });
        },
        snap: {
          x: (value) => Math.round(value / 16.67) * 200, // Adjust based on item width
        },
      });
    }
  }, [favorites]); // Ensure this runs when favorites change, but not continuously

  const toggleFavorite = (artist) => {
    const updatedFavorites = favorites.filter((fav) => fav._id !== artist._id);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300 * direction; // Adjust the scroll amount as needed
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });

      setTimeout(() => {
        const scrollWidth = carouselRef.current.scrollWidth;
        const clientWidth = carouselRef.current.clientWidth;
        const scrollLeft = carouselRef.current.scrollLeft;

        setShowArrows({
          left: scrollLeft > 0,
          right: scrollLeft < scrollWidth - clientWidth,
        });
      }, 500); // Delay to allow smooth scrolling to update visibility
    }
  };

  return (
    <div className="bg-custom">
      <div className="container-fluid p-0" id="favorites">
      <h2 className="mb-3 fav-title"><strong>Artists You've Favorited</strong></h2>
        {showArrows.left && (
          <button
            className="arrow left react-multiple-carousel__arrow"
            onClick={() => scrollCarousel(-1)} // Scroll left
          >
            <BsChevronCompactLeft />
          </button>
        )}
        <div
          className="artistCarousel"
          ref={carouselRef}
          style={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {favorites.length > 0 ? (
            favorites.map((artist) => (
              <div
                key={artist._id}
                className="artistImage"
                style={{
                  flex: "0 0 16.67%", // 6 items visible at a time
                  boxSizing: "border-box",
                  padding: "0 5px",
                }}
              >
                <Link to={`/artist/${artist._id}`}>
                  <div className="artistImage">
                    {artist.imageUrl && (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                        alt={artist.title}
                        width="100%"
                        loading="lazy"
                      />
                    )}
                    <div className="artContent">
                      <h4 className="artTitle">{artist.title}</h4>
                    </div>
                  </div>
                </Link>
                <div className="favoriteIcon">
                  <button onClick={() => toggleFavorite(artist)}>
                    <BsHeartFill className="favorited" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            
            <p className="px-3">No favorites yet!</p>
          )}
        </div>
        {showArrows.right && (
          <button
            className="arrow right react-multiple-carousel__arrow"
            onClick={() => scrollCarousel(1)} // Scroll right
          >
            <BsChevronCompactRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Favorites;
