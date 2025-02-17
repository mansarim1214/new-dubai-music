import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const About = () => {
  const logoContainerRef = useRef(null);

  useEffect(() => {
    const container = logoContainerRef.current;
    const clone = container.innerHTML; // Clone the logos
    container.innerHTML += clone; // Append the cloned logos for infinite scrolling

    const calculateDuration = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) return 35; // Faster for smaller screens
      if (screenWidth < 1200) return 15; // Moderate speed for medium screens
      return 10; // Slower for larger screens
    };

    const animation = gsap.to(container, {
      x: "-100%", // Scroll to the end of the first set of logos
      ease: "linear",
      repeat: -1,
      duration: calculateDuration(), // Adjust speed based on screen size
    });

    const resizeHandler = () => {
      animation.duration(calculateDuration()); // Update duration on screen resize
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      animation.kill(); // Cleanup animation
      window.removeEventListener("resize", resizeHandler); // Cleanup event listener
    };
  }, []);

  return (
    <div className="bg-custom about-us">
      <div className="container pt-5">
        <div className="text-white d-flex">
          <div className="col-md-12">
            <div>
              <h2>ABOUT DUBAI MUSIC</h2>
              <h1>DISCOVER AND BOOK LIVE MUSIC IN A CLICK.</h1>


              <div className="row pt-5">
                <div className="col-md-7"> 
                  <h3>MISSION</h3>
                  <p>
                  At Dubai Music, we connect tourists, residents,
and music lovers to the best live music
venues, 7 days a week.
              </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-6"> 
                  
                  <p>
                Whether you’re looking to discover incredible
performances or hire live musicians for a wedding, hotel, or
venue, we’re here to make it happen. We offer personalized
live music solutions that are tailored to create the perfect
atmosphere for any event or location.
              </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Logo Carousel Section */}
        <div className="logo-carousel">
        <h4>Our Customers</h4>
          <div
            className="logo-container d-flex align-items-center mt-5"
            ref={logoContainerRef}
          >
            <img src="/logos/1.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/2.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/3.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/4.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/5.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/6.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/7.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/8.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/9.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/10.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/11.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/12.webp" alt="Logo 1" className="logo mx-3" />
            <img src="/logos/13.webp" alt="Logo 1" className="logo mx-3" />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
