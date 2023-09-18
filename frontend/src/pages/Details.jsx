import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../App.css"; 

import { Header } from "../components";

const Details = () => {
  const { id } = useParams();
  const [reclamationData, setReclamationData] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);
  const [actionInput, setActionInput] = useState("");
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.get(`http://127.0.0.1:5000/auth/rights`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        
        setHasPermission(response.data.allowed);
        
      })
      .catch((error) => {
        console.error("Error fetching permission:", error);
      });


    axios.get(`http://127.0.0.1:5000/crud/actions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        setActions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching actions:", error);
      });

    axios.get(`http://127.0.0.1:5000/crud/reclamations/${id}`)
      .then((response) => {
        setReclamationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reclamation details:", error);
      });
  }, [id]);

  const handleChangeStatus = () => {
    const confirmed = window.confirm("Are you sure you want to change the status to Finished? This action cannot be undone.");
    if (confirmed) {
      // User confirmed, make Axios request to update status
      const token = sessionStorage.getItem("token");
      axios
        .put(
          `http://127.0.0.1:5000/crud/update/${id}`,
          { status: "Finished" }, // Set the new status here
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          
          alert("Status Changed! The status has been changed to Finished.",response);
          
        })
        .catch((error) => {
          console.error("Error changing status:", error);
        });
    }
  };

  const handleChangeActionInput = (e) => {
    setActionInput(e.target.value);
  };

  const postAction = () => {
    // Check if actionInput is not empty
    if (actionInput.trim() !== "") {
      // Create an object with the action data
      const newAction = {
        Action: actionInput,
        reclamation_id: parseInt(id, 10),
      };
       

      // Send a POST request to your server to add the action
      const token = sessionStorage.getItem("token");
      axios
        .post(
          `http://127.0.0.1:5000/crud/new_action`, // Adjust the endpoint URL
          newAction,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // Handle success, you can show a success message or update the UI as needed
          console.log("Action added:", response.data);
        })
        .catch((error) => {
          console.error("Error adding action:", error);
        });

      // Clear the action input field
      setActionInput("");
    }
  };
  

  if (!reclamationData) {
    return <div>Loading...</div>;
  }

  const isStatusFinished = reclamationData.status === "Finished" ;

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Reclamation Details" />

      <div className="mb-4">
        <h2 className="text-xl font-semibold">reclamation id : {reclamationData.id}</h2>
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
      <strong>actions:</strong>
      <ul>
          {actions.map((action, index) => (
            <li key={index}>- {action}</li>
          ))}
      </ul>
      </div>
      <div>
      <h3>Joints:</h3>
      {reclamationData.files && (
  <ul>
    {reclamationData.files.map((fileUrl, index) => (
      <li key={index}>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        </a>
        {fileUrl.toLowerCase().match(/\.(jpeg|jpg|png|gif)$/) && (
          <img src={fileUrl} alt={fileUrl.split('/').slice(-1)} className="fixed-size-image" /> 
        )}
      </li>
    ))}
  </ul>
)}

      
      </div>
      {!hasPermission ? (
        <div>
          <h3>Actions:</h3>
          <textarea 
          type="text" rows="8" cols="90" 
          style={{ border: "1px solid #007bff" }} 
          placeholder="Enter an action" 
          onChange={handleChangeActionInput}
          value={actionInput}
          /><br></br>
          <button onClick={postAction} className="change-status-button">Post Action</button>
        </div>
      ) : !isStatusFinished && (
        <div>
          <button onClick={handleChangeStatus} className="change-status-button" >Change Status</button>
        </div>
      )}
    </div>
  );
};

export default Details;
