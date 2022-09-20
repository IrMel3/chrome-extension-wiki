/* global chrome */

import './App.css';
import {Vocab} from './vocabList'
import React, {useState, useEffect} from 'react';
import Search from "./components/Search/Search"
import { Routes, Route} from 'react-router-dom';
import Dictionary from "./components/Dictionary/Dictionary"
import { DictionaryContext } from './components/Contexts/DictionaryContext';
import { UserContext } from './components/Contexts/UserContext';
import Login from "./components/Login/Login"


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
  
  useEffect(() =>{
    if(localStorage.getItem("User") !== null){
      setUser(localStorage.getItem("User"))
      setIsAuth(true)
    }
  })


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
