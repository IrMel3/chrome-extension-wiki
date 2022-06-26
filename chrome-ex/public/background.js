chrome.contextMenus.create({
    id: "HeadlineFetcher",
    title: "Get Headlines",
    contexts: ["all"]
})

chrome.contextMenus.onClicked.addListener(() =>{
    chrome.tabs.query({active: true, currentWindow: true}, tabs =>{
        chrome.tabs.sendMessage(tabs[0].id, {type: "getHeadlines"});
    });
});



/*chrome.runtime.onInstalled.addListener(() => {
    // default state goes here
    // this runs ONE TIME ONLY (unless the user reinstalls your extension)
});

// setting state
chrome.storage.local.set({
    name: "Jack"
}, );

// getting state
chrome.storage.local.get("name", );

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./foreground_styles.css"]
        })
            .then(() => {
                console.log("INJECTED THE FOREGROUND STYLES.");

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["./foreground.js"]
                })
                    .then(() => {
                        console.log("INJECTED THE FOREGROUND SCRIPT.");
                    });
            })
            .catch(err => console.log(err));
    }
});

*/