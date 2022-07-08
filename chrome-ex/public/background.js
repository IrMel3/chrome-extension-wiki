/**
 * initialize Get Headlines in the Context Menu
 */
/*chrome.contextMenus.create({
    id: "HeadlineFetcher",
    title: "Get Headlines",
    contexts: ["all"]
}) */

/**
 * 
 
chrome.runtime.onMessage.addListener((msg, sender) => {
    if ((msg.from === 'app') && (msg.subject === 'getText')) {
      chrome.pageAction.show(sender.tabs[0].id);
    }
});
*/

  

/**send Message get Headlines if Context Menu is clicked 
chrome.contextMenus.onClicked.addListener(() =>{
    chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        chrome.tabs.sendMessage(tabs[0].id, {type: "getHeadlines"});
    });
});*/

/**
 * trying to send toggle message to open sidebar
 
chrome.browserAction.onClicked.addListener(tab =>{
    chrome.tabs.sendMessage(tab[0].id, "toggle");
})
*/

//trying another onMessage
chrome.runtime.onMessage.addListener((msg, sender, response) => {
    switch (msg.type) {
        case 'popupInit':
            response(tabStorage[msg.tabId]);
            break;
        default:
            response('unknown request');
            break;
    }
});

