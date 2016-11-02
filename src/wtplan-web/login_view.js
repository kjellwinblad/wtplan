// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    //Constructor
    WTPLAN.LoginView = function(authenticateCallback) {
        WTPLAN.Component.call(this);
        this.authenticateCallback = authenticateCallback;
    }
    //Extending Component
    WTPLAN.LoginView.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.LoginView.prototype.constructor = WTPLAN.LoginView;

    //Methods
    WTPLAN.LoginView.prototype.render = function() {
        return WTPLAN.template(
            '\<div>\
                <p>Password:</p>\
                <input id="passwordField" type="password" style="width:100%"></input>\
                <p><button id="loginButton">Login</button></p>\
             </div>',
            {});

    };

    WTPLAN.LoginView.prototype.componentDidMount = function(component) {
        var outerThis = this;
        $("#loginButton").click(function() {
            var password = $("#passwordField").val();
            outerThis.authenticateCallback(password);
        });
    };

})()
