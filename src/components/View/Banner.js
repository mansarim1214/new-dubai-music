import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import './frontend.css'; // Import CSS file

const Banner = () => {
  const slides = [
    {
      src: '/banner2.webp',
      alt: 'Banner for Venues',
      text: 'Discover Live Music Venues',
      button: 'Explore Venues',
      url: '/venues',
      class: 'center',
    },
    {
      src: '/banner3.webp',
      alt: 'Banner for Music Stores',
      text: 'Shop at Top Music Stores',
      button: 'Checkout Stores',
      url: '/music-store',
    },
    {
      src: '/banner1.webp',
      alt: 'Banner for Musicians',
      text: 'Explore Dubai’s Top Musicians',
      button: 'Explore Now',
      url: '/musicians',
    },
    {
      src: '/coca-cola-arena.webp',
      alt: 'Banner for coca cola arena',
      text: 'Experience Thrilling Events at Coca-Cola Arena',
      button: 'Explore Now',
      url: 'https://www.coca-cola-arena.com/',
    },
    {
      src: '/dubai-opera.webp',
      alt: 'Banner for dubai opera',
      text: 'Discover World-Class Performances at Dubai Opera',
      button: 'View Shows',
      url: 'https://www.dubaiopera.com/en-US/products-list',
    },
    {
      src: '/guitar-store.webp',
      alt: 'Art of Guitar',
      text: 'Art of Guitar',
      button: 'View Store',
      url: '/music-store/67afa3372272627033bafded',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef();

  // GSAP Animation
  const animateSlide = (index) => {
    const xOffset = `-${index * 100}%`;
    gsap.to(carouselRef.current, {
      x: xOffset,
      duration: 2,
      ease: 'power2.inOut',
    });
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Next Slide
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(nextIndex);
    animateSlide(nextIndex);
  };

  // Previous Slide
  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    setCurrentIndex(prevIndex);
    animateSlide(prevIndex);
  };

  // Handle Dot Clicks
  const handleDotClick = (index) => {
    setCurrentIndex(index);
    animateSlide(index);
  };

  return (
    <div className="carousel-container">
      <button className="carousel-arrow prev" onClick={handlePrev}>&#10094;</button>
      <div className="carousel-track" ref={carouselRef}>
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img src={slide.src} alt={slide.alt} className={slide.class} />
            <h1 className="carousel-text">{slide.text}</h1>
            <a href={slide.url} className="carousel-btn enquirybtn">
              {slide.button}
            </a>
          </div>
        ))}
      </div>
      <button className="carousel-arrow next" onClick={handleNext}>&#10095;</button>
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => handleDotClick(index)}
            className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
          ></span>
        ))}
      </div>
      <style jsx>{`
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          cursor: pointer;
          font-size: 24px;
          padding: 10px;
          z-index: 10;
        }

        @media only screen and (max-width: 500px) {
.carousel-arrow{
    font-size: 14px;
    padding: 6px;
}

      }
        .prev {
          left: 10px;
        }

        .next {
          right: 10px;
        }
      `}</style>
    </div>
  );
};

export default Banner;
