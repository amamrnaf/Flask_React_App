import React, { useState } from "react";
import axios from "axios";

const CreateClientForm = () => {
  const [clientData, setClientData] = useState({
    nom: "",
    infos: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientData({ ...clientData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/admin/create_clients", clientData)
      .then((response) => {
        alert("Client created successfully!",response);
        // Optionally, you can redirect to a different page after successful creation.
      })
      .catch((error) => {
        console.error("Error creating client:", error);
      });
  };

  return (
    <div>
      <h2>Create Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="nom"
            value={clientData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Infos:</label>
          <textarea
            name="infos"
            value={clientData.infos}
            onChange={handleChange}
            
          />
        </div>
        <div>
          <button type="submit">Create Client</button>
        </div>
      </form>
    </div>
  );
};

export default CreateClientForm;
