/* global chrome */

import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Crawl = () => { 
  
    const [domain, setDomain] = useState('')
    const [headlines, setHeadlines] = useState([])

    useEffect(() => {
        chrome.tabs.query({activ:true, currentWindow: true}, tabs =>{
            const url = new URL(tabs[0].url);
            const domain = url.hostname;
            setDomain(domain);
            getHeadlines(domain);
        })
    })

    const getHeadlines = (query) =>{
        //do anything

    }

    return(
        <div>
           
        </div>
        )
  
  }
  
  export default Crawl;