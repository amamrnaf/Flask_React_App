import React from 'react';
import { Navigate } from 'react-router-dom';

function Protected({ children }) {
  // Get the JWT token from localStorage
  const jwtToken = sessionStorage.getItem('token');

  // Check if a valid JWT token exists
  if (jwtToken === null || jwtToken === "undefined" || jwtToken === '') {
    alert("you are not logged in!!")
    // Redirect to the login page or handle unauthorized access as needed
    return <Navigate to="/login" replace />;
  }

  // If a valid JWT token exists, render the protected content
  return children;
}

export default Protected;
