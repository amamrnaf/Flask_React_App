import React, { useState, useEffect } from "react";
import axios from "axios";

import { Header } from "../components";

const CreateReclamation = () => {
  const [reclamationData, setReclamationData] = useState({
    date: '',
    client: '',
    object: '',
    desc: '',
    deadline: '',
    organisation: '',
    file: null, // Initialize file property
  });

  const [suggestedClients, setSuggestedClients] = useState([]);
  const [orgData,setOrgData]=useState([]);
  const [clData,setClData]=useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReclamationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    console.log('Selected Files:', selectedFiles); // Add this line for debugging
    setReclamationData((prevData) => ({
      ...prevData,
      file: selectedFiles,
    }));
  };  

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log('Selected Files:', reclamationData.file);

    const formData = new FormData();
    formData.append('date', reclamationData.date);
    formData.append('client', reclamationData.client);
    formData.append('object', reclamationData.object);
    formData.append('desc', reclamationData.desc);
    formData.append('deadline', reclamationData.deadline);
    formData.append('organisation', reclamationData.organisation);

    if (reclamationData.file) {
      if (Array.isArray(reclamationData.file)) {
        for (let i = 0; i < reclamationData.file.length; i++) {
          formData.append('file', reclamationData.file[i]);
        }
      } else {
        formData.append('file', reclamationData.file);
      }
    }

    console.log('FormData:', formData);

    axios
      .post("http://127.0.0.1:5000/crud/newreclamations", formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      })
      .then((response) => {
        console.log('Reclamation created successfully', response.data);
        console.log(formData)

        // Reset the form data, including the file
        setReclamationData({
          date: '',
          client: '',
          object: '',
          desc: '',
          deadline: '',
          organisation: '',
          file: null,
        });
      })
      .catch((error) => {
        console.error('Error creating reclamation!!!!', error.response);
      });
  };
  
  useEffect(() => {

    axios.get("http://127.0.0.1:5000/crud/organization-names")
      .then(response => {
        setOrgData(response.data);
      })
      .catch(error => {
        console.error("Error fetching organization names", error);
      })
      axios.get("http://127.0.0.1:5000/crud/client-names")
      .then(response => {
        setClData(response.data);
      })
      .catch(error => {
        console.error("Error fetching organization names", error);
      })
  },[]);

const handleClientSearch = (value) => {
  // Filter client names based on user input
  const filteredClients = clData.filter(client => client.toLowerCase().includes(value.toLowerCase()));
  setSuggestedClients(filteredClients);
};

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header category="Page" title="Create Reclamation" />
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={reclamationData.date}
          onChange={handleChange}
        />
      </div>
      <div>
          <label>Client:</label>
          <input
            type="text"
            name="client"
            value={reclamationData.client}
            onChange={(e) => {
              handleChange(e);
              handleClientSearch(e.target.value);
            }}
          />
          {suggestedClients.length > 0 && (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderTop: "none",
                maxHeight: "150px",
                overflowY: "auto",
                position: "absolute",
                width: "30%",
                zIndex: 999,
              }}
            >
              {suggestedClients.map((client) => (
                <li
                  key={client}
                  onClick={() => {
                    setReclamationData((prevData) => ({
                      ...prevData,
                      client,
                    }));
                    setSuggestedClients([]);
                  }}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                >
                  {client}
                </li>
              ))}
            </ul>
          )}
        </div>
      <div>
        <label>Object:</label>
        <textarea
        name="object"
        value={reclamationData.object}
        onChange={handleChange}
        rows="4" // Adjust the number of rows as needed
        className="w-full px-3 py-2 border rounded"
      />
      </div>
      <div>
      <label>Description:</label>
      <textarea
        name="desc"
        value={reclamationData.desc}
        onChange={handleChange}
        rows="4" // Adjust the number of rows as needed
        className="w-full px-3 py-2 border rounded"
      />
      </div>
      <div>
        <label>Deadline:</label>
        <input
          type="date"
          name="deadline"
          value={reclamationData.deadline}
          onChange={handleChange}
        />
      </div>
      <div>
      <label>Entitee responsable:</label>
      <select
        name="organisation"  
        value={reclamationData.organisation}
        onChange={handleChange}  
      >
        <option value="">Select an entity</option>
        {orgData.map(org => (
          <option key={org} value={org}>{org}</option>
        ))}
      </select>
      </div>
      <div>
    <label>Upload File (PDF or Image):</label>
    <input
      type="file"
      name="file"
      accept=".pdf, .jpg, .jpeg, .png"
      onChange={handleFileChange}
      multiple
    />
    {reclamationData.file && (
      <p>Selected File: {reclamationData.file.name}</p>
    )}
    </div>
      

      <div className="col-span-2">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Reclamation
        </button>
      </div>
    </form>
  </div>
  );
};

export default CreateReclamation;
