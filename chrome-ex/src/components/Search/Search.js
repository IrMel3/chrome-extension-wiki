/* global chrome */

import React, {useState, useEffect, useContext} from 'react';
import './Search.css';
import axios from 'axios';
import $ from 'jquery';
import BasicCard from '../Cards/BasicCard'
import Alerts from '../Alerts/Alerts'
import { DictionaryContext } from '../Contexts/DictionaryContext';
import Card from '@mui/material/Card';
import { FormControl, InputLabel, Select, MenuItem, Tooltip} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faCirclePlus,
  } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../Contexts/UserContext';
var parse = require('html-react-parser');

//needs to be put outside of component - prevents nav from opening new tab, and opens every other link in new tab
$(document).on('click', 'a', function(e){ 
    e.preventDefault(); 
    var url = $(this).attr('href'); 
    if(!(url.includes("index.html#/")) && (!(url.includes("/index.html#/dictionary")))){
    window.open(url, '_blank');    
}
});

/**
 * Home page of the app with translator, save vocab to favourites,
 * suggested Wiki- articles and other Wiki links
 * 
 */

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
    const [searchTerm, setSearchTerm] = useState('')
    const [pageContent, setPageContent] = useState('N/A');
    const [currURL, setCurrURL] = useState('');
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    //const [motherTounge, setMotherTounge] = useState('DE')
    //const [targetLanguage, setTargetLanguage] = useState('EN');
    const [motherTounge, setMotherTounge] = useState("de")
    const [targetLanguage, setTargetLanguage] = useState("en");
    const [sectionNum, setSectionNum] = useState(0);
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);
    const {user, setUser} = useContext(UserContext);
    const seeAlsoText = ["See also", "Siehe auch", "Voir aussi", "Voci correlate", "Véase también"]

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
    },[])

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
    },[])

    /**
     * saves dictionary entry to db when "add to favourites" is clicked
     */
    const addDictionaryEntryToDB =() =>{
        let timestamp = new Date();
        let newEntry = {
            user: user,
            timestamp: timestamp,
            app: "search",
            term: term,
            translation: translatedTerm,
            mothertounge: motherTounge,
            targetlanguage: targetLanguage,
            link: firstResultTitle
        }
        axios
            .post("https://pwp.um.ifi.lmu.de/g20/addToDictionary", newEntry)
            .then(data => {if(data.status == 200){
              showAlert("success", "Success", "Successfully saved "+ term +"-"+ translatedTerm +" to favourites.");
               }
                
            })
            .catch(error => {console.log(error)
               showAlert("error", "Error", "Something went wrong. Please reload the page and try again."); }
               
            )
    }


    /**
     * fetches the current dictionary from localstorage
     */
    const pushToDictionary = () =>{
        if(term !== null && results !== null){
        const obj = {Term: term, Translation: translatedTerm,Targetlanguage: targetLanguage, Link: firstResultTitle}
        addDictionaryEntryToDB();
        if(value == []){
            setValue([obj])
            localStorage.setItem("Vocabulary", JSON.stringify(obj));
            sendLog('Add first Word to Dictionary',localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
    
        }else{
            setValue(oldArr => [...oldArr,obj])
            localStorage.setItem("Vocabulary", JSON.stringify(value));
            sendLog('Add Word to Dictionary', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
            
        }
    }}

    /**
     * translates the fetched term and saves it to state
     */
   /* useEffect(() =>{
            if(motherTounge==""){setMotherTounge('de')}
            if(targetLanguage==""){setTargetLanguage('en')}
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
    
    },[term, targetLanguage, motherTounge])*/

    /**
     * request to translate with deepl API
     */
    useEffect(() =>{
        let data = {
            text : term,
            target_lang: targetLanguage,
            auth_key: '',
        }

        const key = '687d7f51-03a2-53b7-5085-6260d3029ed4:fx';
        
        //const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.REACT_APP_DEEPL_KEY}&text=${term}&source_lang=${motherTounge}&target_lang=${targetLanguage}`
        const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${key}&text=${term}&source_lang=${motherTounge}&target_lang=${targetLanguage}`

        axios.get(deeplUrl)
        .then((response) => {
            setTranslatedTerm(response.data.translations[0].text);
            localStorage.setItem("Translation", response.data.translations[0].text);
        })
        .catch(err=> console.log(err)) 
        
    },[term, targetLanguage, motherTounge])

    /**
     * fetches current h1 from chrome storage 
     */
  /*  useEffect(() =>{
        chrome.storage.sync.get("visitedPages",function (changes) {
            if((pageContent !== changes.visitedPages.pageText) && (changes.visitedPages !== null)) {
                setPageContent(changes.visitedPages.pageText)
                setTerm(changes.visitedPages.pageText)
                localStorage.setItem("Term", changes.visitedPages.pageText);
                console.log("New Term:",changes.visitedPages.pageText);
                sendLog('New Term fetched from H1', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }}
        )
    },[])*/

    /**
     * checks when URL has changed and sends log to DB
     */
   /* useEffect(() =>{
        chrome.storage.sync.get("currentURL",function (changes) {
            if((currURL !== changes.currentURL.location) && (changes.currentURL.location !== null)){
            //setCurrURL(changes.currentURL.location)
            sendLog('URL changed', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }}
        )
    },[])*/

    /**
     * fetches the search terms from youtube and google 
     */
  /*  useEffect(() =>{
        chrome.storage.sync.get("searchParams",function (changes) {
            if(changes.searchParams.params !== null){
            const queryParams = new URLSearchParams(changes.searchParams.params);
            const searchTerm = queryParams.get('q');
            const ytSearchTerm = queryParams.get('search_query');
            if(searchTerm !== null){
                setTerm(searchTerm);
                localStorage.setItem("Term", searchTerm);
                sendLog('New Term fetched from Google Search', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
                
            }
            if(ytSearchTerm !== null){
                setTerm(ytSearchTerm);
                localStorage.setItem("Term", ytSearchTerm);
                sendLog('New Term fetched from Youtube Search', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
                
            }
            console.log(ytSearchTerm);
        }}
        )
    },[])*/
    

  /*  useEffect(() => {
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
                        setTextInfo(resp.data)
                    });
        });
    });
    }); */

    //fetch terms and descriptions from wikipedia api
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
            if(data.query.search.length != 0){
            setResults(data.query.search)
            let arr = data.query.search;
            let title = data.query?.search[0]?.title
            setFirstResult(arr[0]);
            setFirstResultTitle(title)
            }else{
                setResults([]);
            }
        }
        if (translatedTerm && !results.length && targetLanguage!=undefined){
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
 ** @returns fetches sections of the first found wikipedia article
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
 * @returns fetches see Also section of the first found wikipedia article
 */
    const searchSA2 = async () => {
        return await axios.get(`https://${targetLanguage}.wikipedia.org/w/api.php`, {
            params: {
                action: "parse",
                prop: "text",
                format: "json",
                page: firstResultTitle,
                section: sectionNum
            },
        })}

    /**
     * if links are internal chrome extension links, make them wikipedia links
     */
    useEffect(() =>{
    var anchors = document.getElementsByTagName("a");
    var currID = chrome.runtime.id;

    for (var i = 0; i < anchors.length; i++) {
       if(anchors[i].href.startsWith('chrome')){
            anchors[i].href= `https://${targetLanguage}.wikipedia.org` + anchors[i].href.replace(`chrome-extension://${currID}`,'')
        }
        
    }})

    /**
     * fetch sections of the first article 
     */
    //search "see also" e.g. https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&prop=sections
    // and then https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&section=42
    useEffect(() => {
        //search Wikipedia API
        if (translatedTerm && !seeAlso.length && firstResult){
            searchSA()
                .then(data=>{
                try{
                if(!data.data.error){
                setSections(data.data.parse.sections);
                //Check if there is a See Also section
                }else{
                    setSections([])
                }
            }catch(err){console.log(err)}
                })
    }
}, [firstResultTitle])  

/**
 * check if fetched sections have a "see also" section
 */
const searchSectionsForSeeAlso = () =>{
    if(sections.length !== null){
    for(var i=0; i < sections.length; i++){
        if(sections[i].line == seeAlsoText[0] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[2] || sections[i].line == seeAlsoText[3] || sections[i].line == seeAlsoText[4]){
            var secNum = sections[i].index;
            setSectionNum(secNum);
        }
    }}
}

useEffect(() =>{
    searchSectionsForSeeAlso()
},[sections])

/**
 * extract the see also section, if there is one
 */
useEffect(() =>{
    searchSA2()
    .then(data=>{
        if(!data.data.error && sectionNum!=0){
        setSeeAlso(parse(`<div className="seeAlso nodeco" id="seeAlso" onClick=${handleSAClick}>${data.data.parse.text["*"]}</div>`));
        }
        else{
            setSeeAlso([])
        }
    
}).catch(error => console.log(error))
},[sectionNum])

   
   /**
    * attempt to shuffle all links in the wiki article and to show 10 random ones
    * not working
    */
   const shuffleData = (data) =>{
    let randomGroupSortKey = {}
    data.forEach(d => randomGroupSortKey[d.title] = Math.random())
    
    //add the sortKey property to the individual array entries
    let dataSortable = data.map(x => {
      return {
        ...x, 
        sortKey: randomGroupSortKey[x.title]
      }
    })
    
    dataSortable.sort((a, b) => a.sortKey - b.sortKey) //sort the groups
    
   }
            
   
   /**
    * fetch first 10 links from wiki article
    */
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
                    pllimit: "10", 
                },
            })
            if(data?.query?.pages){  //!=undefined
            const keys = Object.keys(data.query.pages)
            if(data != null){
            setLinks(data.query.pages[keys[0]].links)
            //shuffleData(links);
            localStorage.setItem("Term", term);
            }}else{
                setLinks([])
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
    }, [firstResultTitle, targetLanguage])

    /**
     * shows alert
     * @param {*} type 
     * @param {*} title 
     * @param {*} message 
     */
    const showAlert = (type, title, message) =>{
        setAlertOpen(true);
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message)

        const timeId = setTimeout(() => {
            // After 5 seconds set the show value to false
            setAlertOpen(false)
          }, 5000)
      
          return () => {clearTimeout(timeId)}
    }

    const handleAlertClose = () => {
        setAlertOpen(false)
    }
 
    /**
     * handles Wiki cards click on left arrow
     */
    const slideLeft = () => {
        if (index - 1 >= 0) {
          setIndex(index - 1);
          sendLog("Click Wiki Card Left - Title now: " + results[index-1].title, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
     
        }
      };

      /**
     * handles Wiki cards click on right arrow
     */
    const slideRight = () => {
    if (index < 2) {
        setIndex(index + 1);
        sendLog("Click Wiki Card Right - Title now: " + results[index+1].title, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
    }
    };

    
    const handleclick = (index) =>{
        sendLog("clicked on Wikicard " + results[index].title, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    const handleLinkClick = (index) =>{
        sendLog("clicked on suggested Link " + links[index].title, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    const handleSAClick = () =>{
        sendLog("clicked on See Also Link" , localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    /**
     * check for click on see also to send log (not possible to grab the single link items in that section)
     */
    const div = document.getElementById("seeAlso")
    div?.addEventListener('click' , () => {
        handleSAClick();
    })

    /**
     * display Wiki Cards
     */
    const searchResultsMapped2 =    
    (results!=null) && results.slice(0,3).map((result,n) =>{
        let position = n > index ? "nextCard" : n === index ? "activeWikiCard" : "prevCard";

        return(
            <div className="container" onClick={() => {handleclick(n);}} key={n}>
           <BasicCard {...result} targetLanguage={targetLanguage} cardStyle={position}/>
            </div>
            
        )
    }
    ) 

    /**
     * display links
     */
    const linksInArticle = 

    links && links.map((link,index) =>{
        return (
            <li onClick={() => {handleLinkClick(index);}} key={index}>
            <span className='link'><a className="nodeco"target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </li>
        )
    })

    /**
     * handle change of target language
     * @param {} event 
     */
    const handleTargetLanguage = (event) => {
        setTargetLanguage(event.target.value);
        sendLog('changed target Language to ' + event.target.value, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        localStorage.setItem("Language", event.target.value)
    };

    /**
     * handle change of mother tounge
     * @param {} event 
     */
    const handleMotherTounge = (event) => {
        setMotherTounge(event.target.value);
        sendLog('changed Mother Tounge to ' + event.target.value, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        localStorage.setItem("Mothertounge", event.target.value)
    };

    /**
     * sends logs
     * @param {*} action 
     * @param {*} term 
     * @param {*} translatedTerm 
     * @param {*} motherTounge 
     * @param {*} targetLanguage 
     */
    const sendLog = (action, term, translatedTerm, motherTounge, targetLanguage) =>{
        let timestamp = new Date();
            let dictionaryData = {
                user: user,
                timestamp: timestamp,
                action: action,
                app: "search",
                word: term,
                translation: translatedTerm,
                mothertounge: motherTounge,
                targetlanguage: targetLanguage,
            }
            axios
                .post("https://pwp.um.ifi.lmu.de/g20/addLog", dictionaryData)
               // .then(data => console.log(data))
                .catch(error => console.log(error))
        
    }

    /**
     * gives user time to put term into search field before log is sent
     */
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          if(searchTerm !== ''){
          sendLog("Input to search field: " + searchTerm, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))}
        }, 3000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [searchTerm])


    return(
      <div>
          <div className="ui-form">
              <div className="field">
              <Alerts className="alert" type={alertType} message={alertMessage} title={alertTitle} isOpen={alertOpen} handleClose={handleAlertClose}></Alerts>
              <Card className="translationBox" sx={{backgroundColor: "#e7f4fd",borderRadius: "15px"}}>
              <div>
              <div className="langDropdowns">
              <FormControl sx={{ m: 1, maxWidth: 120 }} size="small" variant="standard">
                <InputLabel id="demo-simple-select-label" sx={{overflow:"visible"}}>From</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={motherTounge}
                    defaultValue="de"
                    label="Mother tounge"
                    onChange={handleMotherTounge}
                    sx={{left: "5px"}}
                >
                    
                    <MenuItem key="en" value="en">EN</MenuItem>
                    <MenuItem key="de" value="de">DE</MenuItem>
                    <MenuItem key="fr" value="fr">FR</MenuItem>
                    <MenuItem key="it" value="it">IT</MenuItem>
                <MenuItem key="es" value="es">ES</MenuItem>               
                </Select>
              </FormControl>
                  <div id="search">    
                  <input className="input"
                  id="searchfield"
                  value={term}
                  onChange={function(e){setTerm(e.target.value); setSearchTerm(e.target.value);}}
                  />
                  </div>                 
                  </div>    
                  <div className="divider">
                  <hr class="solid"></hr>
                  </div>              
                  <div className="translationForm">
                  <FormControl sx={{ m: 1, maxWidth: 120 }} size="small" variant="standard">
                <InputLabel id="demo-simple-select-label" sx={{overflow:"visible"}}>To</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={targetLanguage}
                    defaultValue="en"
                    label="Target Language"
                    onChange={handleTargetLanguage}
                    sx={{left: "5px"}}
                >
                    
                    <MenuItem key="en" value="en">EN</MenuItem>
                    <MenuItem key="de" value="de">DE</MenuItem>
                    <MenuItem key="fr" value="fr">FR</MenuItem>
                    <MenuItem key="it" value="it">IT</MenuItem>
                    <MenuItem key="es" value="es">ES</MenuItem>
                 { /*  <MenuItem value="EN" selected>EN</MenuItem>
                    <MenuItem value="DE">DE</MenuItem>
                    <MenuItem value="FR">FR</MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                     <MenuItem value="ES">ES</MenuItem> */}
                </Select>
              </FormControl>
                 <div className="translation">{translatedTerm}</div>
                 </div>
                 <Tooltip title="Add to favourites">
                 <FontAwesomeIcon onClick={pushToDictionary} icon={faCirclePlus} size="2x" color="#B2BFC7" className="addToDict"/>
                 </Tooltip>
            </div>
            </Card>
            {(results?.length>0) ? (
            <div>
            <div className="carousel">
            <Tooltip title="Previous">
                <FontAwesomeIcon
            onClick={slideLeft}
            className="leftWikiBtn"
            icon={faCaretLeft}
            size="2x"
            color="#B2BFC7"
             /></Tooltip>
            <div className="card-container">
            {searchResultsMapped2}
            </div>
            <Tooltip title="Next">
            <FontAwesomeIcon
                onClick={slideRight}
                className="rightWikiBtn"
                icon={faCaretRight}
                size="2x"
                color="#B2BFC7"
            /></Tooltip>
              </div>
              <div>{index+1}/3</div></div>): <div>Sorry, no results for "{translatedTerm}"</div>}
          </div>
          </div>
          {(links?.length>0) ?(
          <div className="getInspired">
          <div className="inspired">Get inspired to learn more...</div>
          <div className="divider"><hr class="solid"></hr></div>
          <div id="SA">{seeAlso}</div>
          <div className="linksWrap"><ul>{linksInArticle}</ul></div></div>):<div>Sorry, no  suggestions for "{translatedTerm}"</div>}
          </div>
      
      )

}

export default Search;
