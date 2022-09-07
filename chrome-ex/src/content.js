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
    return document.body.innerText
}
function getHTML(){
    return document.body.outerHTML
}
function getFirstH1(){
    return document.querySelector('h1').innerText;
}

chrome.runtime.sendMessage({
    page_text: document.body.innerText
})


var visited = window.location.href;
var time = +new Date();
var text = +document.body.innerHTML;
var textpure = getText();



//console.log(getText());             
//console.log(getHTML());             
//console.log(getFirstH1());

// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
    from: 'app',
    subject: 'getText',
  });

//listen for messages from Search.js
chrome.runtime.onMessage.addListener((msg, sender, response) => {
        if((msg.from === 'app') && (msg.subject === 'getText')){
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

function getFirstH1(){
    return document.querySelector('h1').innerText;
}

chrome.storage.sync.set({'visitedPages':
{pageText: getFirstH1()}},
    function () {
    console.log("Just visited", getFirstH1())
});

chrome.storage.sync.set({'currentURL':
{location: document.location.href}}, console.log("current URL",document.location.href))

chrome.storage.sync.set({'searchParams':
{params: document.location.search}}, console.log("search Parameters",document.location.search))




const app = document.createElement('iframe');
//const yt = document.getElementsByClassName('style-scope ytd-channel-name');
app.style.border = "none"
app.id = 'chromeapp';
app.style.width = "310px";
app.style.height = "700px"
app.style.top = "0px";
app.style.right = "0px";
app.style.position = "fixed";
app.style.zIndex = "950"
app.src = chrome.runtime.getURL("index.html");

/*const button = document.createElement('button');
button.text='Resize'
button.id = 'resize';
button.onclick = function(){app.style.height = "300px"}

if(document.getElementById("resize")){
document.getElementById("resize").onclick= function(){app.style.height= "500px"};
}
*/
if(document.getElementById("mw-head")){
    document.getElementById("mw-head").style.paddingRight = "300px";
}
/*if(document.getElementsByClassName("vector-menu-content-list") !== null){
    document.getElementsByClassName("vector-menu-content-list")[0].style.paddingRight = "300px";
}*/
document.body.style.paddingRight = "300px";
document.body.style.zIndex = "900"
document.body.appendChild(app);
ReactDOM.render(<Main />, app);



/**
 * toggle sidebar
 */
/*
chrome.runtime.onMessage.addListener(function(msg,sender){
    if(msg == "toggle"){
        toggle();
    }
})*/
/*var iframe = document.createElement('iframe'); 
iframe.style.background = "green";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.src = chrome.extension.getURL("index.html")

document.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}*/
/*
/**
 * shows popup when get Headlines is requested
 /*
chrome.runtime.onMessage.addListener( request =>{
    if(request.type === "getHeadlines"){
        const modal = document.createElement("dialog");
        modal.setAttribute("style", "height:40%");
        modal.innerHTML =
       `<iframe id="headlineFetcher" style="height:100%"></iframe>
        <div style="position:absolute; top:0px; left:5px;">  
            <button>x</button>
        </div>`;
        document.body.appendChild(modal);
        const dialog = document.querySelector("dialog");
        dialog.showModal();
        const iframe = document.getElementById("headlineFetcher");  
        iframe.src = chrome.extension.getURL("index.html");
        iframe.frameBorder = 0;

        dialog.querySelector("button").addEventListener("click", () => {
            dialog.close();
         });
    }
})
*/