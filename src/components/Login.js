import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {

    const [credentials,setCredentials] = useState({email: "",password:""});
    const navigate = useNavigate();
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch("https://inotebook2.vercel.app/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
             
            },
            body: JSON.stringify({email: credentials.email,password: credentials.password})
          });
          const json = await response.json();
          if(json.success){
            
            localStorage.setItem('token',json.authtoken);
            props.showAlert("Logged In Successfully","success");
            navigate('/');
          }
          else{
            props.showAlert("Invalid Credential","danger");
          }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]: e.target.value})
      }

  return (
    <div className='mt-3'>
      <h2 className='my-2'>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="email" className="form-label">Email address</label>
    <input type="email" className="form-control" onChange={onChange} id="email" name="email" value={credentials.email} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password</label>
    <input type="password" className="form-control" onChange={onChange} id="password" name="password" value={credentials.password}/>
  </div>

  <button type="submit" className="btn btn-primary" >Submit</button>
</form>
    </div>
  )
}

export default Login
