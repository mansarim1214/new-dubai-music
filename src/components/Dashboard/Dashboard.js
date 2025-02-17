import React, { useState } from "react";
// import { useAuth } from '../../context/AuthContext';
import "./Dashboard.css";
import { AddArtistForm, AddCategoryForm } from "./addForms"; // Adjust the import path as needed
import ViewArtists from "./ViewArtists";
import AddVenue from "./AddVenue";
import ManageVenue from "./ManageVenue";
import {Link}  from "react-router-dom";
import AddMusicStore from "./AddMusicStore";
import ManageMusicStore from "./ManageStore";
import ManageWeddingVip from "./ManageWeddingVip";
import AddWeddingVip from "./AddWeddingVip";




const Dashboard = () => {

  // const { user } = useAuth();

  const [selectedComponent, setSelectedComponent] = useState("addArtist");
  const handleComponentSelect = (componentName) => {
    setSelectedComponent(componentName);
  };

 

  return (
    <div className="container-fluid dashboard">
      <div className="row">
        <div className="col-md-2">
          <nav className="d-none d-md-block bg-black sidebar">
          <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <div className="accordion" id="accordionArtists">
                    <div className="accordion-item">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseArtists"
                        aria-expanded="true"
                        aria-controls="collapseArtists"
                      >
                        Artists
                      </button>

                      <div
                        id="collapseArtists"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionArtists"
                      >
                        <div className="accordion-body">
                          <Link
                          
                            className="nav-link"
                            onClick={() => handleComponentSelect("addArtist")}
                          >
                            Add Artist
                          </Link>
                          <Link
                          
                            className="nav-link"
                            onClick={() => handleComponentSelect("editArtist")}
                          >
                            Manage Artists
                          </Link>

                          <Link
                          
                            className="nav-link"
                            onClick={() => handleComponentSelect("addCategory")}
                          >
                            Artist Categories
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="accordion" id="accordionVenues">
                    <div className="accordion-item">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseVenues"
                        aria-expanded="true"
                        aria-controls="collapseVenues"
                      >
                        Venues
                      </button>

                      <div
                        id="collapseVenues"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionVenues"
                      >
                        <div className="accordion-body">
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("addVenue")}
                          >
                            Add Venue
                          </Link>
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("manageVenue")}
                          >
                            Manage Venues
                          </Link>

                         
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="accordion" id="accordionWedding">
                    <div className="accordion-item">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseWedding"
                        aria-expanded="true"
                        aria-controls="collapseWedding"
                      >
                        Wedding-VIP
                      </button>

                      <div
                        id="collapseWedding"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingTwo"
                        data-bs-parent="#accordionWedding"
                      >
                        <div className="accordion-body">
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("addWeddingVip")}
                          >
                            Add Wedding-VIP
                          </Link>
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("manageWeddingVip")}
                          >
                            Manage Wedding-VIP
                          </Link>

                         
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="nav-item">
                  <div className="accordion" id="accordionStore">
                    <div className="accordion-item">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseStore"
                        aria-expanded="true"
                        aria-controls="collapseStore"
                      >
                        Music Store
                      </button>

                      <div
                        id="collapseStore"
                        className="accordion-collapse collapse"
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionStore"
                      >
                        <div className="accordion-body">
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("addStore")}
                          >
                            Add Store
                          </Link>
                          <Link
                            className="nav-link"
                            onClick={() => handleComponentSelect("manageMusicStore")}
                          >
                            Manage Stores
                          </Link>

                         
                        </div>
                      </div>
                    </div>
                  </div>
                </li>


                {/* Add more links as needed */}
              </ul>
            </div>
          </nav>
        </div>

        <div className="col-md-10">
          <main role="main" className="ml-sm-auto p-4">
            {selectedComponent === "addArtist" && <AddArtistForm />}
            {selectedComponent === "addCategory" && <AddCategoryForm />}
            {selectedComponent === "editArtist" && <ViewArtists />}
            {selectedComponent === "addVenue" && <AddVenue />}
            {selectedComponent === "addWeddingVip" && <AddWeddingVip />}
            {selectedComponent === "manageVenue" && <ManageVenue />}
            {selectedComponent === "addStore" && <AddMusicStore />}
            {selectedComponent === "manageMusicStore" && <ManageMusicStore />}
            {selectedComponent === "manageWeddingVip" && <ManageWeddingVip/>}

          </main>
        </div>
      </div>
    </div>
  );


};



export default Dashboard;
