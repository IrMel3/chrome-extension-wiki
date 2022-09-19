/* global chrome */

import React, {useState, useEffect, useContext, useRef} from 'react';
import './Search.css';
import axios from 'axios';
import $ from 'jquery';
import WikiCard from "./WikiCard";
import BasicCard from './BasicCard'
import Alerts from './Alerts/Alerts'
import { AlertContainer, alert } from 'react-custom-alert';
import Chip from "@mui/material/Chip";
import { DictionaryContext } from './DictionaryContext';
import Card from '@mui/material/Card';
import { FormControl, InputLabel, Select, MenuItem, Alert, TextField, Tooltip,Typography} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faCirclePlus,
  } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from './UserContext';
var parse = require('html-react-parser');

//needs to be put outside of component
$(document).on('click', 'a', function(e){ 
    e.preventDefault(); 
    var url = $(this).attr('href'); 
    if((url !== "https://en.wikipedia.org/index.html#/") && (url !== "https://en.wikipedia.org/index.html#/dictionary")){
    window.open(url, '_blank');    
}
});


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
    const [callAlert, setCallAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [prevMsg, setPrevMsg] = useState('');
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
   /* useEffect(() =>{
        if(localStorage.getItem("Language") != 'en'){
            setTargetLanguage(localStorage.getItem("Language"))
        }
        if(localStorage.getItem("Mothertounge") != 'de'){
            setMotherTounge(localStorage.getItem("Mothertounge"))
        }
    },[])*/

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
            .then(data => {if(data.status == 200){
                //alert({message: "Successfully saved ",type: 'success'})
              // alert( "Successfully saved " + term +"-"+ translatedTerm +" to favourites.")
               showAlert("success", "Success", "Successfully saved "+ term +"-"+ translatedTerm +" to favourites.");
                  //  {<Alerts type="success" title="Success" message="Successfully saved"></Alerts>}
                }
                
            })
            .catch(error => {console.log(error)
               // alert("Something went wrong. Please reload the page and try again.")}
                showAlert("error", "Error", "Something went wrong. Please reload the page and try again."); }
               
            )
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
            sendLog('Add first Word to Dictionary',localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
            console.log("First item in dictionary: " + JSON.stringify(obj))
    
        }else{
            setValue(oldArr => [...oldArr,obj])
            localStorage.setItem("Vocabulary", JSON.stringify(value));
            sendLog('Add Word to Dictionary', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
            
        }
    }}
  //  }, [dictCount])

    /**
     * translates the fetched term and saves it to state
     */
    useEffect(() =>{
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
    
    },[term, targetLanguage])

    /**
     * request to deepl API
     */
   /* useEffect(() =>{
        let data = {
            text : term,
            target_lang: targetLanguage,
            auth_key: '',
        }
        
        const deeplUrl = `https://api-free.deepl.com/v2/translate?auth_key=${process.env.REACT_APP_DEEPL_KEY}&text=${term}&source_lang=${motherTounge}&target_lang=${targetLanguage}`

        axios.get(deeplUrl)
        .then((response) => {
            console.log("deepL: " + response.data.translations[0].text)
            setTranslatedTerm(response.data.translations[0].text);
            localStorage.setItem("Translation", response.data.translations[0].text);
        })
        .catch(err=> console.log(err)) 
        
    },[term, targetLanguage])*/

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
                sendLog('New Term fetched from H1', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }}
        )
    },[])

    useEffect(() =>{
        chrome.storage.sync.get("currentURL",function (changes) {
            if((currURL !== changes.currentURL.location) && (changes.currentURL.location !== null)){
            setCurrURL(changes.currentURL.location)
            sendLog('URL changed', localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
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
            console.log(data.query.search)
            if(data.query.search.length != 0){
            setResults(data.query.search)
            let arr = data.query.search;
            let title = data.query?.search[0]?.title
            setFirstResult(arr[0]);
            setFirstResultTitle(title)
            console.log(title);
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
           // console.log(anchors[i].href)
        }
        
    }})

    


    //search "see also" e.g. https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&prop=sections
    // and then https://en.wikipedia.org/w/api.php?action=parse&page=Pune&format=json&section=42
    useEffect(() => {
        //search Wikipedia API
        if (translatedTerm && !seeAlso.length && firstResult){
            searchSA()
                .then(data=>{
                try{
                if(!data.data.error){
                console.log(data.data);
               // console.log('See also state:' + seeAlso);
                setSections(data.data.parse.sections);
               // console.log("sections of article "+ data.data.parse.sections)
                //Check if there is a See Also section
                }else{
                    setSections([])
                }
            }catch(err){console.log(err)}
                })
    }
}, [firstResultTitle])  

const searchSectionsForSeeAlso = () =>{
    if(sections.length !== null){
    for(var i=0; i < sections.length; i++){
        if(sections[i].line == seeAlsoText[0] || sections[i].line == seeAlsoText[1] || sections[i].line == seeAlsoText[2] || sections[i].line == seeAlsoText[3] || sections[i].line == seeAlsoText[4]){
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
        //console.log(data.data.error.code)
        if(!data.data.error && sectionNum!=0){
        console.log("See Also: " + data.data.parse);
        //console.log("See Also parsed " +data.data.parse.text["*"]);
        setSeeAlso(parse(`<div className="seeAlso nodeco" id="seeAlso" onClick=${handleSAClick}>${data.data.parse.text["*"]}</div>`));
        }
        else{
            setSeeAlso([])
        }
    
}).catch(error => console.log(error))
},[sectionNum])

   

   const shuffleData = (data) =>{
    let randomGroupSortKey = {}
    data.forEach(d => randomGroupSortKey[d.title] = Math.random())
    console.log("Group sort keys:", randomGroupSortKey)
    
    //add the sortKey property to the individual array entries
    let dataSortable = data.map(x => {
      return {
        ...x, 
        sortKey: randomGroupSortKey[x.title]
      }
    })
    
    dataSortable.sort((a, b) => a.sortKey - b.sortKey) //sort the groups!
    
    console.log("Result:", dataSortable)
    console.log("Result without sortKey:", dataSortable.map(({ sortKey, ...x }) => x))
   }
            
   

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
                    pllimit: "10", 
                },
            })
            //console.log(data);
            if(data?.query?.pages){  //!=undefined
            const keys = Object.keys(data.query.pages)
            //console.log(data.query.pages[keys[0]].links)
            if(data != null){
            setLinks(data.query.pages[keys[0]].links)
            console.log(links);
            //shuffleData(links);
            //console.log(shuffled);
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

    const showAlert = (type, title, message) =>{
        setPrevMsg(alertMessage);
        setCallAlert(true);
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message)
        console.log(type,title,message)
    }

    //for Cards

    const slideLeft = () => {
        if (index - 1 >= 0) {
          setIndex(index - 1);
          sendLog("Click Wiki Card Left - Title now: " + results[index-1].title, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
     
        }
      };
    
      const slideRight = () => {
        if (index < 2) {
          setIndex(index + 1);
          sendLog("Click Wiki Card Right - Title now: " + results[index+1].title, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
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
    const handleclick = (index) =>{
        sendLog("clicked on Wikicard " + results[index].title, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    const handleLinkClick = (index) =>{
        sendLog("clicked on suggested Link " + links[index].title, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    const handleSAClick = () =>{
        sendLog("clicked on See Also Link" , localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
    }

    const div = document.getElementById("seeAlso")

    div?.addEventListener('click' , () => {
        handleSAClick();
    })

    //get if seeAlso Link was clicked
   /* var lis = document.getElementsByTagName('li');
    for (var i = 0; i < lis.length; i++) {
    lis[i].addEventListener('click', seeAlsoClickHandler)
    }

    function seeAlsoClickHandler(event) {
        event = event || window.event;
        var target = event.target || event.srcElement;
        console.log(target.getAttribute("href"));
        
        sendLog("See Also Link clicked: " + target.getAttribute('href'))

      }*/

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

    const linksInArticle = 
    
    links && links.map((link,index) =>{
        return (
            <li onClick={() => {handleLinkClick(index);}} key={index}>
            <span className='link'><a className="nodeco"target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${link.title}`}>{link.title}</a></span><br/>   
            </li>
        )
    })

    const linksInArticle2 = 
    
    links && links.map((link,index) =>{
        return (
            <div onClick={() => {handleLinkClick(index);}} key={index}>
            <Chip label={link.title} component="a" target="_blank" href={`https://${targetLanguage}.wikipedia.org/wiki/${link.title}`} clickable />
            </div>
        )
    })

    const handleTargetLanguage = (event) => {
        setTargetLanguage(event.target.value);
        sendLog('changed target Language to ' + event.target.value, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        localStorage.setItem("Language", event.target.value)
    };

    const handleMotherTounge = (event) => {
        setMotherTounge(event.target.value);
        sendLog('changed Mother Tounge to ' + event.target.value, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        localStorage.setItem("Mothertounge", event.target.value)
    };


    const sendLog = (action, term, translatedTerm, motherTounge, targetLanguage) =>{
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


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
          console.log(searchTerm)
          if(searchTerm !== ''){
          sendLog("Input to search field: " + searchTerm, localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))}
        }, 3000)
    
        return () => clearTimeout(delayDebounceFn)
      }, [searchTerm])


    return(
      <div>
          <div className="ui-form">
              <div className="field">
              {alertMessage !== prevMsg ? (<Alerts className="alert" type={alertType} message={alertMessage} title={alertTitle}></Alerts>): <div></div>
            }
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
                <MenuItem key="es" value="es">ES</MenuItem>               </Select>
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
          <div id="SA">{seeAlso}</div>
          <div className="linksWrap"><ul>{linksInArticle}</ul></div></div>):<div>Sorry, no  suggestions for "{translatedTerm}"</div>}
          </div>
      
      )

}

export default Search;
