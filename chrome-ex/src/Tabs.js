import React, {useEffect, useState} from 'react';
import { Routes, Route, Router, NavLink} from 'react-router-dom'
import Test1 from "./components/Test1"
import Search from "./components/Search"
import Test2 from "./components/Test2"
import Dictionary from "./components/Dictionary"
import { DictionaryContext } from './components/DictionaryContext';
import { UserContext } from './components/UserContext';
import Login from "./components/Login"
import { AuthContext } from './components/AuthContext';
import { matchPath } from "react-router";
import './tabs.css'

function Tabs(){

  const [isActive, setIsActive] = useState(true)
  const [isDictionaryActive, setIsDictionaryActive] = useState(false)
  const [value, setValue] = useState([]) //localStorage.getItem("Vocabulary") || [] - change this to prevent comma overload
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() =>{
    if(localStorage.getItem("User") !== null){
      setUser(localStorage.getItem("User"))
      setIsAuth(true)
    }
  })


    /**
     * falls ich dazu nicht mehr komme, einfach die Login Komponente wieder hier hinein setzen.
     */

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
            }>Home</NavLink>
            <NavLink to='/dictionary'  className={({isActive}) =>
                (isActive ? "active navlink" : "unselected navlink")
            }>Favourites</NavLink> </div>
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