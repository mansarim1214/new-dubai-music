// import React, { useState, useEffect } from "react";
// import axios from "axios";
import "./frontend.css";

const Jobs = () => {
  // const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   // Fetch jobs data from an API
  //   axios
  //     .get(`${process.env.REACT_APP_API_URL}/jobs`)
  //     .then((response) => {
  //       setJobs(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the jobs!", error);
  //     });
  // }, []);

  return (
    <div className=" bg-custom">
      <div className="container">
        {/* <h1 style={{ fontFamily: "cursive" }}>Stay tuned!</h1> */}
        <h5 style={{ fontFamily: "system-ui" }}>
          Looking for talent or searching for your next music gig in Dubai? Our
          Jobs section connects you with the latest opportunities in the music
          scene. Whether you’re hiring or looking to be hired, discover all
          things music-related right here.
        </h5>
      </div>
    </div>
  );
};

export default Jobs;
