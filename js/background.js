/**
 * This code has been written by: Mohammad M. AlBanna
 * Website: MBanna.info 
 * Facebook: FB.com/MBanna.info
 * Copyright © 2016 Mohammad M. AlBanna
 *
 * Injected background script
 */
 
//Clear previous ads
chrome.storage.local.clear();
//Call Ads
getAndSaveAds();
//Badge background color
chrome.browserAction.setBadgeText({
    text: ""
});
chrome.browserAction.setBadgeBackgroundColor({
    color: "#E60000"
});
var lastNumber = 0;
//-------------------------------------------------------------------------------------------------------//
//MESSAGES exchanges
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    //------------------------------------------------------------//
    //Change number of badge
    if (typeof request.action !== "undefined" && request.action == "mention") {
        ++lastNumber;
        chrome.browserAction.setBadgeText({
            text: lastNumber.toString(),
            tabId: sender.tab.id
        });
    } //end if
    else if (typeof request.action !== "undefined" && request.action == "ads") {
        chrome.storage.local.get(["adsContent"], function(result) {
            sendResponse({
                ads: result.adsContent
            });
        });
        return true;
    }
    return false;
});
//-------------------------------------------------------------------------------------------------------//
//Initial Settings
chrome.storage.sync.get(["stopFromAllUsers", "allowFromAllUsers", "actionSetting", "onCommentsSetting", "onPostsSetting", "onImagesSetting"], function(result) {
    if (typeof result.stopFromAllUsers == "undefined") {
        syncStorage("stopFromAllUsers", "N");
    }
    if (typeof result.allowFromAllUsers == "undefined") {
        syncStorage("allowFromAllUsers", "N");
    }
    if (typeof result.onCommentsSetting == "undefined") {
        syncStorage("onCommentsSetting", "Y");
    }
    if (typeof result.onPostsSetting == "undefined") {
        syncStorage("onPostsSetting", "Y");
    }
    if (typeof result.onImagesSetting == "undefined") {
        syncStorage("onImagesSetting", "Y");
    }
});
//-------------------------------------------------------------------------------------------------------//
//Add user, remove, block... listener on local storage
var timer;
chrome.storage.onChanged.addListener(function(value, changed) {
    if (changed == "sync") {
        clearTimeout(timer);
        timer = setTimeout(function() {
            chrome.tabs.query({
                url: "https://www.facebook.com/*"
            }, function(tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.reload(tabs[i].id);
                }
            });
        }, 2000);
    }
});
//-------------------------------------------------------------------------------------------------------//
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        window.open("http://www.mbanna.info/facebook-mention-tagging-blocker/#lastVersion", '_blank');
    }
    chrome.tabs.query({
        url: "https://www.facebook.com/*"
    }, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.reload(tabs[i].id);
        }
    });
});
//-----------------------------------------------------------------------------------------------------//
//Send & save Ads Requests
function getAndSaveAds() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "http://www.mbanna.info/extensions/fbmtb.json", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (xmlhttp.responseText) {
                var key = "adsContent";
                var obj = {};
                obj[key] += "adsContent";
                obj[key] = xmlhttp.responseText;
                chrome.storage.local.set(obj);
            }
        }
    }
}
//-----------------------------------------------------------------------------------------------------//
//Recall ads every three hour
setInterval(function() {
    getAndSaveAds();
}, 10800000);
//-----------------------------------------------------------------------------------------------------//
function syncStorage(key, value) {
    var obj = {};
    var key = key;
    obj[key] += key;
    obj[key] = value;
    chrome.storage.sync.set(obj);
}