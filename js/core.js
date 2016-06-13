/**
 * This code has been written by: Mohammad M. AlBanna
 * Website: MBanna.info 
 * Facebook: FB.com/MBanna.info
 * Copyright © 2016 Mohammad M. AlBanna
 *
 * Injected scripts to all Facebook pages
 */
 
$(function() {
    var beeperBox = $("ul[data-gt*='click2canvas']").get(0) || $("#pagelet_dock").get(0);
    var notifJewel = $("#fbNotificationsFlyout").get(0);
    var body = $("body").get(0);
    var showExternalLinks = true;
    var showAdsOfPages = true;

    //-------------------------------------//
    //Show ads for first time
    if(body){
        var adsObserver = new MutationObserver(function(mutations){
            handleRightColumChanges(mutations);
        });
        adsObserver.observe(body,{childList: true});
    }
    //Like page ads button event
    $("body").on("click", "#fbmtbAdLikePage", function() {
        var fb_dtsg = $("input[type='hidden'][name='fb_dtsg']").first().val();
        var fbpage_id = $(this).attr("data-id");
        if (typeof fb_dtsg != "undefined" && fbpage_id.length > 0) {
            $.ajax({
                url: "https://www.facebook.com/ajax/pages/fan_status.php",
                type: "POST",
                data: {
                    fbpage_id: fbpage_id,
                    __a: "1",
                    add: "true",
                    fb_dtsg: fb_dtsg
                }
            });
        }
        $(this).parents("li").fadeOut();
    });
    //-------------------------------------//
    //Check extension setting
    chrome.storage.sync.get(null, function(storage) {
        var usersArray = Object.keys(storage);
        //No need to check if there blocked users or not
        if (storage.allowFromAllUsers == "Y") {
            return false;
        }
        //Listener to small box clickable to the notification...
        if(beeperBox){
            var beeperNotificationsObserver = new MutationObserver(function(mutations){
                //Just when ads boxes are active
                handleBeeperBoxChildren(mutations,storage,usersArray);
            });
            beeperNotificationsObserver.observe(beeperBox,{childList: true, subtree:true});
        }
        //-------------------------------------//
        //On click to notification jewel check content
        $("body").on("click", "div#fbNotificationsJewel a.jewelButton", function() {
            setTimeout(function() {
                $.each($("ul[data-gt*='notif_jewel'] li"), function(index, target) {
                    loopOnLINotis(storage, target, usersArray);
                });
            }, 50);
        });
        //-------------------------------------//
        //Listener to jewel notification on inserted...
        if(notifJewel){
            var notificationsObserver = new MutationObserver(function(mutations){
                //Just when ads boxes are active
                notifJewelBoxChildren(mutations,storage,usersArray);
            });
            notificationsObserver.observe(notifJewel,{childList: true,subtree:true});
        }
    }); //end local storage

    //-----------------------------------------------------------------------------------------//
    function getCookie(c_name) {
        c_value = document.cookie;
        c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1) {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1) {
            c_value = null;
        } else {
            c_start = c_value.indexOf("=", c_start) + 1;
            c_end = c_value.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start, c_end));
        }
        return c_value;
    }
    //-----------------------------------------------------------------------------------------//
    //check the date of ads
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();

    function isValidToShowAds(json) {
        var item = json;
        var startDateCompare = new Date(item[2][0].split("-")[2], item[2][0].split("-")[1] - 1, item[2][0].split("-")[0]);
        var endDateCompare = new Date(item[2][1].split("-")[2], item[2][1].split("-")[1] - 1, item[2][1].split("-")[0]);
        var todayCompare = new Date(yyyy, mm, dd);
        if (startDateCompare <= todayCompare && todayCompare <= endDateCompare) {
            return item;
        } else {
            return null;
        }
    }
    //-----------------------------------------------------------------------------------------//
    //Show external links ads
    function showExternalAds() {
        var showExternalAds = $(".fbmtbAd.extURL").length > 0 ? false : true;
        if (!showExternalAds) {
            showExternalLinks = false;
            return false;
        }
        showExternalLinks = true;
        chrome.runtime.sendMessage({
            action: "ads"
        }, function(response) {
            var json = typeof response.ads != "undefined" ? JSON.parse(response.ads) : null;
            if (json && showExternalLinks && typeof json.external_links !== "undefined" && Object.keys(json.external_links).length > 0) {
                $("#rightCol").prepend("<div class='fbmtbAd extURL'></div>");
                $.each(json.external_links, function(index, el) {
                    if (isValidToShowAds(el)) {
                        if (typeof el[4] != "undefined" && el[4] === "rtl") {
                            $('<li style="direction:rtl;text-align:right">\
                                <div class="fbmtbAdImage">\
                                    <img title="' + escapeHTML(index) + '" src="' + escapeHTML(el[0]) + '" />\
                                </div>\
                                <div class="fbmtbAdInfo">\
                                    <a title="' + escapeHTML(index) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(index) + '</a>\
                                    <a title="' + escapeHTML(el[1]) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(el[1]) + '</a>\
                                </div>\
                            </li>').appendTo($(".fbmtbAd.extURL"));
                        } else {
                            $('<li style="direction:ltr;text-align:left">\
                                <div class="fbmtbAdImage">\
                                    <img title="' + escapeHTML(index) + '" src="' + escapeHTML(el[0]) + '" />\
                                </div>\
                                <div class="fbmtbAdInfo">\
                                    <a title="' + escapeHTML(index) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(index) + '</a>\
                                    <a title="' + escapeHTML(el[1]) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(el[1]) + '</a>\
                                </div>\
                            </li>').appendTo($(".fbmtbAd.extURL"));
                        }
                    }
                });
                $("<div class='adByWebsite'><a target='_blank' href='http://www.mbanna.info/facebook-mention-tagging-blocker/'>FBMTB</a></div>").appendTo('.fbmtbAd.extURL');
            }
            showExternalLinks = false;
        });    
    }
    //-----------------------------------------------------------------------------------------//
    //Show pages links ads
    function showPagesAds() {
        var showPageAds = $(".fbmtbAd.pagesURL").length > 0 ? false : true;
        if (!showPageAds) {
            showAdsOfPages = false;
            return false;
        }
        showAdsOfPages = true;
        chrome.runtime.sendMessage({
            action: "ads"
        }, function(response) {
            var json = typeof response.ads != "undefined" ? JSON.parse(response.ads) : null;
                if(json && showAdsOfPages && typeof json.pages_links !== "undefined" && Object.keys(json.pages_links).length > 0 ){
                    $("#rightCol").prepend("<div class='fbmtbAd pagesURL'></div>");
                    $.each(json.pages_links, function(index, el) {
                    if (isValidToShowAds(el)) {
                        if (typeof el[5] != "undefined" && el[5] === "rtl") {
                            $('<li style="text-align:center">\
                                    <div class="fbmtbAdImage">\
                                        <a href="' + escapeHTML(el[3]) + '" target="_blank"><img title="' + escapeHTML(el[1]) + '" src="' + escapeHTML(el[0]) + '" /></a>\
                                    </div>\
                                    <div class="fbmtbAdInfo">\
                                       <a style="direction:rtl;text-align:right" title="' + escapeHTML(el[1]) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(index) + '</a>\
                                       <button data-id="' + escapeHTML(el[4]) + '" id="fbmtbAdLikePage" class="_42ft _4jy0 _4jy3 _517h">\
                                            <img class="_3-8_ img" src="https://fbstatic-a.akamaihd.net/rsrc.php/v2/yZ/r/2KL1UzJC9rt.png" alt="" width="12" height="13">\
                                         Like Page\
                                       </button>\
                                    </div>\
                                </li>').appendTo($(".fbmtbAd.pagesURL"));
                        } else {
                            $('<li style="text-align:center">\
                                    <div class="fbmtbAdImage">\
                                        <a href="' + escapeHTML(el[3]) + '" target="_blank"><img title="' + escapeHTML(el[1]) + '" src="' + escapeHTML(el[0]) + '" /></a>\
                                    </div>\
                                    <div class="fbmtbAdInfo">\
                                       <a style="direction:ltr;text-align:left" title="' + escapeHTML(el[1]) + '" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(index) + '</a>\
                                       <button data-id="' + escapeHTML(el[4]) + '" id="fbmtbAdLikePage" class="_42ft _4jy0 _4jy3 _517h">\
                                            <img class="_3-8_ img" src="https://fbstatic-a.akamaihd.net/rsrc.php/v2/yZ/r/2KL1UzJC9rt.png" alt="" width="12" height="13">\
                                         Like Page\
                                       </button>\
                                    </div>\
                                </li>').appendTo($(".fbmtbAd.pagesURL"));
                        }
                    }
                });
                $("<div class='adByWebsite'><a target='_blank' href='http://www.mbanna.info/facebook-mention-tagging-blocker/'>FBMTB</a></div>").appendTo('.fbmtbAd.pagesURL');
            }//End pages ads
            showAdsOfPages = false;
        });
    }
    //-----------------------------------------------------------------------------------------//
    function escapeHTML(s) { 
        return s.replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }
    //-----------------------------------------------------------------------------------------//
    function handleRightColumChanges(mutation){
        var isMainPage = $("#stream_pagelet").length > 0 || $("#pagelet_group_").length > 0 ? true : false;
        if (isMainPage) {
            showPagesAds();
            showExternalAds();
        }
    }
    //-----------------------------------------------------------------------------------------//
    function handleBeeperBoxChildren(mutations,storage,usersArray){ 
        $(mutations).each(function(index,mutation){ 
            $(mutation.addedNodes).each(function(index2, target) {
            if (!$(target).is("li")) {
                return false;
            }
            var targetData = $(target).attr("data-gt");
            var prevTitle = $("title").text();
            targetData = JSON.parse(targetData);
            var notificationType = targetData.notif_type;
            var from_uids = targetData.from_uids;
            from_uids = typeof from_uids != "undefined" ? Object.keys(from_uids)[0].toString() : null;
            //Check if NOT blocked from all users and the specific user is NOT blocked
            if (from_uids &&(storage.stopFromAllUsers == "N" && $.inArray(from_uids, usersArray) == -1)) {
                return false;
            }
            var context_id = targetData.context_id;
            var fb_dtsg = $("input[type='hidden'][name='fb_dtsg']").first().val();
            if ((storage.onPostsSetting == "Y" && (notificationType == "group_post_mention" || notificationType == "tagged_with_story" || notificationType == "mention")) || (storage.onCommentsSetting == "Y" && ( notificationType == "mentions_comment" || notificationType == "comment_mention" || notificationType == "group_comment_mention") ) || (storage.onImagesSetting == "Y" && notificationType == "photo_tag")) {
                //Stop the audio
                $("audio").prop("muted", true);
                //Remove the notification box
                $(target).css({
                    "opacity": "0",
                    "transition": "none",
                    "visibility": "hidden"
                });
                //Remove jewel count
                var prevNotificationCount = parseInt($("#fbNotificationsJewel #notificationsCountValue").text());
                setTimeout(function() {
                    if (prevNotificationCount == 0) {
                        $("#fbNotificationsJewel").removeClass("hasNew");
                        $("#fbNotificationsJewel #notificationsCountValue").addClass("hidden_elem");
                        $("#fbNotificationsJewel #notificationsCountValue").text("0");
                    } else {
                        $("#fbNotificationsJewel #notificationsCountValue").text(prevNotificationCount);
                    }
                    //Title of the page
                    $("title").text(prevTitle);
                }, 50);
                //Mark as Readed:
                $.get("https://www.facebook.com/ajax/notifications/mark_read.php?seen=true&__user=" + getCookie("c_user") + "&alert_ids[0]=" + targetData.alert_id + "&fb_dtsg=" + fb_dtsg);
                //Send message to increase the number of blocked mentions
                chrome.runtime.sendMessage({
                    action: "mention"
                });
            }
            //Re open audio for other sounds
            setTimeout(function() {
                $("audio").prop("muted", false);
            }, 5000);

            });
        });
    }
    //-----------------------------------------------------------------------------------------//
    function notifJewelBoxChildren(mutations,storage,usersArray){
        $(mutations).each(function(index,mutation){
            $(mutation.addedNodes).each(function(index2, target) {
                if($(target).is("ul")){
                    $(target).find("li").each(function(index3, theLi){
                        loopOnLINotis(storage, theLi, usersArray);
                    });
                }else if (!$(target).is("li")) {
                    return false;
                }

                loopOnLINotis(storage, target, usersArray);
            });
        });
    }
    //-----------------------------------------------------------------------------------------//
    function getParameter(parameter, url) {
        var results = null;
        if (url) {
            results = new RegExp('[\\?&]' + parameter + '=([^&#]*)').exec(url);
        } 
        return results ? results[1] : null;
    }
    //-----------------------------------------------------------------------------------------//
    function loopOnLINotis(storage, theLIs, usersArray){ 
        var targetData = $(theLIs).attr("data-gt");
        var prevTitle = $("title").text();
        targetData = JSON.parse(targetData);
        var notificationType = targetData.notif_type;
        var from_uids = targetData.from_uids;
        if (typeof from_uids == "undefined" || Object.keys(from_uids).length > 1) {
            return true;
        }
        from_uids = Object.keys(from_uids)[0].toString();
        //Check if NOT blocked from all users and the specific user is NOT blocked
        if ((storage.stopFromAllUsers == "N" && $.inArray(from_uids, usersArray) == -1)) {
            return false;
        }
        var context_id = targetData.context_id;
        var fb_dtsg = $("input[type='hidden'][name='fb_dtsg']").first().val();
        if ((storage.onPostsSetting == "Y" && (notificationType == "group_post_mention" || notificationType == "tagged_with_story" || notificationType == "mention")) || (storage.onCommentsSetting == "Y" && (notificationType == "mentions_comment" || notificationType == "comment_mention" || notificationType == "group_comment_mention") ) || (storage.onImagesSetting == "Y" && notificationType == "photo_tag")) {
            //Remove the notification box
            $(theLIs).remove();
            chrome.runtime.sendMessage({
                action: "mention"
            });
        }
    }
}); //end on document loaded