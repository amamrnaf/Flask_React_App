import React, { useState,useEffect } from "react";
import axios from "axios";

const CreateUserForm = () => {
  const [userData, setUserData] = useState({
    name: "",
    family_name: "",
    organisation: "",
    email: "",
    password: "",
  });
  const [organisations, setOrganisations] = useState([]);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/admin/create_users", userData)
      .then((response) => {
        alert("User created successfully!",response);
        // Optionally, you can redirect to a different page after successful creation.
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/admin/organisations`,axiosConfig)
      .then((response) => {
        console.log(response.data);
        setOrganisations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching permission:", error);
      });
  },[]);
  
  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Family Name:</label>
          <input
            type="text"
            name="family_name"
            value={userData.family_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Organisation:</label>
          <select
            name="organisation"
            value={userData.organisation}
            onChange={handleChange}
            required
          >
            <option value="">Select an organization</option>
            {organisations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit">Create User</button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserForm;
