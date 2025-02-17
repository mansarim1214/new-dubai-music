import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Link } from "react-router-dom";
import { BsChevronCompactRight, BsChevronCompactLeft } from "react-icons/bs";

gsap.registerPlugin(Draggable);

const WeddingVIP = ({ onNavigate }) => {
  const [weddingVIPItems, setWeddingVIPItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRefs = useRef([]);

  const isMobile = () => window.innerWidth <= 500;

  // Fetch Wedding VIP items with filter for published status
  useEffect(() => {
    const fetchWeddingVIPItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/weddingvip`
        );
        
        // Filter only published items
        const publishedItems = response.data.filter(item => item.isPublished === 'published');
        
        setWeddingVIPItems(publishedItems);
      } catch (error) {
        console.error("Error fetching wedding VIP items:", error);
        setError("Failed to fetch Wedding VIP items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeddingVIPItems();
  }, []);

  // Shuffle items if necessary
  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  // Function to group items by category
  const groupItemsByCategory = () => {
    const groupedItems = {};

    weddingVIPItems.forEach((item) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item);
    });

    const shuffledGroupedItems = {};
    Object.keys(groupedItems).forEach((category) => {
      shuffledGroupedItems[category] = shuffleArray(groupedItems[category]);
    });

    return shuffledGroupedItems;
  };

  // Get grouped wedding VIP items
  const groupedWeddingVIPItems = groupItemsByCategory();

  // Carousel scroll functionality
  const scrollCarousel = (direction, index) => {
    const carousel = carouselRefs.current[index];
    if (carousel) {
      const item = carousel.querySelector(".venueImage");
      if (!item) {
        console.error("No items found in carousel");
        return;
      }

      const itemWidth = item.clientWidth;
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

  // Enable dragging on mobile
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
  }, [groupedWeddingVIPItems]);

  const handleClick = (item) => {
    if (onNavigate) {
      onNavigate(`/wedding-vip-packages/${item._id}`);
    }
  };

  

  return (
    <div className="bg-custom">
      <div className="container-fluid p-0">
        {Object.keys(groupedWeddingVIPItems).map((category, index) => {
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
                    {groupedWeddingVIPItems[category].map((item) => (
                      <div
                        key={item._id}
                        className="venueImage"
                        style={{ flex: "0 0 16.67%", padding: "0 5px" }}
                        onClick={() => handleClick(item)}
                      >
                        <div className="artistImage">
                          {item.imageUrl && (
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${item.imageUrl}`}
                              alt={item.title}
                              width="100%"
                              loading="lazy"
                            />
                          )}
                          <div className="artContent">
                            <h4 className="artTitle">{item.title}</h4>
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

export default WeddingVIP;
