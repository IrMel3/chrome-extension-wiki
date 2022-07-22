/* global chrome */

import './App.css';
import {Vocab} from './vocabList'
import {useState, useEffect} from 'react';
import Search from "./components/Search"
import Crawl from "./components/Crawl"
import Navbar from "./components/Navbar"



function App() {
  const randomNum = Math.floor(Math.random() * Math.floor(Vocab.length))  
 
  return (
    <div className="App"> 
      <Navbar/>
      <Search/>       
      <h1>{Vocab[randomNum].FIELD1}</h1>
      <h3>{Vocab[randomNum].FIELD2}</h3>
    </div>
  );
}

export default App;
