/* global chrome */
import React, {useState, useContext, useEffect, useRef} from 'react';
import IndexCard from "./IndexCard";
import BasicWikiCard from '../BasicWikiCard';
import {Card, Tooltip} from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DE,EN,IT,FR } from 'country-flag-icons/react/3x2'
import {
    faCaretLeft,
    faCaretRight,
    faClipboard,
    faCirclePlus,
    faList,
    faXmark,
    faMagnifyingGlass
  } from "@fortawesome/free-solid-svg-icons";
import { DictionaryContext } from './DictionaryContext';
import WikiCard from "./WikiCard";
import { UserContext } from './UserContext'
import axios from 'axios'
import './Dictionary.css';


function Dictionary (){

    const [newWord, setNewWord] = useState([]);
    const [fullDictionary, setFullDictionary] = useState([])
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);
   // const [fullDictionary, setFullDictionary] = useContext([])
    const {user, setUser} = useContext(UserContext);
    const [searchField, setSearchField] = useState("")
    const [searched, setSearched] = useState(false);
    const [result, setResult] = useState([])
    const [dictionaryLength, setDictionaryLength] = useState(0);
    const [showList, setShowList] = useState(false);
    const [index, setIndex] = useState(0)
    const [clickedVoc, setClickedVoc] = useState([])

    /**
     * fetch new word from local storage
     */
    useEffect(() => {
        if(localStorage.getItem("putIntoDictionary") !== null && localStorage.getItem("putTranslationIntoDictionary") !== null) {
            setNewWord(oldArr =>[...oldArr,localStorage.getItem("putIntoDictionary")]);
            setNewWord(oldArr =>[...oldArr,localStorage.getItem("putTranslationIntoDictionary")]);
        }
    },[])


    useEffect(() =>{ 
        setDictionaryLength(value.length);
    })

    useEffect(() =>{
        axios.get(`http://localhost:3000/getDictionaryEntries?user=${user}`)
            .then(res => {
               // console.log(res.data)
                setValue(res.data)
            }).catch((error) => {
            error.toString();
        })
    },[])



    const slideLeft = () => {
        if (index - 1 >= 0) {
          setIndex(index - 1);
          sendLog("Click Card Left", localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }
      };
    
      const slideRight = () => {
        if (index + 1 <= value.length - 1) {
          setIndex(index + 1);
          sendLog("Click Card Right", localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }
      };

    const changeList = () => {
        if(showList == false){
        setShowList(true)
        sendLog("Clicked on showList", localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"));
        }
        else{
            setShowList(false);
            sendLog("Clicked on showCards", localStorage.getItem("Term"), localStorage.getItem("Translation"),localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
        }
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
       // if(filteredVoc){
        //sendLog("Searched for Term " + searchField, filteredVoc[0].term, filteredVoc[0].translation, filteredVoc[0].motherTounge, filteredVoc[0].targetlanguage)}
    }

    function clearSearch(){
        setSearchField("")
        setValue(fullDictionary);
    }

    const handlechange = (index) => {
        const clickedVoc = [...value];
        console.log(clickedVoc[index])
        setClickedVoc(clickedVoc[index])
        sendLog("Clicked on Dictionary Term " +clickedVoc[index].term, clickedVoc[index].term, clickedVoc[index].translation, clickedVoc[index].motherTounge, clickedVoc[index].targetlanguage)
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
      if(clickedVoc[index]){
          search();
          
    }}

    const deleteEntry = (index) =>{
        const clickedVocab = [...value];
        console.log(clickedVocab[index])
        let timestamp = new Date();
        let entry = {
            user: user,
            term: clickedVocab[index].term,
            translation: clickedVocab[index].translation,
        }
        console.log(entry)
        axios
            .delete("http://localhost:3000/deleteDictionaryEntry", {data: entry})
            .then(data => { if(data.status == 200){
                alert("Successfully deleted " + clickedVocab[index].term + " - " + clickedVocab[index].translation + " from dictionary.")
                sendLog("Deleted Word from dictionary", clickedVocab[index].term, clickedVocab[index].translation, localStorage.getItem("Mothertounge"), localStorage.getItem("Language"))
                };

            })
            .catch(error => alert("Something went wrong. Please reload the page and try again."))
   
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


    const wikicard = ()=>{
    if(clickedVoc.targetlanguage!==undefined){
    return(
    <div className="container">
        <BasicWikiCard {...result} targetLanguage={clickedVoc.targetlanguage} />
    </div>
    )}
    else{
        return(<div></div>)
    }
}
            
        

    const words =     
    value && value.map((value,index) =>{
        return(
            <Card  className="cardcontainer" style={{backgroundColor: "#d4e6f1", borderRadius: "15px"}} >
            <div onClick={() => {handlechange(index);}} key={index} className="container">
            <h3>{value.term}</h3>
            <a target="_blank" href={`https://${value.targetlanguage}.wikipedia.org/wiki/${value.link}`}>{value.translation}</a>
            <div>
            <FontAwesomeIcon
            onClick={() => deleteEntry(index)}
            className="deleteBtn"
            icon={faXmark}
            size="2x"
            color="#B2BFC7"
             />
            </div>
            </div>
            </Card>
            
            
        )
    })


    const words2 = 
        value && value.map((value, n) =>{
        let position = n > index ? "nextCard" : n === index ? "activeDictCard" : "prevCard";
        return(
        <div onClick={() => {handlechange(n);}} className="container" key={n}>
            <IndexCard {...value} cardStyle={position}></IndexCard>
        </div>
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
            {(value?.length>0) ?  
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
            <div>{wikicard()}</div>
            {showList==false ?  
          <div>
          <div className="dictionary">
            <Tooltip title="Previous">
            <FontAwesomeIcon
            onClick={slideLeft}
            className="leftBtn"
            icon={faCaretLeft}
            size="4x"
            color="#B2BFC7"
             /></Tooltip>
            <div className="card-container">
            {words2}
            </div>
            <Tooltip title="Next">
            <FontAwesomeIcon
                onClick={slideRight}
                className="rightBtn"
                icon={faCaretRight}
                size="4x"
                color="#B2BFC7"
            /></Tooltip>
            </div>
            <div>{index+1}/{dictionaryLength}</div>
            <div><hr class="solidHR"></hr></div>
            <Tooltip title="Show List">
            <FontAwesomeIcon 
            icon={faList}
            className="cardBtn"
            onClick={changeList}
            size="2x"
            color="#B2BFC7" 
            /></Tooltip>
            </div>: <div>
            <div><hr class="solidHR"></hr></div>
            {words}
            <Tooltip title="Show cards">
            <FontAwesomeIcon 
            icon={faClipboard}
            className="listBtn"
            onClick={changeList}
            size="2x"
            color="#B2BFC7" 
            /></Tooltip></div> }</div>
            
            :  <div>No words saved in your favourites yet.
                Click <FontAwesomeIcon title="Add to favourites" icon={faCirclePlus} size="1x" color="#B2BFC7" className="plus"/>
                next to the vocabulary to add your first one!
                </div>
                
            }

            
            
        </div>
    )
}   
export default Dictionary;