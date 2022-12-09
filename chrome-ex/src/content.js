/* global chrome*/
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Frame, {FrameContextConsumer} from 'react-frame-component'

const Main = () => { 

/**
 * functions to get Text & HTMl of the current tab
 */

if(document.body?.innerText){
chrome.runtime.sendMessage({
    page_text: document.body.innerText
})
}

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
            console.log("msg sent")
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

//retrieve H1 from current website
function getFirstH1(){
    if(document.querySelector('h1')?.innerText){
    return document.querySelector('h1').innerText;
}}

//save h1 to chrome storage
chrome.storage.sync.set({'visitedPages':
{pageText: getFirstH1()}},
    function () {});

//save current URL to chrome storage
chrome.storage.sync.set({'currentURL':
{location: document.location.href}},)

//save search Parameters to chrome storage
chrome.storage.sync.set({'searchParams':
{params: document.location.search}}, )


//create the iframe for the extension

const app = document.createElement('iframe');
app.style.border = "none"
app.id = 'chromeapp';
app.style.width = "300px";
app.style.height = "750px"
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
