/* global chrome */
import React, {useState, useContext, useEffect} from 'react';
import Alerts from '../Alerts/Alerts'
import BasicWikiCard from '../Cards/BasicWikiCard';
import {Card, Tooltip} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircleFlag} from 'react-circle-flags';
import {
    faCaretLeft,
    faCaretRight,
    faCirclePlus,
    faXmark,
    faMagnifyingGlass,
    faTrash,
    faEye
  } from "@fortawesome/free-solid-svg-icons";
import { DictionaryContext } from '../Contexts/DictionaryContext';
import { UserContext } from '../Contexts/UserContext'
import axios from 'axios'
import './Dictionary.css';

/**
 * The favourites tab, that shows the saved vocabulary
 * Also allows the user to delete and show saved Wikipedia articles again
 */

function Dictionary (){

    const [fullDictionary, setFullDictionary] = useState([])
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext); //holds the dictionary content for the user
    const {user, setUser} = useContext(UserContext);
    const [searchField, setSearchField] = useState("") 
    const [searched, setSearched] = useState(false);
    const [result, setResult] = useState([])
    const [dictionaryLength, setDictionaryLength] = useState(0);
    const [fixedDictLength, setFixedDictLength] = useState(0)
    const [clickedVoc, setClickedVoc] = useState([])
    const [activePage, setActivePage] = useState(1);
    const [beginning, setBeginning]= useState(0);
    const [end, setEnd] = useState(3);
    const [cardOpen, setCardOpen] = useState(false);    
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    //update dictionary length
    useEffect(() =>{ 
        setDictionaryLength(value.length);
    })

    //update Dictionary
    useEffect(() =>{
        updateValue();
    },[])

    //fetch dictionary entries from Database and set the value to current dictionary
    const updateValue = () =>{
        axios.get(`https://pwp.um.ifi.lmu.de/g20/getDictionaryEntries?user=${user}`)
            .then(res => {
                setValue(res.data)
                setFixedDictLength(res.data?.length)
            }).catch((error) => {
            error.toString();
        })
    }

    //show alert (warning, success, info, error) - and close after 5 seconds automatically
    const showAlert = (type, title, message) =>{
        setAlertOpen(true);
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message)

        const timeId = setTimeout(() => {
            // After 5 seconds set the show value to false
            setAlertOpen(false)
          }, 5000)
      
          return () => {
            clearTimeout(timeId)
            
          }

    }

    const handleAlertClose = () => {
        setAlertOpen(false)
    }

    //update value in search field
    const handleSearchChange = (e) =>{
        setSearchField(e.target.value);
    }

    //update dictionary value when user searches, so only searched items are displayed
    function searchList(){
        setBeginning(0);
        setEnd(3);
        setActivePage(1);
        setFullDictionary(value);
        setValue(filteredVoc)
        setSearched(true);
        if(filteredVoc){
        sendLog("Searched in Favorites for: " + searchField, filteredVoc[0].term, filteredVoc[0].translation, filteredVoc[0].motherTounge, filteredVoc[0].targetlanguage)}
    }

    //clear the search field and set dictionary back to full dictionary
    function clearSearch(){
        setSearchField("")
        setActivePage(1);
        setValue(fullDictionary);
        sendLog("Clear Search ", localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))

    }

    //handles click on eye to display wiki article of saved vocab item
    const handlechange = (index) => {
        const clickedVoc = [...value];
        setClickedVoc(clickedVoc[index])
        if(!cardOpen){
        sendLog("Showed Wiki Card of Favourites Term " +clickedVoc[index].term, clickedVoc[index].term, clickedVoc[index].translation, clickedVoc[index].motherTounge, clickedVoc[index].targetlanguage)
        }else{
        sendLog("Closed Wiki Card of Favourites Term " +clickedVoc[index].term, clickedVoc[index].term, clickedVoc[index].translation, clickedVoc[index].motherTounge, clickedVoc[index].targetlanguage)
        }
        //Now display Wiki article again
        const search = async () => {
            const { data } = await axios.get(`https://${clickedVoc[index].targetlanguage}.wikipedia.org/w/api.php`, {
                params: {
                    action: "query",
                    list: "search",
                    origin: "*",
                    format: "json",
                    srsearch: clickedVoc[index].translation,
                },
            })   
            if(data.query.search != []){
                let arr = data.query.search;
                setResult(arr[0]);
      };}
      if(clickedVoc[index] && !cardOpen){
          search();
          setCardOpen(true)
          
    }else{setCardOpen(false)}}

    //handles deletion of dictionary entry
    const deleteEntry = (index) =>{
        const clickedVocab = [...value];
        let entry = {
            user: user,
            term: clickedVocab[index].term,
            translation: clickedVocab[index].translation,
        }
        axios
            .delete("https://pwp.um.ifi.lmu.de/g20/deleteDictionaryEntry", {data: entry})
            .then(data => { if(data.status == 200){
                showAlert("success", "Success", "Successfully deleted " + clickedVocab[index].term + " - " + clickedVocab[index].translation + " from dictionary.");
                sendLog("Deleted Word from dictionary", clickedVocab[index].term, clickedVocab[index].translation, localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
                };
                updateValue();

            })
            .catch(error => showAlert("success", "Success", "Something went wrong. Please reload the page and try again."))
   
    }

    //sends logs to the database
    const sendLog = (action, term, translatedTerm, motherTounge, targetLanguage) =>{
        let timestamp = new Date();
            let dictionaryData = {
                user: user,
                timestamp: timestamp,
                action: action,
                app: "fetch",
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

    //handles click on next page arrow
    const showNextPage = () =>{
        if(value?.length > end){
            setBeginning(beginning+3);
            setEnd(end+3);
            setActivePage(activePage+1);
            let page = activePage+1;
            sendLog("Show next page in Favourites: Now Page " + page, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
      
        }
    }
     
    //handles click on previous page arrow
    const showPreviousPage = () =>{
        if(beginning > 0){
            setBeginning(beginning-3);
            setEnd(end-3);
            setActivePage(activePage-1);
            let page = activePage-1;
            sendLog("Show previous page in Favourites: Now Page " + page, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
      
        }
    }
            
    //map dictionary entries to display 3 on each page
    const words =     
    value && value.slice(beginning, end).map((value,index) =>{
        return(
            <Card  className="cardcontainer" style={{backgroundColor: "#d4e6f1", borderRadius: "15px"}} >
            <div className="container">
            <div className="termFlag">
            <CircleFlag className="fromFlag" countryCode={value.mothertounge=='en' ? 'gb' : value.mothertounge} height="15" style={{marginTop: '20px', paddingRight: '10px'}} />
            <div className="term">{value.term}</div>
            </div>
            <div className="translationFlag">
            <CircleFlag className="toFlag" countryCode={value.targetlanguage=='en' ? 'gb' : value.targetlanguage} height="15" style={{marginTop: '15px', paddingRight: '10px'}} />
            <h3><a target="_blank" onClick={() => sendLog("Clicked Link in Dictionary", value.term, value.translation, value.mothertounge, value.targetlanguage)} href={`https://${value.targetlanguage}.wikipedia.org/wiki/${value.link}`}>{value.translation}</a></h3>
            </div><div>
            <div className="cardBtns">
            <Tooltip title={!cardOpen ? "Show Wiki Entry" : "Hide Wiki Entry"}>
            <FontAwesomeIcon
            onClick={() => handlechange(beginning+index)}
            key={beginning+index}
            className="showBtn"
            icon={faEye}
            size="2x"
            color="#B2BFC7"
             /></Tooltip>
            <Tooltip title="Delete Entry">
            <FontAwesomeIcon
            onClick={() => deleteEntry(beginning+index)}
            className="deleteBtn"
            icon={faTrash}
            size="2x"
            color="#B2BFC7"
             /></Tooltip>
             </div>
             <div>
                {cardOpen && (clickedVoc.targetlanguage!==undefined) && (value.translation == clickedVoc.translation) ?
                    <div>
                    <div><hr class="solidHR"></hr></div>
                    <BasicWikiCard {...result} targetLanguage={clickedVoc.targetlanguage} />
                    </div>: <div></div>
                }
            
            </div>
            </div>
            </div>
            </Card>
            
            
        )
    })

    //check dictionary for search term
    const filteredVoc = value && value.filter(
        value =>{
            return(
                value.term?.toLowerCase().includes(searchField.toLowerCase()) ||
                value?.translation?.toLowerCase().includes(searchField.toLowerCase())
            );
        }
    );


    return(
        <div>
            <div className="favsearchcontainer"><input
             type="search"
             id="searchbox"
             placeholder="Search Favourites"
             onChange = {handleSearchChange}
             value={searchField}
            />
            <Tooltip title="Search in favourites">
            <FontAwesomeIcon
            onClick={searchList}
            className="glasses"
            icon={faMagnifyingGlass}
            size="2x"
            color="#B2BFC7"
             /></Tooltip>
             <Tooltip title="Clear Search">
             <FontAwesomeIcon
            onClick={clearSearch}
            className="clear"
            icon={faXmark}
            size="2x"
            color="#B2BFC7"
             />
             </Tooltip>
             </div>
             {value?.length==0 && fixedDictLength>0 ? <div><div><hr class="solidHR"></hr></div><div>Sorry, no search results found for "{searchField}"</div></div>:<div></div>} 
            {(value?.length>0) ?  <div>
            <div>
            <div><hr class="solidHR"></hr></div>
            <Alerts className="alert" type={alertType} message={alertMessage} title={alertTitle} isOpen={alertOpen} handleClose={handleAlertClose}></Alerts>
            {words}
            <div><hr class="solidHR"></hr></div>
            <div className="pageDisplay">
            <Tooltip title="Previous Page">
            <FontAwesomeIcon
            onClick={showPreviousPage}
            className="leftBtn"
            icon={faCaretLeft}
            size="4x"
            color="#B2BFC7"
             /></Tooltip>
            <div className="pages">{activePage}/{Math.ceil(value?.length/3)}</div>
            <Tooltip title="Next Page">
            <FontAwesomeIcon
            onClick={showNextPage}
            className="rightBtn"
            icon={faCaretRight}
            size="4x"
            color="#B2BFC7"
             /></Tooltip>
             </div></div></div>
            
            : <div>{(fixedDictLength==0) ? <div><div><hr class="solidHR"></hr></div><div>No words saved in your favourites yet.
                Click <FontAwesomeIcon title="Add to favourites" icon={faCirclePlus} size="1x" color="#B2BFC7" className="plus"/>
                next to the vocabulary to add your first one!
                </div></div>: <div></div>}</div>
                
            }

            
            
        </div>
    )
}   
export default Dictionary;