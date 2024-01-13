import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdMenu } from "react-icons/io";
import logo from "../images/blog_logo.png";
import { userContext } from '../App';
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const user = useContext(userContext);
  const navigate = useNavigate();

  /*
  Here first in login page session store my email
  then here for login email get current-user
  then we authenticate all thing
  */

  const handlelogout = () => {
    axios.get('http://localhost:3001/logout')
    .then(response => {
        console.log(response.data); // Expected: "success"
        window.location.href ="/";
    })
    .catch(err => {
        console.log(err);
    });

  };

  console.log('User:', user);
  console.log("user is ", user);

 
  return (
    <>
   
    
     <header>
      <div className="head">
      <Link to="/"><img src={logo} className="himg" alt=""/></Link>

      <nav className="navbar">
             {user ? (
              <>
                <Link className="link" to="/Contactus">Contactus</Link>
                <Link className="link" to="/Loginusers">Users</Link>
                <Link className="link" to="/Posts">Postsusers</Link>
                <div className='position'>
          <input
            type="button"
            onClick={handlelogout}
            value="Logout"
            className="btn_input"
          />
        </div>
              </>
            ) : (
              <div>Loading user data...</div>
            )} 
          

  
</nav>



        <div className="dropdown">
          <IoMdMenu style={{ fontSize: '25px', cursor: 'pointer', marginRight: '10px', marginTop: '26px' }}/>
           <div className="dropdown-content">
           <Link className="link" to="/Contactus">Contactus</Link>
  <Link className="link" to="/Loginusers">Users</Link>
  <Link className="link" to="/Posts">Postsusers</Link>

          </div> 
        </div>
      </div>

      <div className='app'></div>
      
    </header>
    </>
  )
}

export default Navbar