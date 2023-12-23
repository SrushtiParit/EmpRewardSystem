import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { userData } from "../redux/loginSlice";


const PrivateComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [flag, setFlag] = useState(true);
  let photo;

  useEffect(() => {
  },[]);

  const getData = async () => {
    try
    {
    const auth = JSON.parse(sessionStorage.getItem('token'));
    if(!auth)
    {
      navigate('/login');
    }

    // const result = await fetch('http://localhost:5000/authenticateUser', {
    //   method: 'POST', // or any other HTTP method
    //   credentials: 'include',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ token: auth }), // Include the token in the request body
    // });

    const result = await fetch("http://localhost:5000/authenticateUser",{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: auth })
    });
    const data = await result.json();
    if(data.isAuthenticated)
    {
      const username = data.userName;
      const role = data.userRole;
      
      if(data.userImage)
      {
        const bufferData = data.userImage.data;
        console.log(bufferData);
        const uint8Array = new Uint8Array(bufferData);
        const base64Image = btoa(String.fromCharCode.apply(null, uint8Array));
        photo = 'data:image/png;base64,'+base64Image;
        
        dispatch(userData({ username, role, photo }));
      }
      else
      {
        dispatch(userData({username, role}));
      }
      
    }
    else
    {
      navigate('/login'); 
      localStorage.clear();
    }
    
    // if (data.isAuthenticated === false) {
    //  
    //   
    // }
    // else{
    //   const username = data.userName;
    //   const role = data.userRole;
    //   const bufferData = data.userImage.data;
    //   console.log(data);

    

    //   
    // }
  }
  catch (error) {
    console.error('Error fetching data:', error);
  }
  };
  getData();

  return flag ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateComponent;
