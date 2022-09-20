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


function Dictionary (){

    const [fullDictionary, setFullDictionary] = useState([])
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);
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


    useEffect(() =>{ 
        setDictionaryLength(value.length);
    })

    useEffect(() =>{
        updateValue();
    },[])

    const updateValue = () =>{
        axios.get(`http://localhost:3000/getDictionaryEntries?user=${user}`)
            .then(res => {
                setValue(res.data)
                setFixedDictLength(res.data?.length)
            }).catch((error) => {
            error.toString();
        })
    }

    const showAlert = (type, title, message) =>{
        setAlertOpen(true);
        setAlertType(type);
        setAlertTitle(title);
        setAlertMessage(message)
    }

    const handleAlertClose = () => {
        setAlertOpen(false)
    }

    const handleSearchChange = (e) =>{
        setSearchField(e.target.value);
    }

    function searchList(){
        console.log(filteredVoc)
        setFullDictionary(value);
        setValue(filteredVoc)
        setSearched(true);
        console.log(value);
        if(filteredVoc){
        sendLog("Searched in Favorites for: " + searchField, filteredVoc[0].term, filteredVoc[0].translation, filteredVoc[0].motherTounge, filteredVoc[0].targetlanguage)}
    }

    function clearSearch(){
        setSearchField("")
        setValue(fullDictionary);
        sendLog("Clear Search ", localStorage.getItem("Term"), localStorage.getItem("Translation"), localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))

    }

    const handlechange = (index) => {
        const clickedVoc = [...value];
        console.log(clickedVoc[index])
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
                console.log(result)
      };}
      if(clickedVoc[index] && !cardOpen){
          search();
          setCardOpen(true)
          
    }else{setCardOpen(false)}}

    const deleteEntry = (index) =>{
        const clickedVocab = [...value];
        console.log(clickedVocab[index])
        let entry = {
            user: user,
            term: clickedVocab[index].term,
            translation: clickedVocab[index].translation,
        }
        console.log(entry)
        axios
            .delete("http://localhost:3000/deleteDictionaryEntry", {data: entry})
            .then(data => { if(data.status == 200){
                showAlert("success", "Success", "Successfully deleted " + clickedVocab[index].term + " - " + clickedVocab[index].translation + " from dictionary.");
                sendLog("Deleted Word from dictionary", clickedVocab[index].term, clickedVocab[index].translation, localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
                };
                updateValue();

            })
            .catch(error => showAlert("success", "Success", "Something went wrong. Please reload the page and try again."))
   
    }


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

    const showNextPage = () =>{
        if(value?.length > end){
            setBeginning(beginning+3);
            setEnd(end+3);
            setActivePage(activePage+1);
            let page = activePage+1;
            sendLog("Show next page in Favourites: Now Page " + page, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
      
        }
    }

    const showPreviousPage = () =>{
        if(beginning > 0){
            setBeginning(beginning-3);
            setEnd(end-3);
            setActivePage(activePage-1);
            let page = activePage+1;
            sendLog("Show previous page in Favourites: Now Page " + page, localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
      
        }
    }
            
        
    //map dictionary entries
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