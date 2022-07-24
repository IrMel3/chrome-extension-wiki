/* global chrome */
import React, {useState, useContext, useEffect, useRef} from 'react';
import { DictionaryContext } from './DictionaryContext';


function Dictionary (){

    const [newWord, setNewWord] = useState([]);
    const [fullDictionary, setFullDictionary] = useState([])
    const msg = useContext(DictionaryContext);
    const {value, setValue} = useContext(DictionaryContext);

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
        if(value !==  []){
            localStorage.setItem("Vocabulary", JSON.parse(JSON.stringify(value)));
            console.log(localStorage.getItem("Vocabulary"));
            //chrome.storage.sync.set({dictionary: {Term: value.Term, Translation: value.Translation}})
        }else if(value == []){
            setValue(localStorage.getItem("Vocabulary"));
            console.log(localStorage.getItem("Vocabulary"));
        }
    },[])

    /**
     * add new word to Chrome Storage and update dictionary
     */
    useEffect (() =>{
    chrome.storage.sync.set({dictionary: newWord}, function(){    
            console.log(newWord + "added to chrome storage");
    });
    chrome.storage.sync.get({
        dictionary:[] 
    },
    function(data) {
       console.log(data.dictionary);
       update(data.dictionary); //storing the storage value in a variable and passing to update function
       
    }
    ); 

    },[])


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
    }

    const words = value.map(value =>{
        return(
            <div>
            <li>{value.Term}</li>
            <li>{value.Translation}</li>
            </div>
        )
    })



    return(
        <div>
            {words}
           <h3>{newWord[0]}</h3>
           <h4>{newWord[1]}</h4>
        </div>
    )
}   
export default Dictionary;