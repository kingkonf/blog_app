import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

import "./Register.css";
const Register = () => {

    const[username,setusername] = useState();
    const[email,setemail] = useState();
    const[password,setpassword] = useState();

    const handlesubmit =(e)=>{
        e.preventDefault();
        axios.post("http://localhost:3001/register", {username,email,password})
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
    return (

        <>
        <div className='div1'>
            <div className='div2'>
                <h2 className='h2'>Sign up</h2>
                <form onSubmit={handlesubmit}>
                    <div>
                        <br/>
                        <label className='label1' htmlFor='name'>username</label><br/>
                        <input className='input1' type='text' placeholder='enter name'
                        onChange={e => setusername(e.target.value)}
                        />
                    </div>
    
                    <div>
                    <label  className='label1' htmlFor='email'>email</label><br/>
                        <input className="input1" type='email' placeholder='enter email'
                        onChange={e => setemail(e.target.value)}
                        
                        />
                    </div>
    
                    <div>
                    <label className='label1'  htmlFor='password'>password</label><br/>
                        <input className="input1"  type='password' placeholder='enter password'
                        onChange={e => setpassword(e.target.value)}
                        />

                    </div>
                    <button className='signup_btn'>Sign up</button>
                </form>
    
                <br></br>
                <p className='p1'>Already have an account?</p>
                <Link to ="/Login"> 
                 <button className='signup_btn' > 
                 Login
                 </button>
                </Link>
            </div>
        </div>
        </>
      )
}

export default Register