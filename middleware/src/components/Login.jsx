import React,{useState, useContext} from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { userContext } from '../App';

import "./Login.css"
import Navbar from './Navbar';

const Login = () => {
  
    const[email,setemail] = useState('');
    const[password,setpassword] = useState('');
    const navigate = useNavigate();

    const user = useContext(userContext);

    const handleSubmit = (e) => {
    e.preventDefault();


    axios
      .post('http://localhost:3001/login', { email, password })
      .then((result) => {
        if (result.data.status === 'success') {
          console.log(result.data);
          console.log(user);
          console.log(user.username);
          navigate("/");

        //   window.location.href = "/";
        } else {
          // Handle login error
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };


  return (
    <>
      <Navbar/>
    <div className='signup_container'>
    <div className='sign'>
        <h2 className='login'>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label className="label" htmlFor='email'>Email</label><br/>
            <br/>
                <input  className="input" type='email' placeholder='enter email'
                onChange={(e) => setemail(e.target.value)}
                />
                <br/>
                <br/>
            </div>

            <div>
            <label className="label" htmlFor='password'>password</label><br/>
                <input className='input' type='password' placeholder='enter password'
                onChange={(e) => setpassword(e.target.value)}
                />
            </div>
            <button className='signup_btn'>login</button>
        </form>

        <br></br>
        <p className='p'>Already have an account?</p>
        <Link to ="/Register">   
        <button className='signup_btn'>
             Sign up
             </button>
             </Link>
    </div>
</div>
</>
  )
}

export default Login