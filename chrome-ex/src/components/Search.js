/* global chrome */

import React, {useState, useEffect, useContext, useRef} from 'react';
import './Search.css';
import axios from 'axios';
import {getCurrentTab} from "../Utils";
import TrafficContainer from "./TrafficContainer"
import { DictionaryContext } from './DictionaryContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faCirclePlus,
  } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from './UserContext';
var parse = require('html-react-parser');


const Search = () => { 
  
    const [term, setTerm] = useState(localStorage.getItem("Term") || "")
    const [translatedTerm, setTranslatedTerm] = useState(localStorage.getItem("Translation") || "")
    const [firstResult, setFirstResult] = useState([])
    const [results, setResults] = useState([])
    const [seeAlso, setSeeAlso] = useState([])
    const [links, setLinks] = useState([])
    const [dictCount, setDictCount] = useState(0);
    const [isResultsActive, setIsResultsActive] = useState(false);
    const [isSeeAlsoActive, setIsSeeAlsoActive] = useState(false);
    const [isLinksActive, setIsLinksActive] = useState(false);
    const [pageContent, setPageContent] = useState('N/A');
    const [currURL, setCurrURL] = useState('');
    const [motherTounge, setMotherTounge] = useState('de')
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [sectionNum, setSectionNum] = useState(0);
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);
    const {user, setUser} = useContext(UserContext);
    const seeAlsoText = ["See also", "Siehe auch", "Voir aussi", "Voci correlate"]

    /**
     * looks if the language was already set and fetches it from local storage
     */
    useEffect(() =>{
        if(localStorage.getItem("Language") != 'en'){
            setTargetLanguage(localStorage.getItem("Language"))
        }
        if(localStorage.getItem("Mothertounge") != 'de'){
            setMotherTounge(localStorage.getItem("Mothertounge"))
        }
    })

    /**
     * fetches the current dictionary from localstorage
     */
    useEffect(() =>{
        if(dictCount >= 0 && results !== null){
        const obj = {Term: term, Translation: translatedTerm,Targetlanguage: targetLanguage, Link: firstResult.title}
        if(value != null){
        setValue(oldArr => [...oldArr,obj])
            localStorage.setItem("Vocabulary", JSON.stringify(value));
            sendLog('pushToDictionary');
        
        }else{
            setValue([obj])
                localStorage.setItem("Vocabulary", JSON.stringify(obj));
                sendLog('pushToDictionary');
                console.log("First item in dictionary: " + JSON.stringify(obj))
            
        }
    }
    }, [dictCount])

    /**
     * translates the fetched term and saves it to state
     */
    useEffect(() =>{
            let data = {
                q : term,
                source: motherTounge,
                target: targetLanguage
            }
            axios.post(`https://libretranslate.de/translate`, data)
            .then((response) => {
               // console.log("libretranslate: " + response.data.translatedText)
                setTranslatedTerm(response.data.translatedText);
                localStorage.setItem("Translation", response.data.translatedText);
            }) 
    
    })

    /**
     * fetches h1 from chrome storage 
     */
    useEffect(() =>{
        chrome.storage.sync.get("visitedPages",function (changes) {
            if((pageContent !== changes.visitedPages.pageText) && (changes.visitedPages !== null)) {
                setPageContent(changes.visitedPages.pageText)
                setTerm(changes.visitedPages.pageText)
                console.log("New Term:",changes.visitedPages.pageText);
                sendLog('Term fetched from H1');
        }}
        )
    },[])

    useEffect(() =>{
        chrome.storage.sync.get("currentURL",function (changes) {
            if((currURL !== changes.currentURL.location) && (changes.currentURL.location !== null)){
            setCurrURL(changes.currentURL.location)
            sendLog('URL changed to ' + changes.currentURL.location);
        }}
        )
    },[])

    /**
     * fetches the search terms from youtube and google 
     */
    useEffect(() =>{
        chrome.storage.sync.get("searchParams",function (changes) {
            if(changes.searchParams.params !== null){
            const queryParams = new URLSearchParams(changes.searchParams.params);
            const searchTerm = queryParams.get('q');
            const ytSearchTerm = queryParams.get('search_query');
            if(searchTerm !== null){
                setTerm(searchTerm);
            }
            if(ytSearchTerm !== null){
                setTerm(ytSearchTerm);
            }
            console.log(ytSearchTerm);
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
                        //console.log(resp.data);
                        setTextInfo(resp.data)
                    });
        });
    });
    });


    //search terms and descriptions
    useEffect(() => {
        //search Wikipedia API
        const search = async () => {
            const { data } = await axios.get(`https://${targetLanguage}.wikipedia.org/w/api.php`, {
                params: {
                    action: "query",
                    list: "search",
                    origin: "*",
                    format: "json",
                    srsearch: translatedTerm,
                },
            })
            if(data != null){
            setResults(data.query.search)
            let arr = data.query.search;
            setFirstResult(arr[0]);
            }
            
        }
        if (translatedTerm && !results.length){
            search();
            
        }else{
        let timeoutID = setTimeout(() =>{
        if(translatedTerm){
        search()
        
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [translatedTerm])



/**
 * 
 * @returns fetches sections of the wikipedia article
 */
    const searchSA = async () => {
        return await axios.get(`https://${targetLanguage}.wikipedia.org/w/api.php`, {
            params: {
                action: "parse",
                prop: "sections",
                format: "json",
                origin: "*",
                page: translatedTerm,
            },
        })}
        
/**
 * 
 * @returns fetches see Also section of the wikipedia article
 */
    const searchSA2 = async () => {
        return await axios.get(`https://${targetLanguage}.wikipedia.org/w/api.php`, {
            params: {
                action: "parse",
                prop: "text",
                format: "json",
                origin: "*",
                page: translatedTerm,
                section: sectionNum
            },
        })}

    //search "see also" e.g. https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&prop=sections
    // and then https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&section=42
    useEffect(() => {
        //search Wikipedia API
        if (translatedTerm && !seeAlso.length && firstResult){
            searchSA()
                .then(data=>{
                    try{
                console.log(data.data);
               // console.log('See also state:' + seeAlso);
                const sections = data.data.parse.sections;
               // console.log("sections of article "+ data.data.parse.sections)
                //Check if there is a See Also section
                for(var i=0; i < sections.length; i++){
                    if(sections[i].line == seeAlsoText[0] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[2] || sections[i].line == seeAlsoText[3]){
                        console.log(sections[i].index);
                        //console.log(i);
                        //section = i;
                        var secNum = sections[i].index;
                        console.log("This is var secNum:" + secNum);
                        setSectionNum(secNum);
                    }
                }}
                catch(err){console.log(err)}
                })
            searchSA2()
                .then(data=>{
                    console.log("Sec num now " + sectionNum)
                    console.log(data.data)
                    if(data.data.parse.text["*"]){
                    console.log("See Also: " + data.data.parse);
                    //console.log("See Also parsed " +data.data.parse.text["*"]);
                    setSeeAlso(parse(`<div className="seeAlso">${data.data.parse.text["*"]}</div>`));
                    }
                    else{
                        setSeeAlso(parse(`<div className="seeAlso">No "See also" section found for ${translatedTerm}</div>`))
                    }
                
            }).catch(error => console.log(error))
    }
}, [translatedTerm])  
                
            
   

    //search links
    useEffect(() => {
        //search Wikipedia API
        const searchLinks = async () => {
            const { data } = await axios.get(`https://${targetLanguage}.wikipedia.org/w/api.php`, {
                params: {
                    action: "query",
                    prop: "links",
                    format: "json",
                    origin: "*",
                    titles: translatedTerm,
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
        if (translatedTerm){
            searchLinks();
        }else{
        let timeoutID = setTimeout(() =>{
        if(translatedTerm){
        searchLinks()
        }
    },1000);
    return () =>{
        clearTimeout(timeoutID);
    }
}
    }, [translatedTerm])



    const searchResultsMapped = 
    
    results && results.slice(1,3).map(result =>{
        return(
            
            <div className="item" key={result.pageid}>
                <div className="content">
                    <h3 className="header">{result.title}</h3>
                    <span className='link'><a target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${result.title}`}>{`https://${targetLanguage}.wikipedia.org/wiki/${result.title}`}</a></span><br/>
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
            <span className='link'><a target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </div>
        )
    })

    const handleTargetLanguage = (event) => {
        setTargetLanguage(event.target.value);
        sendLog('changedTargetLanguage');
        localStorage.setItem("Language", event.target.value)
    };

    const handleMotherTounge = (event) => {
        setMotherTounge(event.target.value);
        sendLog('changedMotherTounge');
        localStorage.setItem("Mothertounge", event.target.value)
    };

    const addToDictionary = () =>{
        localStorage.setItem("putIntoDictionary", term);
        localStorage.setItem("putTranslationIntoDictionary", translatedTerm)
    }

    const sendLog = (action) =>{
        let timestamp = new Date();
            let dictionaryData = {
                user: user,
                timestamp: timestamp,
                action: action,
                word: term,
                translation: translatedTerm,
                mothertounge: motherTounge,
                targetlanguage: targetLanguage,
            }
            axios
                .post("http://localhost:3000/addLog", dictionaryData)
                .then(data => console.log(data))
                .catch(error => console.log(error))
        
    }

    const pushToDictionary = () =>{
        setDictCount(dictCount + 1);
    }


    return(
      <div>
          <div className="ui-form">
              <div className="field">
              <div className="langDropdowns">
              <div id="langselect"><label>
                        <select value={motherTounge} onChange={handleMotherTounge}>
                        <option value="en">EN</option>
                        <option value="de">DE</option>
                        <option value="fr">FR</option>
                        <option value="it">IT</option>
                        </select>
                  </label></div>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size="2x" 
                    color="#B2BFC7" 
                    className="langFromTo"
                  />
                  <div id="langselect"><label>
                        <select value={targetLanguage} onChange={handleTargetLanguage}>
                        <option value="en">EN</option>
                        <option value="de">DE</option>
                        <option value="fr">FR</option>
                        <option value="it">IT</option>
                        </select>
                  </label></div>
                  </div>
                  <div className="translationForm">
                  <div id="search"> 
                  <input className="input"
                  id="searchfield"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  />
                  </div>
                 <div className="translation">{translatedTerm}</div>
                 <FontAwesomeIcon onClick={pushToDictionary} icon={faCirclePlus} size="2x" color="#B2BFC7" className="addToDict"/>
                 </div>
                 {results && firstResult ? 
                <div className="firstResult" key={firstResult.pageid}>
                <div className="content">
                    <h3 className="header">{firstResult.title}</h3>
                    <span className='link'><a target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${firstResult.title}`}>{`https://${targetLanguage}.wikipedia.org/wiki/${firstResult.title}`}</a></span><br/>
                    <span dangerouslySetInnerHTML={{__html:firstResult.snippet}}></span>

                </div>
                </div>
                :
                 <div></div>}
              </div>
          </div>

    <React.Fragment>
      <div className="accordion">
        <div className="accordion-item">
          <div className="accordion-title" onClick={()=> setIsResultsActive(!isResultsActive)}>
            <h3>Get inspired to learn more:</h3>
            <div className="plusSign">{isResultsActive ? '-' : '+'}</div>
          </div>
          
          {isResultsActive ? <div className="accordion-content ui celled list"><h2>More Articles</h2>{searchResultsMapped}</div> : <div></div>}
          
          {isResultsActive && seeAlso ? <div className="accordion-content"><h2>See Also</h2>{seeAlso}</div> : <div></div>}
          
          {isResultsActive && linksInArticle ? <div className="accordion-content"><h2>Related Links</h2>{linksInArticle}</div> : <div></div>}
        </div> 
    </div>
    </React.Fragment>
          
          
      </div>
      )

}

export default Search;
