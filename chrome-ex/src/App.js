/* global chrome */

import './App.css';
import {Vocab} from './vocabList'
import React, {useState, useMemo, useEffect, Fragment} from 'react';
import axios from 'axios';
import Search from "./components/Search"
import { Routes, Route, Router} from 'react-router-dom';
import Dictionary from "./components/Dictionary"
import Crawl from "./components/Crawl"
import Navbar from "./components/Navbar"
import { createMemoryHistory } from "history";
import { DictionaryContext } from './components/DictionaryContext';
import { UserContext } from './components/UserContext';
import { createGlobalStyle } from 'styled-components';
import Login from "./components/Login"


/**
 * npm run build to build the chrome extension and load build folder into chrome
 * node index to start the server on port 3000
 * @returns 
 */


const App =() => {
  const randomNum = Math.floor(Math.random() * Math.floor(Vocab.length))  
  
  const [isActive, setIsActive] = useState(true)
  const [isDictionaryActive, setIsDictionaryActive] = useState(false)
  const [value, setValue] = useState([]) //localStorage.getItem("Vocabulary") || [] - change this to prevent comma overload
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  //const providerValue = useMemo(() => ({value, setValue}, [value, setValue]));

  useEffect(() =>{
    if(localStorage.getItem("User") !== null){
      setUser(localStorage.getItem("User"))
      setIsAuth(true)
    }
  })

  /*const GlobalStyle = createGlobalStyle`
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
`;*/

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
      <DictionaryContext.Provider value={{value, setValue}}>
          <ul>
                <li>
                    <a href='#/'>Home</a>
                </li>
                <li>
                <a href='#/dictionary'>Dictionary</a>
                </li>
            </ul>
      <Routes>
      <Route path="/" element={<Search/>} />
      <Route path="/dictionary" element={<Dictionary/>}/>
      {!isAuth ? (<Login/>) : 
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
    </Routes>
    </DictionaryContext.Provider>  
    </UserContext.Provider>  
    </div>
    
  );
}

export default App;
