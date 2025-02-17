import React, { useState } from "react";
import emailjs from "emailjs-com";


const InstantBookModal = () => {

  const [formData, setFormData] = useState({ from_name: "", phone_number: "", event_vision: "" });
  const [formMessage, setFormMessage] = useState("");
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      from_name: formData.from_name,
      phone_number: formData.phone_number,
      event_vision: formData.event_vision,
    };

    emailjs
      .send(
        "service_3hkljmf",
        "template_xzx8xzx",
        templateParams,
        "q1l_DC7jwQvu80xJ5"
      )
      .then((response) => {
        setFormMessage("Booking request sent successfully!");
        setFormData({ from_name: "", phone_number: "", event_vision: "" });
      })
      .catch((error) => {
        setFormMessage("Failed to send booking request. Please try again.");
        console.error("Error sending booking request:", error);
      });
  };
  
  return (
<div className="modal fade" id="instantBookModal" tabIndex="-1" aria-labelledby="instantBookLabel" aria-hidden="true" >
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header p-0">
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <h4 className="modal-title text-center" id="instantBookLabel" >Instant Book</h4>
      <p className="text-center" style={{color: "#8e56e3"}}>11am - 5pm (Mon - Fri)</p>
      <h5 className="text-center mt-3">Instant Book, instant response. We’ll be in touch within the next few minutes.</h5>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="from_name" value={formData.from_name}
                    onChange={handleChange}/>
            </div>
            <div className="col-md-6">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" className="form-control" id="phone_number" value={formData.phone_number}
                    onChange={handleChange}/>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="eventVision" className="form-label">Share your event vision</label>
            <textarea className="form-control" id="event_vision" rows="3" value={formData.event_vision}
                    onChange={handleChange}></textarea>
          </div>
        </form>
        {formMessage && <p className="form-message">{formMessage}</p>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn instant-btn" data-bs-dismiss="modal">Confirm Booking</button>
      </div>
    </div>
  </div>
</div>

  );
};

export default InstantBookModal;
