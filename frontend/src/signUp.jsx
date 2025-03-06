import React from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signUp.css';

const SignUp = () =>
{
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) =>
    {
        e.preventDefault();
        console.log(username);
        console.log(password);

        const response = await axios.post("http://localhost:5000/login", {username:username, password:password});

        if(response.status == 200)
        {
            navigate(`/lawyerpage/${username}`);
        }
    }

    const handleWhistle = () =>
    {
        navigate("homepage");
    }
  return (
    <>
      <h2>Welcome Back Lawyer</h2>
      <form onSubmit={handleSubmit}>
        <div className='userName-cont'>
            <label htmlFor='username'>username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="password-cont">
            <label htmlFor='password'>password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>

        <button type="submit">Login</button>
      </form>
      <h6 onClick={handleWhistle}>Are you a whistleblower ? Click here </h6>
    </>
  )
}

export default SignUp
