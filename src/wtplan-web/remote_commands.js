// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {
    
    //Remote commands

    WTPLAN.remoteFetchCalendarItems = function(successCallback, errorCallback) {
        WTPLAN.serverRequest("/calendar_items", {}, function(itemsStr) {
            var items = JSON.parse(itemsStr);
            items = items.map(function(item, index) {
                return new WTPLAN.CalendarItem(item, index + 1);
            });
            successCallback(items)
        }, errorCallback);
    };


    WTPLAN.remoteAddCalendarItem = function(calendarItem, successCallback,
                                            errorCallback) {
        WTPLAN.serverRequest("/add_calendar_item", calendarItem.toPlainObject(), successCallback, errorCallback);
    };

    WTPLAN.remoteEditCalendarItem = function(calendarItem, id, successCallback,
                                             errorCallback) {
        var message = calendarItem.toPlainObject();
        message.id = "" + id;
        WTPLAN.serverRequest("/edit_calendar_item", message, successCallback, errorCallback);
    };

    WTPLAN.remoteRemoveCalendarItem = function(id, successCallback,
                                               errorCallback) {
        var message = {
            ids: ["" + id]
        };
        WTPLAN.serverRequest("/remove_calendar_item", message, successCallback, errorCallback);
    };

    WTPLAN.loginTokenRequest = function(password, successCallback, errorCallback) {
        var message = {
            password: password
        };
        function success(dataStr){
            var data = JSON.parse(dataStr);
            WTPLAN.loginToken = data.loginToken;
            successCallback();
        }
        WTPLAN.serverRequest("/login_token_request", message, success, errorCallback, true);
    };

    WTPLAN.logoutRequest = function(successCallback, errorCallback) {
        var message = {
            loginToken: WTPLAN.loginToken
        };
        WTPLAN.serverRequest("/logout", message, successCallback, errorCallback, true);
    };


})();
