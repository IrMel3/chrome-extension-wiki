/* global chrome */
import React, {useState, useContext, useEffect, useRef} from 'react';
import Card from "./Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretLeft,
    faCaretRight,
    faList
  } from "@fortawesome/free-solid-svg-icons";
import { DictionaryContext } from './DictionaryContext';
import { UserContext } from './UserContext'
import axios from 'axios'
import './Dictionary.css';


function Dictionary (){

    const [newWord, setNewWord] = useState([]);
    const [fullDictionary, setFullDictionary] = useState([])
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);
    const {user, setUser} = useContext(UserContext);
    const [dictionaryLength, setDictionaryLength] = useState(0);
    const [showList, setShowList] = useState(false);
    const [index, setIndex] = useState(0)

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
                console.log(res.data)
                setValue(res.data)
            }).catch((error) => {
            error.toString();
        })
    }, [])


   /* useEffect(() =>{
        const sDict = localStorage.getItem("Vocabulary");
        const parsedDict = JSON.parse(sDict);

        if(sDict == null){
            setValue([])
        }else{
            setValue(parsedDict)
        }
    })*/

    useEffect(() =>{
      /*  if(localStorage.getItem("Vocabulary") ){
            setValue(JSON.parse(localStorage.getItem("Vocabulary")));
            console.log(JSON.parse(localStorage.getItem("Vocabulary")));
        }*/

      /*  if(value !==  []){
            localStorage.setItem("Vocabulary", JSON.stringify(value));
            console.log(localStorage.getItem("Vocabulary"));
            //chrome.storage.sync.set({dictionary: {Term: value.Term, Translation: value.Translation}})
        }else if(value == []){
            setValue(JSON.parse(localStorage.getItem("Vocabulary")));
            console.log(JSON.parse(localStorage.getItem("Vocabulary")));
        }*/
        
    },[value])

    /**
     * add new word to Chrome Storage and update dictionary
     */
  /*  useEffect (() =>{
    chrome.storage.sync.set({dictionary: newWord}, function(){    
            console.log(newWord + "added to chrome storage");
    });
    chrome.storage.sync.get({
        dictionary:[] 
    },
    function(data) {
       console.log(data.dictionary);
       update(data.dictionary); //storing the storage value in a variable and passing to update function     
    }); 
    }, [fullDictionary])


    function update(array)
   {
    array.push("test");
    //then call the set to update with modified value
    chrome.storage.sync.set({
        Dictionary:array
    }, function() {
        setFullDictionary(array);
        console.log(fullDictionary);
    });
    }*/

    const slideLeft = () => {
        if (index - 1 >= 0) {
          setIndex(index - 1);
        }
      };
    
      const slideRight = () => {
        if (index + 1 <= value.length - 1) {
          setIndex(index + 1);
        }
      };

    const changeList = () => {
        if(showList == false){
        setShowList(true)}
        else{
            setShowList(false);
        }
    }

    const words =     
    value && value.map(value =>{
        return(
            <div>
            <h3>{value.term}</h3>
            <a target="_blank" href={`https://${value.targetlanguage}.wikipedia.org/wiki/${value.link}`}>{value.translation}</a>
            </div>
            
        )
    })

    const words2 = 
        value && value.map((value, n) =>{
        let position = n > index ? "nextCard" : n === index ? "activeDictCard" : "prevCard";
        return(
        <div className="container">
            <Card {...value} cardStyle={position}></Card>
        </div>
    )
    })


    return(
        <div>
            {value != null ?  
        <div>
            {showList==false ?  
          <div>
          <div className="dictionary">  
              <FontAwesomeIcon
            onClick={slideLeft}
            className="leftBtn"
            icon={faCaretLeft}
            size="4x"
            color="#B2BFC7"
             />
            <div className="card-container">
            {words2}
            </div>
            <FontAwesomeIcon
                onClick={slideRight}
                className="rightBtn"
                icon={faCaretRight}
                size="4x"
                color="#B2BFC7"
            />
            </div>
            <div>{index+1}/{dictionaryLength}</div>
            </div>: <div>{words}</div> }</div>
            
            :  <div>No words in dictionary yet.</div>}

            <FontAwesomeIcon 
            icon={faList}
            className="listBtn"
            onClick={changeList}
            size="2x"
            color="#000" 
            />
            
        </div>
    )
}   
export default Dictionary;