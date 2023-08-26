import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { Header } from "../components";

const Details = () => {
  const { id } = useParams();
  const [reclamationData, setReclamationData] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch reclamation details by ID
    axios.get(`http://127.0.0.1:5000/crud/reclamations/${id}`)
      .then((response) => {
        setReclamationData(response.data);
        console.log(reclamationData.files)
      })
      .catch((error) => {
        console.error("Error fetching reclamation details:", error);
      });

    // Fetch files related to the reclamation
    
  }, [id]);

  if (!reclamationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Reclamation Details" />

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Reclamation Details</h2>
        <div>
          <strong>Date:</strong> {reclamationData.date}
        </div>
        <div>
          <strong>Client:</strong> {reclamationData.client_name}
        </div>
        <div>
          <strong>Object:</strong> {reclamationData.object}
        </div>
        <div>
          <strong>Description:</strong> {reclamationData.desc}
        </div>
        <div>
          <strong>Deadline:</strong> {reclamationData.deadline}
        </div>
        <div>
          <strong>Status:</strong> {reclamationData.status}
        </div>
      </div>

      <div>
      <h3>Files:</h3>
          {reclamationData.files && (
            <ul>
              {reclamationData.files.map((file, index) => (
                <li key={index}>
                  <a href={file.path} target="_blank" rel="noopener noreferrer">
                    {file.filename}
                  </a>
                  {file.filename.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/) && (
                   <img src={file.path} alt={file.filename} />
              )}  
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default Details;
