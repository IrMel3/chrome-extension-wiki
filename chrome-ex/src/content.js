/* global chrome*/
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Frame, {FrameContextConsumer} from 'react-frame-component'
import $ from 'jquery';

const Main = () => { 

/**
 * functions to get Text & HTMl of the current tab
 */


function getText(){
    if(document.body?.innerText){
    return document.body.innerText
    }
}
if(document.body?.innerText){
chrome.runtime.sendMessage({  
    page_text: document.body.innerText
})}


// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
    from: 'app',
    subject: 'getText',
  });

//listen for messages from Search.js
chrome.runtime.onMessage.addListener((msg, sender, response) => {
        if((msg.from === 'app') && (msg.subject === 'getText') && (document.body?.innerText)){
            var text = {
                data: document.body.innerText
            };
            //response({data: document.body.innerText, method: "getText"});
            //console.log("msg sent")
            response(text);
        }
    }
); 


return (
    <Frame id = "side-panel">
        {
          ({document, window}) => {
            return (
              <div>
                <div>
                  This is the Side Panel.
                </div>
              </div>
            )
          }
        }
   </Frame>
    )    
}

function getFirstH1(){
    if(document.querySelector('h1')){
    return document.querySelector('h1').innerText;
    }
}

chrome.storage.sync.set({'visitedPages':
{pageText: getFirstH1()}},
    function () {
});

chrome.storage.sync.set({'currentURL':
{location: document.location.href}},)
/*
chrome.storage.sync.set({'searchParams':
{params: document.location.search}}, )

*/


const app = document.createElement('iframe');
//const yt = document.getElementsByClassName('style-scope ytd-channel-name');
app.style.border = "none"
app.id = 'chromeapp';
app.style.width = "300px";
app.style.height = "700px"
app.style.top = "0px";
app.style.right = "0px";
app.style.position = "fixed";
app.style.zIndex = "950"
app.src = chrome.runtime.getURL("index.html");

if(document.getElementById("mw-head")){
    document.getElementById("mw-head").style.paddingRight = "300px";
}

document.body.style.paddingRight = "300px";
document.body.style.zIndex = "900"
document.body.appendChild(app);
ReactDOM.render(<Main />, app);

