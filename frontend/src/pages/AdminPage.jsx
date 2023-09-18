import React, { useState, useEffect } from "react";
import axios from "axios";
import "../admin.css"
import { Header,OrganizationForm,CreateClientForm,CreateUserForm } from "../components";




const AdminPage = () => {
    const [selectedTable, setSelectedTable] = useState("organisations");
    const [data, setData] = useState([]);
    const [showCreateClientForm, setShowCreateClientForm] = useState(false);
    const [showCreateUserForm, setShowCreateUserForm] = useState(false);
    const [showCreateOrganizationForm, setShowCreateOrganizationForm] = useState(false);


    const axiosConfig = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:5000/admin/${selectedTable}`, axiosConfig);
            setData(response.data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [selectedTable]);

      const handleDelete = (id) => {
        // Confirm with the user before proceeding with the delete
        const confirmed = window.confirm("Are you sure you want to delete this record?");
      
        if (confirmed) {

            let endpoint = "";

            switch (selectedTable) {
              case "organisations":
                endpoint = `http://127.0.0.1:5000/admin/delete_organisations/${id}`;
                break;
              case "users":
                endpoint = `http://127.0.0.1:5000/admin/delete_users/${id}`;
                break;
              case "clients":
                endpoint = `http://127.0.0.1:5000/admin/delete_clients/${id}`;
                break;
              case "reclamations":
                endpoint = `http://127.0.0.1:5000/admin/delete_reclamations/${id}`;
                break;
              // Add cases for other tables as needed
              default:
                break;
            }

            if (endpoint) {
                // Send a DELETE request to the server to delete the record
                const token = sessionStorage.getItem("token");
                axios
                  .delete(endpoint, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    // Handle success, you can show a success message or update the UI as needed
                    console.log("Record deleted:", response.data);
          
        
                  })
                  .catch((error) => {
                    console.error("Error deleting record:", error);
                  });
              }
        }
      };

      const handleShowCreateForm = (formType) => {
        switch (formType) {
          case "clients":
            setShowCreateClientForm(true);
            setShowCreateUserForm(false);
            setShowCreateOrganizationForm(false);
            break;
          case "user":
            setShowCreateClientForm(false);
            setShowCreateUserForm(true);
            setShowCreateOrganizationForm(false);
            break;
          case "organization":
            setShowCreateClientForm(false);
            setShowCreateUserForm(false);
            setShowCreateOrganizationForm(true);
            break;
          default:
            // Hide all forms if an invalid formType is provided
            setShowCreateClientForm(false);
            setShowCreateUserForm(false);
            setShowCreateOrganizationForm(false);
            break;
        }
      };





return (
    <div className="container">
      <Header category="view tables" title="select a table:" />
      <select
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
        <option value="organisations">Organisations</option>
        <option value="users">Users</option>
        <option value="reclamations">Reclamations</option>
        <option value="clients">Clients</option>
        {/* Add options for other tables */}
      </select>

      <div className="grid-container">
        {selectedTable === "organisations" && (
            <>
          <table className="grid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Adresse</th>
                <th>Mail</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((org) => (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{org.adresse}</td>
                  <td>{org.mail}</td>
                  <td>{org.phone_number}</td>
                  <td>
                    <button onClick={() => handleDelete(org.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleShowCreateForm("organization")}>Create Organization</button>
          {showCreateOrganizationForm && <OrganizationForm />}
          </>
        )}

        {selectedTable === "users" && (
            <>
            <table className="grid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Family Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.family_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleShowCreateForm("user")}>Create User</button>
          {showCreateUserForm && <CreateUserForm />}
          </>
          
        )}

        {selectedTable === "reclamations" && (
            <>
          <table className="grid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Client ID</th>
                <th>Object</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Organisation ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((reclamation) => (
                <tr key={reclamation.id}>
                  <td>{reclamation.id}</td>
                  <td>{reclamation.date}</td>
                  <td>{reclamation.client_id}</td>
                  <td>{reclamation.object}</td>
                  <td>{reclamation.desc}</td>
                  <td>{reclamation.deadline}</td>
                  <td>{reclamation.status}</td>
                  <td>{reclamation.organisation_id}</td>
                  <td>
                    <button onClick={() => handleDelete(reclamation.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </>
        )}

        {selectedTable === "clients" && (
        <>
          <table className="grid-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Infos</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.nom}</td>
                  <td>{client.infos}</td>
                  <td>
                    <button onClick={() => handleDelete(client.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
           <button onClick={() => handleShowCreateForm("clients")}>Create client</button>
           {showCreateClientForm && <CreateClientForm />}
           </>
        )}
      </div>
    </div>
  
  );
};

export default AdminPage;