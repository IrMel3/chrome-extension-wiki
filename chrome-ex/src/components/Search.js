/* global chrome */

import React, {useState, useEffect, useContext, useRef} from 'react';
import './Search.css';
import axios from 'axios';
import $ from 'jquery';
import WikiCard from "./WikiCard";
import { DictionaryContext } from './DictionaryContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faChevronRight,
    faCirclePlus,
  } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from './UserContext';
var parse = require('html-react-parser');


const Search = () => { 
  
    const [term, setTerm] = useState(localStorage.getItem("Term") || "")
    const [translatedTerm, setTranslatedTerm] = useState(localStorage.getItem("Translation") || "")
    const [firstResult, setFirstResult] = useState([])
    const [firstResultTitle, setFirstResultTitle] = useState("")
    const [results, setResults] = useState([])
    const [sections, setSections] = useState([])
    const [seeAlso, setSeeAlso] = useState([])
    const [links, setLinks] = useState([])
    const [index, setIndex] = useState(0)
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
     * set languages to local storage
     */
    useEffect(() =>{
        if(localStorage.getItem("Language") == null){
            localStorage.setItem("Language", 'en')
        }
        if(localStorage.getItem("Mothertounge") == null){
            localStorage.setItem("Mothertounge", 'de')
        }
        if(localStorage.getItem("Vocabulary") == null){
            localStorage.setItem("Vocabulary", [])
        }
    })

    const addDictionaryEntryToDB =() =>{
        let timestamp = new Date();
        let newEntry = {
            user: user,
            timestamp: timestamp,
            term: term,
            translation: translatedTerm,
            mothertounge: motherTounge,
            targetlanguage: targetLanguage,
            link: firstResultTitle
        }
        axios
            .post("http://localhost:3000/addToDictionary", newEntry)
            .then(data => console.log(data))
            .catch(error => console.log(error))
    }


    /**
     * fetches the current dictionary from localstorage
     */
   // useEffect(() =>{
    const pushToDictionary = () =>{
        if(term !== null && results !== null){
        const obj = {Term: term, Translation: translatedTerm,Targetlanguage: targetLanguage, Link: firstResultTitle}
        addDictionaryEntryToDB();
        if(value == []){
            setValue([obj])
            localStorage.setItem("Vocabulary", JSON.stringify(obj));
            sendLog('pushToDictionary(first)');
            console.log("First item in dictionary: " + JSON.stringify(obj))
    
        }else{
            setValue(oldArr => [...oldArr,obj])
            localStorage.setItem("Vocabulary", JSON.stringify(value));
            sendLog('pushToDictionary');
            
        }
    }}
  //  }, [dictCount])

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
                localStorage.setItem("Term", changes.visitedPages.pageText);
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
                localStorage.setItem("Term", searchTerm);
                
            }
            if(ytSearchTerm !== null){
                setTerm(ytSearchTerm);
                localStorage.setItem("Term", ytSearchTerm);
                
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

  /*  useEffect(() =>{
        if(results !== null){
            setFirstResult(results[0].title)
        }
    },[results])*/


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
            let title = data.query.search[0].title
            setFirstResult(arr[0]);
            setFirstResultTitle(title)
            console.log(title);
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
    }, [translatedTerm, targetLanguage, motherTounge])



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
                page: firstResultTitle,
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
                //origin: "*",
                page: firstResultTitle,
                section: sectionNum
            },
        })}

  /*  var arr = [], l = document.links;
    for(var i=0; i<l.length; i++) {
        arr.push(l[i].href);
        if(arr[i].startsWith('chrome-extension://kbjambaljfpmbadpgmclckcfolhpliea')){
            arr[i].replace('chrome-extension://kbjambaljfpmbadpgmclckcfolhpliea', 'https://en.wikipedia.org')
        }

        console.log(arr);
    }*/
    
    //oh mein Gott es funktioniert -put in useEffekt

    useEffect(() =>{
    var anchors = document.getElementsByTagName("a");

    for (var i = 0; i < anchors.length; i++) {
       if(anchors[i].href.startsWith('chrome')){
            anchors[i].href= `https://${targetLanguage}.wikipedia.org` + anchors[i].href.replace('chrome-extension://kbjambaljfpmbadpgmclckcfolhpliea','')
            console.log(anchors[i].href)
        }
        
    }})

  /*  $(document).on('click', 'a', function(e){ 
        e.preventDefault(); 
        var url = $(this).attr('href'); 
        window.open(url, '_blank');
    });*/


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
                setSections(data.data.parse.sections);
               // console.log("sections of article "+ data.data.parse.sections)
                //Check if there is a See Also section
                }
                catch(err){console.log(err)}
                })
    }
}, [firstResultTitle])  

const searchSectionsForSeeAlso = () =>{
    if(sections.length !== null){
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
}

useEffect(() =>{
    searchSectionsForSeeAlso()
},[sections])

    useEffect(() =>{
        searchSA2()
        .then(data=>{
            console.log("Sec num now " + sectionNum)
            console.log(data.data)
            if(data.data.parse.text["*"]){
            console.log("See Also: " + data.data.parse);
            //console.log("See Also parsed " +data.data.parse.text["*"]);
            setSeeAlso(parse(`<div className="seeAlso nodeco">${data.data.parse.text["*"]}</div>`));
            }
            else{
                setSeeAlso(parse(`<div className="seeAlso">No "See also" section found for ${translatedTerm}</div>`))
            }
        
    }).catch(error => console.log(error))
    },[sectionNum])
                
            
   

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
                    titles: firstResultTitle,
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
    }, [firstResultTitle])

    //for Cards

    const slideLeft = () => {
        if (index - 1 >= 0) {
          setIndex(index - 1);
        }
      };
    
      const slideRight = () => {
        if (index < 2) {
          setIndex(index + 1);
        }
      };



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


    const searchResultsMapped2 =    
    results && results.slice(0,3).map((result,n) =>{
        let position = n > index ? "nextCard" : n === index ? "activeWikiCard" : "prevCard";

        return(
            <div className="container">
               <WikiCard {...result} targetLanguage={targetLanguage} cardStyle={position}></WikiCard> 
            </div>
            
        )
    }
    )



    const linksInArticle = 
    
    links && links.map(link =>{
        return (
            <li>
            <span className='link'><a className="nodeco"target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </li>
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

  /*  const pushToDictionary = () =>{
        setDictCount(dictCount + 1);
    }*/


    return(
      <div>
          <div className="ui-form">
              <div className="field">
              <div className="translationBox">
              <div className="langDropdowns">
              <div id="langselect"><label>
                        <select value={motherTounge} onChange={handleMotherTounge}>
                        <option value="en">EN</option>
                        <option value="de" selected>DE</option>
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
                        <option value="en" selected>EN</option>
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
                 <FontAwesomeIcon onClick={pushToDictionary} title="Add to dictionary" icon={faCirclePlus} size="2x" color="#B2BFC7" className="addToDict"/>
                 </div>
            </div>
            <div className="carousel">
                <FontAwesomeIcon
            onClick={slideLeft}
            className="leftBtn"
            icon={faCaretLeft}
            size="2x"
            color="#B2BFC7"
             />
            <div className="card-container">
            {searchResultsMapped2}
            </div>
            <FontAwesomeIcon
                onClick={slideRight}
                className="rightBtn"
                icon={faCaretRight}
                size="2x"
                color="#B2BFC7"
            />
              </div>
          </div>
          </div>
          <div>{index+1}/3</div>
          <div className="getInspired">
          <div>{seeAlso}</div>
          <div className="linksWrap"><ul>{linksInArticle}</ul></div>
          </div>
      </div>
      )

}

export default Search;
