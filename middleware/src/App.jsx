import { useEffect, useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Contactus from './components/Contactus'
import Loginusers from './components/Loginusers'
import Posts from './components/Posts'
import { createContext } from 'react'
import Login from './components/Login'
import axios from 'axios'
import Register from './components/Register'
import Navbar from './components/Navbar'

export const userContext = createContext();


function App() {
  const[user,setuser] = useState(null);

  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then(response => {
        const userData = response.data;
        setuser(userData); // Update the user state
      })
      .catch(err => {
        console.log(err);
      });
  }, []);


  return (
    <>
     <userContext.Provider value={user}> {/* Provide both user and setUser */}
      <Router>
        <Routes>
          <Route path="/" element={<Navbar/>} />
          <Route path="/Contactus" element={<Contactus />} />
          <Route path="/Loginusers" element={<Loginusers />} />
          <Route path='/Register' element={<Register/>}/>
          <Route path="/Posts" element={<Posts />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </userContext.Provider>
    </>
  )
}

export default App
