import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from 'react-router-dom';

function AdminProtection({ children }) {
  const [isAllowed, setIsAllowed] = useState(false);
  const jwtToken = sessionStorage.getItem('token');

  useEffect(() => {
    let isMounted = true;

    if (jwtToken === null || jwtToken === "undefined" || jwtToken === '') {
      alert("You are not logged in!!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    axios.get(`http://127.0.0.1:5000/auth/rights`, config)
      .then((response) => {
        if (isMounted) {
          console.log("Response data:", response.data);
          setIsAllowed(response.data.allowed);
        }
      })
      .catch((error) => {
        console.error("Error fetching permission:", error);
      });

    // Add a cleanup function to cancel any pending tasks when the component unmounts
    return () => {
      isMounted = false; // Set isMounted to false to indicate unmounting
    };
  }, [jwtToken]);

  if (jwtToken === null || jwtToken === "undefined" || jwtToken === '') {
    alert("You are not logged in!!");
    return <Navigate to="/login" replace />;
  }

  // Check if the organization is "main_office"
  if (isAllowed) {
    // Render the protected content for "main_office"
    return children;
  } else {
    // Redirect to the /dashboard route for other organizations
    return <Navigate to="/dashboard" replace />;
  }
}

export default AdminProtection;
