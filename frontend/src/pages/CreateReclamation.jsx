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
    files: null, // Initialize file property
  });
  const [hasPermission, setHasPermission] = useState(false);
  const [suggestedClients, setSuggestedClients] = useState([]);
  const [orgData,setOrgData]= useState([]);
  const [clData,setClData]= useState([]);
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReclamationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files; // Get the first selected file
    console.log('Selected Files:', selectedFiles); // Add this line for debugging
  
    setReclamationData((prevData) => ({
      ...prevData,
      files: selectedFiles, // Use selectedFile here
    }));
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = sessionStorage.getItem("token");
    
    console.log('Files:', reclamationData.files);

    const formData = new FormData();
    formData.append('date', reclamationData.date);
    formData.append('client', reclamationData.client);
    formData.append('object', reclamationData.object);
    formData.append('desc', reclamationData.desc);
    formData.append('deadline', reclamationData.deadline);
    formData.append('organisation', reclamationData.organisation);
    console.log(reclamationData.files.length);
    for (let i = 0; i < reclamationData.files.length; i++) {
      formData.append(`file${i}`, reclamationData.files[i]);
    }

    console.log('reclamationData:',reclamationData);

    axios
      .post("http://127.0.0.1:5000/crud/newreclamations", formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((response) => {
        console.log('Backend response :', response.data);
        console.log('formdata :',formData)

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
    const token = sessionStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get(`http://127.0.0.1:5000/auth/rights`,config)
      .then((response) => {
        console.log(response.data.allowed);
        setHasPermission(response.data.allowed);
        
      })
      .catch((error) => {
        console.error("Error fetching permission:", error);
      });
    axios.get("http://127.0.0.1:5000/crud/organization-names",config)
      .then(response => {
        setOrgData(response.data);
      })
      .catch(error => {
        console.error("Error fetching organization names", error);
      })

    axios.get("http://127.0.0.1:5000/crud/client-names",config)
      .then(response => {
        setClData(response.data);
      })
      .catch(error => {
        console.error("Error fetching client names", error);
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
    <label>Upload Files (PDF or Image):</label>
    <input
      type="file"
      name="file" // Ensure this is "file"
      accept=".pdf, .jpg, .jpeg, .png"
      onChange={handleFileChange}
      multiple
    />
    </div>
      
    {hasPermission ? (
  <div className="col-span-2">
    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
      Create Reclamation
    </button>
  </div>
) : (
  <div className="col-span-2">
    <p>You do not have permission to create a new reclamation.</p>
  </div>
)}
    </form>
  </div>
  );
};

export default CreateReclamation;
