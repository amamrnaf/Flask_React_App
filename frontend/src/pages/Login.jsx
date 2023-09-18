import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"; // Import your CSS file with styles

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            
          const response = await axios.post("http://127.0.0.1:5000/auth/login", formData,{
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
            },
          });
          
          const token = response.data.token; 
          if (response.status === 200) {
            
            sessionStorage.setItem("token", token);
            
            navigate("/Dashboard"); 
            // Redirect the user to another page or update the UI as needed
          } else {
            // Display an alert for wrong credentials
            alert("Wrong credentials");
          }
          // Redirect the user to another page or update the UI as needed
        } catch (error) {
          alert("Wrong credentials");
          console.error("Authentication failed:", error);
        }
      };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
