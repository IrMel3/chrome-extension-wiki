/* global chrome */

import React, {useState, useEffect} from 'react';
import './Search.css';
import axios from 'axios';
import {getCurrentTab} from "../Utils";
import TrafficContainer from "./TrafficContainer"
var parse = require('html-react-parser');


const Search = () => { 
  
    const [term, setTerm] = useState(localStorage.getItem("Term") || "React_(JavaScript_library)")
    const [results, setResults] = useState([])
    const [seeAlso, setSeeAlso] = useState([])
    const [links, setLinks] = useState([])
    const [pageContent, setPageContent] = useState('N/A');
    const [language, setLanguage] = React.useState('en');
    const [sectionNum, setSectionNum] = useState(0);
    const seeAlsoText = ["See also", "Siehe auch", "Voir aussi", "Voci correlate"]

    /**
     * looks if the language was already set and fetches it from local storage
     */
    useEffect(() =>{
        if(localStorage.getItem("Language") != 'en'){
            setLanguage(localStorage.getItem("Language"))
        }
    })



    useEffect(() =>{
        chrome.storage.sync.get("visitedPages",function (changes) {
            if((pageContent !== changes.visitedPages) && (changes.visitedPages !== null)) {
                setPageContent(changes.visitedPages.pageText)
                setTerm(changes.visitedPages.pageText)
                console.log("New Term:",changes.visitedPages.pageText);
        }}
        )
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

/**
 * 
 * @returns fetches sections of the wikipedia article
 */
    const searchSA = async () => {
        return await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
            params: {
                action: "parse",
                prop: "sections",
                format: "json",
                origin: "*",
                page: term,
            },
        })}
        
/**
 * 
 * @returns fetches see Also section of the wikipedia article
 */
    const searchSA2 = async () => {
        return await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
            params: {
                action: "parse",
                prop: "text",
                format: "json",
                origin: "*",
                page: term,
                section: sectionNum
            },
        })}

    //search "see also" e.g. https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&prop=sections
    // and then https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&section=42
    useEffect(() => {
        //search Wikipedia API
        if (term && !seeAlso.length){
            searchSA()
                .then(data=>{
                console.log(data.data);
                const sections = data.data.parse.sections;
                console.log(data.data.parse.sections)
                //Check if there is a See Also section
                for(var i=0; i < sections.length; i++){
                if(sections[i].line == seeAlsoText[0] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[2] || sections[i].line == seeAlsoText[3]){
                    console.log(sections[i].index);
                    console.log(i);
                    //section = i;
                    var secNum = sections[i].index;
                    console.log("This is var secNum:" + secNum);
                    setSectionNum(secNum);
                }
                /*else{
                    setSeeAlso(parse(`<div className="seeAlso">No "See also" section found for ${term}</div>`))
                }*/
                }
            })
            searchSA2()
                .then(data=>{
                    if(data.data.parse.text["*"]){
                    console.log(data.data);
                    console.log(data.data.parse.text["*"]);
                    setSeeAlso(parse(`<div className="seeAlso">${data.data.parse.text["*"]}</div>`));
                    }
                    /*else{
                        setSeeAlso(parse(`<div className="seeAlso">No "See also" section found for ${term}</div>`))
                    }*/
                
            }).catch(error => console.log(error))
    }else{
        let timeoutId = setTimeout(() =>{
            if(term){
                searchSA()
                .then(data=>{
                console.log(data.data);
                const sections = data.data.parse.sections;
                console.log(data.data.parse.sections)
                //Check if there is a See Also section
                for(var i=0; i < sections.length; i++){
                    console.log(sections[i].index);
                if(sections[i].line == seeAlsoText[0] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[2] || sections[i].line == seeAlsoText[3]){
                    //console.log(sections[i].index);
                    console.log(i);
                    //section = i;
                    var secNum = sections[i].index;
                    console.log("This is var secNum:" + secNum);
                    setSectionNum(secNum);
                }}})
            searchSA2()
                .then(data=>{
                    if(data.data.parse.text["*"]){
                    console.log(data.data);
                    console.log(data.data.parse.text["*"]);
                    setSeeAlso(parse(`<div>${data.data.parse.text["*"]}</div>`));
                }
                /*else{
                    setSeeAlso(parse(`<div className="seeAlso">No "See also" section found for ${term}</div>`))
                }*/
                
            }).catch(error => console.log(error));
            }
        },1000);
        return clearTimeout(timeoutId);
    }

}, [seeAlso])  
                
            
   

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
            if(data != null){
            setLinks(data.query.pages[keys[0]].links)
            localStorage.setItem("Term", term);
        }
            
        }
        if (term && !links.length){
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
            if(data != null){
            setResults(data.query.search)
            }
           // console.log(results);
        }
        if (term && !results.length){
            search();
        }else{
        let timeoutID = setTimeout(() =>{
        if(term){
        search()
        }
    },700);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [term])


    const searchResultsMapped = 
    
    results && results.slice(0,3).map(result =>{
        return(
            
            <div className="item" key={result.pageid}>
                <div className="content">
                    <h3 className="header">{result.title}</h3>
                    <span className='link'><a target="_blank" href={`https://${language}.wikipedia.org/wiki/${result.title}`}>{`https://${language}.wikipedia.org/wiki/${result.title}`}</a></span><br/>
                    <span dangerouslySetInnerHTML={{__html:result.snippet}}></span>

                </div>
            </div>
            
        )
    }
)

    const linksInArticle = 
    
    links && links.map(link =>{
        return (
            <div>
            <span className='link'><a target="_blank" href={`https://${language}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </div>
        )
    })

    const handleLanguage = (event) => {
    setLanguage(event.target.value);
    localStorage.setItem("Language", event.target.value)
    };
    

    return(
      <div>
          <div className="ui-form">
              <div className="field">
                  <div id="langselect"><label>
                        Select language
                        <select value={language} onChange={handleLanguage}>
                        <option value="en">English</option>
                        <option value="de">German</option>
                        <option value="fr">French</option>
                        <option value="it">Italian</option>
                        </select>
                  </label></div>
                  <div id="search">
                  <label>Search Term:</label>  
                  
                  <input className="input"
                  id="searchfield"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  />
                  </div>
              </div>
          </div>
          <div className="ui celled list">{searchResultsMapped}</div>
          <div>{seeAlso}</div>
          <p>First 10 Links:</p>
          <div>{linksInArticle}</div>
          
          
      </div>
      )

}

export default Search;
