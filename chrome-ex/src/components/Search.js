/* global chrome */

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {getCurrentTab} from "../Utils";
import TrafficContainer from "./TrafficContainer"
var parse = require('html-react-parser');


const Search = () => { 
  
    const [term, setTerm] = useState("React")
    const [results, setResults] = useState([])
    const [seeAlso, setSeeAlso] = useState([])
    const [links, setLinks] = useState([])
    const [pageContent, setPageContent] = useState('N/A');
    const [language, setLanguage] = React.useState('en');
    const [sectionNum, setSectionNum] = useState(0);


    useEffect(() =>{
        chrome.storage.onChanged.addListener(function (changes,areaName) {
            if((pageContent !== changes.visitedPages.newValue) && (changes.visitedPages.newValue !== null)) {
                setPageContent(changes.visitedPages.newValue)
                setTerm(changes.visitedPages.newValue.pageText)
                console.log("New Term:",changes.visitedPages.newValue);
        }})

    },[])
    

    useEffect(() => {
        const setTextInfo = info =>{
            document.getElementById('crawled').textContent = info.data;
        }

        window.addEventListener('DOMContentLoaded', () =>{
            chrome.tabs.query({
                active: true, 
                currentWindow:true
            },tabs => {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {from: 'app', subject: 'getText'},
                    (resp) =>{
                        console.log(resp.data);
                        setTextInfo(resp.data)
                    });
        });
    });
    });

    //search "see also" e.g. https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&prop=sections
    // and then https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&section=42
    useEffect(() => {
        //search Wikipedia API
        var section = 0; //variable for the see also section
        
        const searchSA = async () => {
            const { data } = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                params: {
                    action: "parse",
                    prop: "sections",
                    format: "json",
                    origin: "*",
                    page: term,
                },
            })
           // console.log(data);
            const sections = data.parse.sections;
            //console.log(data.parse.sections)

            //Check if there is a See Also section
            for(var i=0; i < sections.length; i++){
                if(sections[i].line == 'See also'){
                   // console.log(sections[i]);
                   // console.log(i);
                    section = i;
                    setSectionNum(i);
                }
            }}
            //console.log(section);
            const searchSA2 = async (sectionNum) => {
            const { data } = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                params: {
                    action: "parse",
                    prop: "text",
                    format: "json",
                    origin: "*",
                    page: term,
                    section: sectionNum,
                },
            })
            console.log(data);
            console.log(data.parse.text["*"]);
            setSeeAlso(parse(`<div>${data.parse.text["*"]}</div>`));            
        }

        const fetchAllData = async () => {
            const data = await searchSA();
            await searchSA2();
          };
        
        if (term && !seeAlso.length){
            fetchAllData();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        fetchAllData();
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])
   

    //search links
    useEffect(() => {
        //search Wikipedia API
        const searchLinks = async () => {
            const { data } = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                params: {
                    action: "query",
                    prop: "links",
                    format: "json",
                    origin: "*",
                    titles: term,
                },
            })
            //console.log(data);
            const keys = Object.keys(data.query.pages)
            //console.log(data.query.pages[keys[0]].links)
            setLinks(data.query.pages[keys[0]].links)
            
        }
        if (term && !seeAlso.length){
            searchLinks();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        searchLinks()
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])

    //search terms and descriptions
    useEffect(() => {
        //search Wikipedia API
        const search = async () => {
            const { data } = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                params: {
                    action: "query",
                    list: "search",
                    origin: "*",
                    format: "json",
                    srsearch: term,
                },
            })
            setResults(data.query.search)
           // console.log(results);
        }
        if (term && !results.length){
            search();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        search()
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])


    const searchResultsMapped = results.map(result =>{
        return(
            <div className="item" key={result.pageid}>
                <div className="content">
                    <h3 className="header">{result.title}</h3>
                    <span className='link'><a href={`https://${language}.wikipedia.org/wiki/${result.title}`}>{`https://${language}.wikipedia.org/wiki/${result.title}`}</a></span><br/>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>

                </div>
            </div>
        )
    })

    const linksInArticle = links.map(link =>{
        return (
            <div>
            <span className='link'><a href={`https://${language}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </div>
        )
    })

    const handleLanguage = (event) => {
    setLanguage(event.target.value);
    };
    

    return(
      <div>
          <div className="ui-form">
              <div className="field">
                  <div><label>
                        Select language
                        <select value={language} onChange={handleLanguage}>
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="it">Italian</option>
                        </select>
                  </label></div>
                  <label>Search Term</label>
                  
                  <input className="input"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  />
              </div>
          </div>
          <p>First 10 Links:</p>
          <div>{linksInArticle}</div>
          <p>See also:</p>
          <div>{seeAlso}</div>
          <div className="ui celled list">{searchResultsMapped}</div>
      </div>
      )

}

export default Search;
