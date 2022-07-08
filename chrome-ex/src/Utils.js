/*global chrome*/
export function getCurrentTab(callback) {
    chrome.tabs.query({
        active: true, 
        lastFocusedWindow:true
    },
    (tabs) => {
        callback(tabs[0]);
    });
}