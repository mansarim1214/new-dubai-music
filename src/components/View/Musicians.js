import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import axios from "axios";
import "./frontend.css";


gsap.registerPlugin(Draggable);

const Musicians = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [artistsByCategory, setArtistsByCategory] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showArrows, setShowArrows] = useState({ left: false, right: false });
  const carouselRefs = useRef([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const manualArtistOrder = {
        Singers: [
          "Jerome Deligero",
          "Emily Peacock",
          "Toi Dupras",
          "Yvonne Park",
          "Matt Palmer",
          "Lina Ammor- Jevtic",
          "Eirini Devitt",
          "Juan Pablo Pellicer",
          "Nick Pritchard",
          "Mostafa Sattar",
          "Jin Flora",
          "Robbi McFaulds",
        ],
        DJ: [
          "Dadou",
          "Elena",
          "Yana Kulyk",
          "Raphy J",
          "DJ Stylez",
          "DJ Melyna",
        ],
        Musicians: [
          "Ksenia Kot",
          "Jose Ramon Nunez",
          "Soren Lyng Hansen",
          "Tatiana Durova",
          "Aleksandra Dudek",
          "Ulyana Goncharova",
        ],
        Trending: [
          "Carrie Gibson’s NuvoSoul",
          "Jaymie Deville",
          "Chelsey Chantelle",
          "Golden Collective",
          "Abdallah Seleem",
          "Dany Echemendia",
          "Marvin Lee",
        ],
      };

      try {
        setLoading(true);
        const categoriesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/categories`
        );
        const fetchedCategories = categoriesResponse.data;

        const artistsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/artists`
        );
        let fetchedArtists = artistsResponse.data;

        // Filter only published artists
        fetchedArtists = fetchedArtists.filter(
          (artist) => artist.isPublished === "published"
        );

        // Define the desired order
        const desiredOrder = [
          "Trending",
          "Singers",
          "Solo Looping Artists",
          "Band",
          "DJ",
          "Musicians",
        ];

        // Sort categories based on desiredOrder
        const sortedCategories = fetchedCategories.sort((a, b) => {
          const aIndex = desiredOrder.indexOf(a.name);
          const bIndex = desiredOrder.indexOf(b.name);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        // Load favorites from localStorage
        const storedFavorites =
          JSON.parse(localStorage.getItem("favorites")) || [];

        // Ensure favorites are marked correctly
        const groupedArtists = {};

        sortedCategories.forEach((category) => {
          let sortedArtists = fetchedArtists
            .filter((artist) => artist.category === category.name)
            .map((artist) => ({
              ...artist,
              isFavorite: storedFavorites.some((fav) => fav._id === artist._id),
            }));

          const order = manualArtistOrder[category.name];
          if (order) {
            // Sort based on manualArtistOrder
            const sortedByManualOrder = sortedArtists
              .filter((artist) => order.includes(artist.title))
              .sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));

            // Add artists not in the manualArtistOrder at the end
            const remainingArtists = sortedArtists.filter(
              (artist) => !order.includes(artist.title)
            );

            sortedArtists = [...sortedByManualOrder, ...remainingArtists];
          }

          groupedArtists[category.name] = sortedArtists;
        });

        // Update state with sorted categories and artists
        setCategories(sortedCategories);
        setArtistsByCategory(groupedArtists);
        setFavorites(storedFavorites);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (carouselRefs.current.length > 0) {
      const updateArrowVisibility = () => {
        carouselRefs.current.forEach((carousel, index) => {
          if (carousel) {
            const scrollWidth = carousel.scrollWidth;
            const clientWidth = carousel.clientWidth;
            const scrollLeft = carousel.scrollLeft;

            setShowArrows((prev) => ({
              ...prev,
              [index]: {
                left: scrollLeft > 0,
                right: scrollLeft < scrollWidth - clientWidth,
              },
            }));
          }
        });
      };

      updateArrowVisibility(); // Initial check

      window.addEventListener("resize", updateArrowVisibility);
      return () => window.removeEventListener("resize", updateArrowVisibility);
    }
  }, [artistsByCategory, favorites]);

  useEffect(() => {
    if (window.innerWidth <= 500 && carouselRefs.current.length > 0) {
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
              x: (value) => Math.round(value / 16.67) * 200, // Adjust based on item width
            },
          });
        }
      });
    }
  }, [artistsByCategory, favorites]);

  const toggleFavorite = (artist) => {
    // Get the current favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Check if the artist is already in favorites
    const isAlreadyFavorite = savedFavorites.some(
      (fav) => fav._id === artist._id
    );

    // Update favorites based on whether the artist is already a favorite
    const updatedFavorites = isAlreadyFavorite
      ? savedFavorites.filter((fav) => fav._id !== artist._id)
      : [...savedFavorites, artist];

    // Update state and localStorage
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (artist) => {
    return favorites.some((fav) => fav._id === artist._id);
  };

  const scrollCarousel = (direction, index) => {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      // Assuming each slide is 16.67% of the carousel width
      const slideWidth = carousel.clientWidth / 6; // Adjust the denominator based on the number of visible slides
      const scrollAmount = slideWidth * 3 * direction; // Scroll by 3 slides

      carousel.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(() => {
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;
        const scrollLeft = carousel.scrollLeft;

        setShowArrows((prev) => ({
          ...prev,
          [index]: {
            left: scrollLeft > 0,
            right: scrollLeft < scrollWidth - clientWidth,
          },
        }));
      }, 500); // Delay to allow smooth scrolling to update visibility
    }
  };

  const handleClick = (artist) => {
    if (onNavigate) {
      onNavigate(`/artist/${artist._id}`);
    }
  };

  return (
    <div className="mainFront">

      <div className="container-fluid p-0" >


        {categories
          .filter(
            (category) =>
              artistsByCategory[category.name] &&
              artistsByCategory[category.name].length > 0
          )
          .map((category, index) => (
            <section key={category._id} className="artSection" id="musicians">
              <div className="div mb-2 ">
                <h2 className="artCat">{category.name}</h2>

                <hr></hr>
              </div>
              {showArrows[index]?.left && (
                <button
                  className="arrow left react-multiple-carousel__arrow"
                  onClick={() => scrollCarousel(-1, index)} // Scroll left
                >
                  <BsChevronCompactLeft />
                </button>
              )}
              <div
                className="artistCarousel px-3 mb-2"
                ref={(el) => (carouselRefs.current[index] = el)}
                style={{
                  display: "flex",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                {artistsByCategory[category.name]?.map((artist) => (
                  <div
                    key={artist._id}
                    className="artistImage"
                    style={{
                      flex: "0 0 16.67%",
                      boxSizing: "border-box",
                      padding: "0 5px",
                    }}
                    onClick={(event) => handleClick(artist, event)}
                  >
                    <div className="artistImage">
                      {artist.imageUrl && (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${artist.imageUrl}`}
                          alt={artist.title}
                          width="100%"
                        />
                      )}
                      <div className="artContent">
                        <h4 className="artTitle">{artist.title}</h4>
                      </div>
                    </div>

                    {/* Add heart icon here */}
                    <div className="favoriteIcon">
                      <button
                        onClick={(event) => {
                          event.stopPropagation(); // Prevent the click event from bubbling up
                          toggleFavorite(artist);
                        }}
                      >
                        {isFavorite(artist) ? (
                          <BsHeartFill className="favorited" />
                        ) : (
                          <BsHeartFill className="heartIcon" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {showArrows[index]?.right && (
                <button
                  className="arrow right react-multiple-carousel__arrow"
                  onClick={() => scrollCarousel(1, index)} // Scroll right
                >
                  <BsChevronCompactRight />
                </button>
              )}
            </section>
          ))}
      </div>
    </div>
  );
};

export default Musicians;
