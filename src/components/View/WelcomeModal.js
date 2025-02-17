import React, { useEffect, useState } from "react";
import "./frontend.css"; // Ensure to import your CSS for styling

const WelcomeModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to create a cookie
  const createCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  // Function to get a cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return "";
  };

  useEffect(() => {
    // Check if the cookie exists and show the modal after 3 seconds
    if (getCookie("loadPopup") === "") {
      const timer = setTimeout(() => {
        setIsModalVisible(true);
        createCookie("loadPopup", true, 1); 
      }, 4000);

      // Cleanup timer on unmount
      return () => clearTimeout(timer);
    }
  }, []);

  // Function to close the modal
  const handleClose = () => {
    setIsModalVisible(false);

    
  };

  return (
    <>
      {isModalVisible && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myLargeModalLabel"
          id="WelcomeModal"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content welcomemodal text-center">
              <div className="modal-header p-0 ">
                
            
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body py-0">

              <div className="tex-center">
                <img
                  src="/dubai-music-white-logo.webp"
                  className="d-inline-block align-top"
                  alt="Logo"
                  width="200px"
                />
                </div>
                
                <h4 className="text-center py-4">Connecting you to the best live music,<br/> seven days a week</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeModal;
