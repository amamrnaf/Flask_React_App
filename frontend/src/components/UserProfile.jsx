import React, { useEffect,useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";
import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const UserProfile = () => {
  const { currentColor } = useStateContext();
  const [userData,setUser]= useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make an Axios request to your protected logout endpoint
      await axios.post('http://127.0.0.1:5000/auth/logout', null, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      }); // Replace with the actual logout endpoint URL
      
      // Clear the access_token from sessionStorage
      sessionStorage.removeItem('token');
      navigate("/Login"); 
      
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
   
    const token = sessionStorage.getItem("token");
    console.log("Token:", token)
    // Check if a token exists
    if (token) {
      // Include the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Fetch user data using Axios with the Authorization header
      axios.get("http://127.0.0.1:5000/auth/user", config)
        .then((response) => {
          // Handle the user data (e.g., set it in state)
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("no token detected,you should log in");
    }
  }, []);

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {" "}
            {userData.name}{" "}{userData.family_name}{" "}
          </p>
          
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {userData.email}{" "}
          </p>
        </div>
      </div>
      <div onClick={handleLogout} className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          
        />
      </div>
      <div className="mt-5">
      <Link to="/newpasswordpage">
        <Button
          color="white"
          bgColor={currentColor}
          text="Change password"
          borderRadius="10px"
          width="full"
        />
      </Link> 
      </div>
    </div>
  );
};

export default UserProfile;
