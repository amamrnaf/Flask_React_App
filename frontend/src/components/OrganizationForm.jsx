// OrganizationForm.js
import React, { useState } from "react";
import axios from "axios"; 

const OrganizationForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [mail, setMail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an organization object
    const newOrganization = {
      name,
      adresse,
      mail,
      phone_number: phoneNumber,
    };

    // Send a POST request to create the organization
    const token = sessionStorage.getItem("token");
    axios
      .post("http://127.0.0.1:5000/admin/create_organisations", newOrganization, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Handle success, you can show a success message or update the UI as needed
        console.log("Organization created:", response.data);
        // Reset the form fields
        setName("");
        setAdresse("");
        setMail("");
        setPhoneNumber("");
      })
      .catch((error) => {
        console.error("Error creating organization:", error);
      });
  };

  return (
    <div>
      <h2>Create Organization</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Adresse:</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </div>
        <div>
          <label>Mail:</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default OrganizationForm;
