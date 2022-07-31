/* global chrome */

import './App.css';
import {Vocab} from './vocabList'
import React, {useState, useMemo, useEffect, Fragment} from 'react';
import Search from "./components/Search"
import { BrowserRouter as Router, Routes, Switch, Route, Link } from "react-router-dom";
import Dictionary from "./components/Dictionary"
import Crawl from "./components/Crawl"
import Navbar from "./components/Navbar"
import { createMemoryHistory } from "history";
import { DictionaryContext } from './components/DictionaryContext';


const history = createMemoryHistory();


const App =() => {
  const randomNum = Math.floor(Math.random() * Math.floor(Vocab.length))  
  
  const [isActive, setIsActive] = useState(true)
  const [isDictionaryActive, setIsDictionaryActive] = useState(false)
  const [value, setValue] = useState(JSON.parse(localStorage.getItem("Vocabulary" || []))) //localStorage.getItem("Vocabulary") || [] - change this to prevent comma overload

  //const providerValue = useMemo(() => ({value, setValue}, [value, setValue]));

  return (
    <div className="App">
      <DictionaryContext.Provider value={{value, setValue}}>
      <React.Fragment>
      <div className="accordion">
        <div className="accordion-item">
          <div className="accordion-title" onClick={()=> setIsActive(!isActive)}>
            <h3>Home</h3>
            <div className="plusSign">{isActive ? '-' : '+'}</div>
          </div>
          {isActive && <div className="accordion-content"><Search/></div>}
        </div>
        <div className="accordion-item">
          <div className="accordion-title" onClick={()=> setIsDictionaryActive(!isDictionaryActive)}>
            <h3>Dictionary</h3>
            <div className="plusSign">{isDictionaryActive ? '-' : '+'}</div>
          </div>
          {isDictionaryActive && <div className="accordion-content"><Dictionary/></div>}
        </div>
      </div>
    </React.Fragment>
    </DictionaryContext.Provider>    
    </div>
    
  );
}

export default App;
