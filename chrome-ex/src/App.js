/* global chrome */

import './App.css';
import {Vocab} from './vocabList'
import React, {useState, useMemo, useEffect, Fragment} from 'react';
import axios from 'axios';
import Search from "./components/Search"
import { BrowserRouter as Router, Routes, Switch, Route, Link } from "react-router-dom";
import Dictionary from "./components/Dictionary"
import Crawl from "./components/Crawl"
import Navbar from "./components/Navbar"
import { createMemoryHistory } from "history";
import { DictionaryContext } from './components/DictionaryContext';
import { UserContext } from './components/UserContext';
import { createGlobalStyle } from 'styled-components';


const history = createMemoryHistory();

/**
 * npm run build to build the chrome extension and load build folder into chrome
 * node index to start the server on port 3000
 * @returns 
 */


const App =() => {
  const randomNum = Math.floor(Math.random() * Math.floor(Vocab.length))  
  
  const [isActive, setIsActive] = useState(true)
  const [isDictionaryActive, setIsDictionaryActive] = useState(false)
  const [value, setValue] = useState(JSON.parse(localStorage.getItem("Vocabulary" || []))) //localStorage.getItem("Vocabulary") || [] - change this to prevent comma overload
  const [user, setUser] = useState(null);
  const [newUser, setNewUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  //const providerValue = useMemo(() => ({value, setValue}, [value, setValue]));

  useEffect(() =>{
    if(localStorage.getItem("User") !== null){
      setUser(localStorage.getItem("User"))
      setIsAuth(true)
    }
  })

  const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Segoe UI';
    local("Segoe UI Light"),
        url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2) format("woff2"),
        url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff) format("woff"),
        url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf) format("truetype");
    font-weight: 50;
  }
  h3 {
    font-family: 'Segoe UI';
    font-weight: 50px;
  }
`;

   

  const checkIfUserExists = () =>{
    //check if user is in database 
    //if exists, add to localstorage
    
            let userData = {
                user: user,
            }
            axios
                .post("http://localhost:3000/loginUser", userData)
                .then(res => {
                  console.log(res.data)
                  if(res.data.message === "User exists!"){
                  localStorage.setItem("User", user);
                  setIsAuth(true);
                  }
                })
                .catch(error => console.log(error))
  }

  const registerNewUser = () =>{
    //add new user to the database
    //set newUser to User
    let userData = {
      user: newUser,
  }
  axios
      .post("http://localhost:3000/registerUser", userData)
      .then(res => {
        console.log(res.data)
        if(res.data.message === "Saved new user!"){
        localStorage.setItem("User", newUser);
        }
      })
      .catch(error => console.log(error))

  }

  return (
    <div className="App">
      <GlobalStyle/>
      <UserContext.Provider value={{user, setUser}}>
      <DictionaryContext.Provider value={{value, setValue}}>
      {!isAuth ? (<div><div><label>Please log in with your user name:</label>  
                  <input className="input"
                  id="userfield"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  /></div>
                  <button onClick={checkIfUserExists}>Login</button>
                  <div><label>Or register a new user name: </label>  
                  <input className="input"
                  id="userfield"
                  value={newUser}
                  onChange={e => setNewUser(e.target.value)}
                  /></div>
                  <button onClick={registerNewUser}>Register</button>
                  </div>) : 
      <React.Fragment>
      <div className="accordion">
        <div className="accordion-item">
          <div className="accordion-title" onClick={()=> setIsActive(!isActive)}>
            <h3>HOME</h3>
            <div className="plusSign">{isActive ? '-' : '+'}</div>
          </div>
          {isActive && <div className="accordion-content"><Search/></div>}
        </div>
        <div className="accordion-item">
          <div className="accordion-title" onClick={()=> setIsDictionaryActive(!isDictionaryActive)}>
            <h3>DICTIONARY</h3>
            <div className="plusSign">{isDictionaryActive ? '-' : '+'}</div>
          </div>
          {isDictionaryActive && <div className="accordion-content"><Dictionary/></div>}
        </div>
      </div>
    </React.Fragment>}
    </DictionaryContext.Provider>  
    </UserContext.Provider>  
    </div>
    
  );
}

export default App;
