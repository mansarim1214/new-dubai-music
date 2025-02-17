import React, { useState, useEffect, Suspense } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/View/Navbar";
import Footer from "./components/View/Footer";
import ComingSoon from "./components/View/ComingSoon";
import { AuthProvider } from "./context/AuthContext";
import LoadingBar from "react-top-loading-bar";
import "./App.css";
import "./index.css";

// Lazy-loaded components
const Musicians = React.lazy(() => import("./components/View/Musicians"));
const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));
const ArtistDetail = React.lazy(() => import("./components/View/ArtistDetail"));
const Favorites = React.lazy(() => import("./components/View/Favorites"));
const Venues = React.lazy(() => import("./components/View/Venues"));
const VenueDetail = React.lazy(() => import("./components/View/VenueDetail"));
const Unauthorized = React.lazy(() => import("./components/Dashboard/Unauthorized"));
const Jobs = React.lazy(() => import("./components/View/Jobs"));
const About = React.lazy(() => import("./components/View/About"));
const Login = React.lazy(() => import("./components/Dashboard/Login"));
const MusicStore = React.lazy(() => import("./components/View/MusicStore"));
const StoreDetail = React.lazy(() => import("./components/View/StoreDetail"));
const WeddingVIP = React.lazy(() => import("./components/View/WeddingVIP"));
const WeddingVIPDetail = React.lazy(() => import("./components/View/WeddingVipDetail"));

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [progress, setProgress] = useState(0); // State for the loading bar progress
  const [isLoading, setIsLoading] = useState(false); // State for managing global loading

  const noHeaderFooterRoutes = [];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  // Handle navigation and loading bar
  const handleNavigate = (url) => {
    setProgress(30); // Start loading
    setIsLoading(true); // Show the loader

    setTimeout(() => {
      setProgress(100); // Finish loading
      navigate(url); // Perform navigation
      setIsLoading(false); // Hide the loader
    }, 500); // Adjust timeout as needed
  };

  // Trigger loading bar on page load or reload
  useEffect(() => {
    setProgress(30);
    setTimeout(() => {
      setProgress(100);
    }, 500); // Simulate loading completion
  }, [location.pathname]); // Run whenever the path changes (includes reloads)

  return (
    <AuthProvider>
      <div className="App">
        {/* Top Loading Bar */}
        <LoadingBar
          color="#a96fff"
          progress={progress}
          height={5}
          onLoaderFinished={() => setProgress(0)} // Reset progress
        />

        {/* Navbar */}
        {showHeaderFooter && <Navbar />}

        {/* Content */}
        <Suspense fallback={<div></div>}>
       
          <div className="content">
            <Routes>
              <Route path="/" element={<Venues onNavigate={handleNavigate} />} />
              <Route path="/musicians" element={<Musicians onNavigate={handleNavigate} />} />
              {/* <Route path="/comingsoon" element={<ComingSoon onNavigate={handleNavigate} />} /> */}
              <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
              <Route path="/db-sarim-shehran1214" element={<Dashboard onNavigate={handleNavigate} />} />
              <Route path="/unauthorized" element={<Unauthorized onNavigate={handleNavigate} />} />
              <Route path="/artist/:id" element={<ArtistDetail onNavigate={handleNavigate} />} />
              <Route path="/favorites" element={<Favorites onNavigate={handleNavigate} />} />
              <Route path="/venues" element={<Venues onNavigate={handleNavigate} />} />
              <Route path="/wedding-vip-packages" element={<WeddingVIP onNavigate={handleNavigate} />} />
              <Route path="/venuedetail/:id" element={<VenueDetail onNavigate={handleNavigate} />} />
              <Route path="/music-store/:id" element={<StoreDetail onNavigate={handleNavigate} />} />
              <Route path="/wedding-vip-packages/:id" element={<WeddingVIPDetail onNavigate={handleNavigate} />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/about" element={<About onNavigate={handleNavigate} />} />
              <Route path="/music-store" element={<MusicStore onNavigate={handleNavigate} />} />
            </Routes>
          </div>
         
        </Suspense>

        {/* Footer */}
        {showHeaderFooter && <Footer />}
      </div>
    </AuthProvider>
  );
};

export default App;
