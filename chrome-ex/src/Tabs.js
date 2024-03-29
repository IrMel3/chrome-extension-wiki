import React, {useEffect, useState} from 'react';
import { Routes, Route, Router, NavLink} from 'react-router-dom'
import Search from "./components/Search/Search"
import Dictionary from "./components/Dictionary/Dictionary"
import { DictionaryContext } from './components/Contexts/DictionaryContext';
import { UserContext } from './components/Contexts/UserContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faHeart,
  } from "@fortawesome/free-solid-svg-icons";
import Login from "./components/Login/Login"
import { AuthContext } from './components/Contexts/AuthContext';
import { matchPath } from "react-router";
import './tabs.css'

function Tabs(){

  const [isActive, setIsActive] = useState(true)
  const [isDictionaryActive, setIsDictionaryActive] = useState(false)
  const [value, setValue] = useState([]) //localStorage.getItem("Vocabulary") || [] 
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() =>{
    if(localStorage.getItem("User") !== null){
      setUser(localStorage.getItem("User"))
      setIsAuth(true)
    }
  },[user])

  /*const resize = () =>{
      let iframe = document.getElementsByTagName("iFrame")
      iframe.height = "300px";  
  }*/


    return(
        <div className="App">
            <AuthContext.Provider value={{isAuth,setIsAuth}}>
            <UserContext.Provider value={{user, setUser}}>
            <DictionaryContext.Provider value={{value, setValue}}>
            {!isAuth ? (<Login/>) : ( 
            <div>
            <div className="navi">
            <NavLink to ='/' className={({isActive}) =>
                (isActive ? "active navlink" : "unselected navlink")
            }><FontAwesomeIcon 
            icon={faHouse}
            className="houseBtn"
            size="2x"
            color="#B2BFC7" 
            /></NavLink>
            <NavLink to='/dictionary'  className={({isActive}) =>
                (isActive ? "active navlink" : "unselected navlink")
            }><FontAwesomeIcon 
            icon={faHeart}
            className="heartBtn"
            size="2x"
            color="#B2BFC7" 
            /></NavLink> </div>
            <Routes>
                <Route path="/" element={<Search/>} />
                <Route path="/dictionary" element={<Dictionary/>}/>
            </Routes></div>)}
            </DictionaryContext.Provider>
            </UserContext.Provider>
            </AuthContext.Provider>
     </div>
        
        )
}
export default Tabs;