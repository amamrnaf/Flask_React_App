import React, { useState } from 'react';
import axios from "axios";

const NewPasswordPage = () => {
  // State to store the new password
    const [newPassword, setNewPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [message, setMessage] = useState('');
    const axiosConfig = {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      };
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmedPassword) {
        setMessage('Passwords do not match.');
        alert(message);
        return;
    }

    try {
        const response = await axios.put('http://127.0.0.1:5000/auth/changepassword', {
            new_password: newPassword,
            confirmed_password: confirmedPassword,
        },axiosConfig);
        console.log(response.data);
        setMessage(response.data.message);
        console.log(message);
    } catch (error) {
        setMessage(error.response.data.message);
        console.log(message);
    }
  };

  return (
    <div className="container">
      <h1>Create New Password</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            onChange={(e) => setConfirmedPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Password
        </button>
      </form>
    </div>
  );
};

export default NewPasswordPage;
