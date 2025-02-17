import React, { useEffect, useState } from "react";
import axios from "axios";
import "./frontend.css";

const MusicStore = ({ onNavigate }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/musicstore`
        );

        // Filter only published stores
        const publishedStores = response.data.filter(
          (store) => store.status === "published"
        );

        setStores(publishedStores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch stores. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleClick = (store) => {
    if (onNavigate) {
      onNavigate(`/music-store/${store._id}`);
    }
  };

 
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="bg-custom">
      <h2 className="my-2 fav-title">Music Stores</h2>
      <div className="container-fluid">
        <div className="storeGrid">
          {stores.map((store) => (
            <div
              key={store._id}
              className="storeCard"
              style={{
                textAlign: "center",
                padding: "10px",
              }}
              onClick={() => handleClick(store)} 
            >
              <div className="storeImage">
                <img
                  src={
                    store.featuredImage
                      ? `${process.env.REACT_APP_API_URL}/${store.featuredImage}`
                      : "/placeholder.png"
                  }
                  alt={store.name}
                  width="100%"
                  loading="lazy"
                />
                <div className="storeContent">
                  <h4 className="artTitle">{store.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicStore;
