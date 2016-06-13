/**
 * This code has been written by: Mohammad M. AlBanna
 * Website: MBanna.info 
 * Facebook: FB.com/MBanna.info
 * Copyright © 2016 Mohammad M. AlBanna
 */

$(function() {
    var facebookPattern = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/;
    //Tabs
     $('ul.tabs li').click(function() {
        $('.tab-content').enscroll("destroy");
        var tab_id = $(this).attr('data-tab');
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        clearContent();
        if(tab_id == "tab-4"){ 
            loadProducts();
        }
        else if(tab_id == "tab-5"){
            $(".social-media").prepend('<iframe src="https://www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2FMBanna.info&amp;width=250&amp;height=210&amp;colorscheme=light&amp;show_faces=true&amp;header=false&amp;stream=false&amp;show_border=false&amp;appId=627072280724068" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:250px; height:150px;" allowTransparency="true"></iframe>');
        }

        $(this).addClass('current');
        $("#" + tab_id).addClass('current');

        $('.current.tab-content').enscroll({
            verticalTrackClass: 'track4',
            verticalHandleClass: 'handle4',
            minScrollbarLength: 28,
            showOnHover: false
        });
    });
    //--------------------Scroll ------------------//
    $('.current.tab-content').enscroll({
        verticalTrackClass: 'track4',
        verticalHandleClass: 'handle4',
        minScrollbarLength: 28,
        showOnHover: false
    });

	//----------------------------------------------------------------------------------//
    //Load Setting
    chrome.storage.sync.get(["stopFromAllUsers","allowFromAllUsers","onCommentsSetting","onPostsSetting","onImagesSetting"],function(result){
        if(typeof result.stopFromAllUsers !== "undefined" && result.stopFromAllUsers == "Y"){
    		$("input[type='checkbox']#stopFromAllUsers").prop("checked", true);
    	}else{
    		$("input[type='checkbox']#stopFromAllUsers").prop("checked", false);
    	}

    	if(typeof result.allowFromAllUsers !== "undefined" && result.allowFromAllUsers == "Y"){
    		$("input[type='checkbox']#allowFromAllUsers").prop("checked", true);
            $("#tab-2 input").attr("disabled","disabled");
            $("input[type='checkbox']#allowFromAllUsers").removeAttr("disabled");
    	}else{
    		$("input[type='checkbox']#allowFromAllUsers").prop("checked", false);
    	}

        if( result.onCommentsSetting == "Y"){
            $("input[type='checkbox']#onCommentsSetting").prop("checked", true);
        }else{
            $("input[type='checkbox']#onCommentsSetting").prop("checked", false);
        }

        if(result.onPostsSetting == "Y"){
            $("input[type='checkbox']#onPostsSetting").prop("checked", true);
        }else{
            $("input[type='checkbox']#onPostsSetting").prop("checked", false);
        }


        if(result.onImagesSetting == "Y"){
            $("input[type='checkbox']#onImagesSetting").prop("checked", true);
        }else{
            $("input[type='checkbox']#onImagesSetting").prop("checked", false);
        }

    });
	//----------------------------------------------------------------------------------//
    //get users from storage
    chrome.storage.sync.get(null, function(result) {
        $.each(result, function(index, data) {
            if (!isNaN(index)) {
                var userObj = JSON.parse(data);
                var username = userObj.username != undefined ? userObj.username : "No Username";
                $(".fb-blocked-users").append('<li class="fb-users" id="'+userObj.id+'">\
                    <div class="fb-user-image">\
                        <img src="https://graph.facebook.com/' + userObj.id + '/picture" />\
                    </div>\
                    <div class="fb-user-info">\
                        <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + userObj.name + '</a>\
                        <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + username + '</a>\
                    </div>\
                    <div class="remove-btn">\
                        <a class="uibutton confirm removeBtn" data-userId="' + userObj.id + '" href="#">Remove</a>\
                    </div>\
                </li>');
            }
        });
        
        if($("input#stopFromAllUsers").is(":checked") && $(".fb-blocked-users li").length == 0){
            $(".fb-blocked-users").append("<h1 style='text-align:center;margin-top:50px;'>I suggest to you close your account entirely on Facebook!</h1>");
        }
        else if($(".fb-blocked-users li").length == 0){
            $(".fb-blocked-users").append("<h1 style='text-align:center;margin-top:50px;'>How in peace you are!</h1>");
        }
    });
	//----------------------------------------------------------------------------------//
    //On remove button
    $("body").on("click", "a.confirm.removeBtn", function(e) {
        e.preventDefault();
        var userId = $(this).attr("data-userId");
        if (!isNaN(userId)) {
            $(this).parents(".fb-users").remove();
            chrome.storage.sync.remove(userId);
        }
    });
    //----------------------------------------------------------------------------------//
    //On remove ALL button
    $("body").on("click", "a.removeAllBtn", function(e) {
        e.preventDefault();
        chrome.storage.sync.get(null, function(result) {
        $.each(result, function(index, data) {
            if (!isNaN(index)) {
                chrome.storage.sync.remove(index);
            }
        });
    });
        $(".fb-blocked-users li").remove();
    });
	//----------------------------------------------------------------------------------//
    //Save extension setting block from all or allow from all
    $("body").on("change", "input#stopFromAllUsers", function() {
        var value = null;
        var obj = {};
        var key = "stopFromAllUsers";
        obj[key] += "stopFromAllUsers";
        if ($(this).is(":checked")) {
            obj[key] = "Y";
            $("input[type='checkbox']#allowFromAllUsers").prop("checked", false);
             obj["allowFromAllUsers"] += "allowFromAllUsers";
             obj["allowFromAllUsers"] = "N";
        } else {
            obj[key] = "N";
        }
        
        chrome.storage.sync.set(obj);
    });
    //----------------------------------------------------------------------------------//
     $("body").on("change", "input#allowFromAllUsers", function() {
        var obj = {};
        var key = $(this).attr("id");
        obj[key] += $(this).attr("id");
        if ($(this).is(":checked")) {
            obj[key] = "Y";
            $("input[type='checkbox']#stopFromAllUsers").prop("checked", false);
            obj["stopFromAllUsers"] += "stopFromAllUsers";
            obj["stopFromAllUsers"] = "N";
            $("#tab-2 input").attr("disabled","disabled");
            $(this).removeAttr("disabled");
        } else {
            obj[key] = "N";
             $("#tab-2 input").removeAttr("disabled");
        }
        chrome.storage.sync.set(obj);
    });

    //On Setting 
    $("body").on("change", "input[name='onCommentsSetting']", function() {
        var value = null;
        if ($(this).is(":checked")) {
            value = "Y";
        } else {
            value = "N";
        }
        syncStorage("onCommentsSetting", value);
    });

    $("body").on("change", "input[name='onPostsSetting']", function() {
        var value = null;
        if ($(this).is(":checked")) {
            value = "Y";
        } else {
            value = "N";
        }
        syncStorage("onPostsSetting", value);
    });

    $("body").on("change", "input[name='onImagesSetting']", function() {
        var value = null;
        if ($(this).is(":checked")) {
            value = "Y";
        } else {
            value = "N";
        }
        syncStorage("onImagesSetting", value);
    });

     //----------------------------------------------------------------------------------//
    //filter users
    var timer;
    $("body").on("keypress","input[name='searchUsers']", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            $(".fb-blocked-users li").hide();
            $(".fb-user-info a:contains("+$("input[name='searchUsers']").val()+")").parents(".fb-users").fadeIn("fast");
        }, 100);
    }).on('keydown', function(e) {
        if (e.keyCode == 8)
            if ($(this).val() == '') {
               $(".fb-blocked-users li").fadeIn("fast");
            }
    });

      //--------------------Ignore contains case sensitive ------------------//
    $.expr[":"].contains = $.expr.createPseudo(function(arg) {
        return function(elem) {
            return $(elem).text().toUpperCase().indexOf($.trim(arg.toUpperCase())) >= 0;
        };
    });

    //---------------------------------------Share Buttons------------//
    $("#twitterShare").on("click",function(){
        window.open("https://twitter.com/share?via=_MBanna&text=Hi there, I'm using Facebook Mention Tagging Blocker chrome extension! Try it Now: http://goo.gl/UQIqDM");
    });

    $("#facebookShare").on("click",function(){
        chrome.browserAction.getBadgeText({},function(result){
                result = parseInt(result);
                if(typeof result !== "undefined" && !isNaN(result) && result > 0){
                    window.open("https://www.facebook.com/dialog/feed?app_id=627072280724068&ref=adcounter&link=http://goo.gl/UQIqDM&name=I'm using Facebook Mention Tagging Blocker chrome extension to block, hide mention tagging from Facebook's users, it blocked "+(result)+" mention(s)/tag(s)! Try it Now&redirect_uri=https://www.facebook.com&actions=%5B%7B%22name%22%3A%22Download%20More%20Extensions%22%2C%22link%22%3A%22http%3A%2F%2Fgoo.gl/YuwJ5P%22%7D%5D");
                }else{
                    window.open("https://www.facebook.com/dialog/feed?app_id=627072280724068&ref=adcounter&link=http://goo.gl/UQIqDM&name=I'm using Facebook Mention Tagging Blocker chrome extension to block, hide mention tagging from Facebook's users! Try it Now&redirect_uri=https://www.facebook.com&actions=%5B%7B%22name%22%3A%22Download%20More%20Extensions%22%2C%22link%22%3A%22http%3A%2F%2Fgoo.gl/YuwJ5P%22%7D%5D");
                    }
            });
    });

    $("#googlePlusShare").on("click",function(){
        window.open("https://plus.google.com/share?url=http://goo.gl/UQIqDM");
    });

     //----------------------------------------------------------------------------------//
    //Block user by his URL
    $("body").on("click", "a.blockUserById", function(e) {
        e.preventDefault();
        var url = $("#tab-3 input[name='userId']").val();
        url = url.trim() && facebookPattern.exec(url) ? url : null;
        if (url) {
            blockUserByURL(url);
        }else{
            $("#tab-3 input[name='userId']").val("Please check the profile URL!");
        }
    });

    //----------------------------------------------------------------------------------//
    //is current user profile to show block red button?
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        currentUserObject(tabs[0].url,function(userData){
            if(typeof userData != "undefined" && userData.id){
               isBlocked(userData.id);
            }else{
                $(".uibutton.blockCurrentUser").hide();
            }
        });
    });
    //----------------------------------------------------------------------------------//
    function blockUserByURL(url) {
        currentUserObject(url,function(userObj){
            if (typeof userObj != "undefined" && userObj.id) {
                var data = JSON.stringify(userObj);
                var obj = {};
                var key = userObj.id;
                obj[key] += userObj.id;
                obj[key] = data;
                chrome.storage.sync.set(obj);
                $("#tab-3 input[name='userId']").val("");
                var username = userObj.username != undefined ? userObj.username : "No Username";
                $(".fb-blocked-users h1").remove();
                $(".fb-blocked-users").append('<li class="fb-users" id="'+userObj.id+'">\
                    <div class="fb-user-image">\
                        <img src="https://graph.facebook.com/' + userObj.id + '/picture" />\
                    </div>\
                    <div class="fb-user-info">\
                        <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + userObj.name + '</a>\
                        <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + username + '</a>\
                    </div>\
                    <div class="remove-btn">\
                        <a class="uibutton confirm removeBtn" data-userId="' + userObj.id + '" href="#">Remove</a>\
                    </div>\
                </li>');

                $('ul.tabs li').removeClass('current');
                $('.tab-content').removeClass('current');
                $("#tab-1").addClass("current");
                $("ul.tabs li").eq(0).addClass("current");
            } else{
                $("#tab-3 input[name='userId']").val("Are you logged in Facebook?!");
            }
        });
    }

    //----------------------------------------------------------------------------------//
    function getParameter(parameter, url) {
        var results = null;
        if (url) {
            results = new RegExp('[\\?&]' + parameter + '=([^&#]*)').exec(url);
        } 
        return results ? results[1] : null;
    }
    //----------------------------------------------------------------------------------//
    function currentUserObject(url,callback){
        $(".blockLoaderImage").show();
        var username = facebookPattern.exec(url) === null ? null : facebookPattern.exec(url)[1];
        var id = null;
        var name = null;
        if(username && username != "profile.php"){
            $.ajax({
                type: 'GET',
                url: 'https://www.facebook.com/' + username,
                success: function(data) {
                    id = data.match(/(fb:\/\/profile\/[0-9A-Zaz]+)/i);
                    id = id ? id[0].replace(/(fb:\/\/profile\/)/i,"") : null;
                    username = username;
                    name = data.match(/<span id="fb-timeline-cover-name">(.*?)<\/span>/i);
                    name = name ? name[1] : "No Name";
                    $(".blockLoaderImage").hide();
                    callback.call(this,{id:id,name:name,username:username});
                },
                error: function(){
                    $(".blockLoaderImage").hide();
                    callback.call(this);
                }
            });
        }else if(username == "profile.php" || username){
            var idParameter = getParameter("id", url);
            if (idParameter) {
                id = idParameter;
                $.ajax({
                    type: 'GET',
                    url: 'https://www.facebook.com/profile.php?id=' + id,
                    success: function(data) {
                        username = null;
                        name = data.match(/<span id="fb-timeline-cover-name">(.*?)<\/span>/i);
                        name = name ? name[1] : "No Name";
                        $(".blockLoaderImage").hide();
                        callback.call(this,{id:id,name:name,username:username});
                    },
                    error: function(){
                        $(".blockLoaderImage").hide();
                        callback.call(this);
                    }
                });
            } else {
                $(".blockLoaderImage").hide();
                callback.call(this);
            }
        }else{
            $(".blockLoaderImage").hide();
            callback.call(this);
        }
    }
   //----------------------------------------------------------------------------------//
    function isBlocked(userId) {
        if(typeof userId != "undefined"){
            chrome.storage.sync.get(null, function(result) {
                var allKeys = Object.keys(result);
                if($.inArray(userId, allKeys) != -1){
                    $(".uibutton.blockCurrentUser").text("Unblock this user from @")
                    $(".uibutton.blockCurrentUser").attr("data-action","unblock");
                }else{
                    $(".uibutton.blockCurrentUser").text("Block this user from @")
                    $(".uibutton.blockCurrentUser").attr("data-action","block");
                }
                $(".uibutton.blockCurrentUser").show();
                $(".uibutton.blockCurrentUser").attr("data-userId",userId);
            });
        }
    }
    //----------------------------------------------------------------------------------//
    $("body").on("click", ".blockCurrentUser", function() {
        var action = $(this).attr("data-action");
        var userId = $(this).attr("data-userId");
        if (action == "block") {
            chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                currentUserObject(tabs[0].url,function(userObj){
                    if(typeof userObj != "undefined"){
                        var data = JSON.stringify(userObj);
                        var obj = {};
                        var key = userId;
                        obj[key] += userId;
                        obj[key] = data
                        chrome.storage.sync.set(obj);
                        var username = userObj.username != undefined ? userObj.username : "No Username";
                        $(".fb-blocked-users h1").remove();
                        $(".fb-blocked-users").append('<li class="fb-users" id="'+userObj.id+'">\
                                <div class="fb-user-image">\
                                    <img src="https://graph.facebook.com/' + userObj.id + '/picture" />\
                                </div>\
                                <div class="fb-user-info">\
                                    <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + userObj.name + '</a>\
                                    <a target="_blank" href="https://www.facebook.com/' + userObj.id + '">' + username + '</a>\
                                </div>\
                                <div class="remove-btn">\
                                    <a class="uibutton confirm removeBtn" data-userId="' + userObj.id + '" href="#">Remove</a>\
                                </div>\
                            </li>');
                        $(".uibutton.blockCurrentUser").text("Unblock this user from @")
                        $(".uibutton.blockCurrentUser").attr("data-action","unblock");
                    }
                });
            });
        } else {
            chrome.storage.sync.remove(userId);
            $("#"+userId).remove();
            $(".uibutton.blockCurrentUser").text("Block this user from @")
            $(".uibutton.blockCurrentUser").attr("data-action","block");
        }
    });
    //----------------------------------------------------------------------------------//
    function escapeHTML(s) { 
        return s.replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }
    //----------------------------------------------------------------------------------//
    function syncStorage(key, value) {
        var obj = {};
        var key = key;
        obj[key] += key;
        obj[key] = value;
        chrome.storage.sync.set(obj);
    }
    //--------------------View Products ------------------//
    function loadProducts(){
        $.getJSON("http://www.mbanna.info/extensions/products.json", function(json, textStatus) {
            if (json.length <= 0) {
                return;
            }
            
            $.each(json, function(index, el) {
                var node = $('<li class="products-list">\
                        <div class="products-list-image">\
                            <img src="'+escapeHTML(el[2])+'" />\
                        </div>\
                        <div class="products-info">\
                            <a title="'+ escapeHTML(el[0]) +'" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(el[0]) + '</a>\
                            <a title="'+ escapeHTML(el[1]) +'" target="_blank" href="' + escapeHTML(el[3]) + '">' + escapeHTML(el[1]) + '</a>\
                        </div>\
                    </li>').appendTo($(".my-products-list")); 
            });
        });
    }
    //----------------------------------------------------------------------------------//
    function clearContent(){
        $(".my-products-list").html("");
        $(".social-media iframe").remove();
    }

});