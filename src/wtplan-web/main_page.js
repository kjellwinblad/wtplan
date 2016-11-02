// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {


    //The MainPage component

    //Constructor
    WTPLAN.MainPage = function(showLogoutButton) {
        WTPLAN.Component.call(this);
        this.state = {
            outgoingRequest: true,
            page: "MAIN_PAGE",
            message: "",
            isErrorMessage: false,
            calendarItems: [],
            showLogoutButton: showLogoutButton
        }
        this._flowView = new WTPLAN.FlowView(
            this.openAddDialog.bind(this),
            this.openEditDialog.bind(this),
            this.removeItemAction.bind(this)
        );
        var outerThis = this;
        WTPLAN.remoteFetchCalendarItems(function(items) {
            outerThis.state.calendarItems = items;
            outerThis.state.outgoingRequest = false;
            outerThis.setState(outerThis.state);
        }, this.handleNotAuth(function(errorText) {
            outerThis.state.message = errorText;
            outerThis.state.isErrorMessage = true;
            outerThis.state.outgoingRequest = false;
            outerThis.setState(outerThis.state);
        }));
    }
    //Extending Component
    WTPLAN.MainPage.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.MainPage.prototype.constructor = WTPLAN.MainPage;

    //Render methods
    WTPLAN.MainPage.prototype.render = function() {
        if (this.state.outgoingRequest) {
            return "<div>Loading...</div>";
        } else if (this.state.page === "MAIN_PAGE") {
            return WTPLAN.template(
                '<div>\
                   <button id="mainAddButton">Add Item</button>\
                   <%logoutButton%>\
                   <hr/>\
                   <%message%>\
                   <div id="calendarViewMountPoint"/>\
                 </div>',{
                     message: (this.state.message ? (this.state.message + "<br/>") : ""),
                     logoutButton: (this.state.showLogoutButton ? '<button id="logoutButton">Logout</button>': "")
                 });
        } else if (this.state.page === "EDIT_CALENDAR_ITEM_PAGE") {
            return '<div><div id="editCalendarItemPageDiv"></div></div>';
        } else if (this.state.page === "LOGIN_PAGE") {
            return '<div><div id="loginPageDiv"></div></div>';
        }
        

    };

    WTPLAN.MainPage.prototype.componentDidMount = function(component) {
        if (!this.state.outgoingRequest) {
            if (this.state.page === "MAIN_PAGE") {
                this._flowView.state.calendarItems = this.state.calendarItems;
                this._flowView.renderAt($("#calendarViewMountPoint"));
                $('#mainAddButton').click(function() {
                    this.openAddDialog(WTPLAN.dateToRfc3339String(WTPLAN.getLocalStartOfDay(
                        WTPLAN.getLocalDayString())));
                }.bind(this));
                if(this.state.showLogoutButton){
                    $('#logoutButton').click(function() {
                        this.showLoadingPage();
                        WTPLAN.logoutRequest(
                            function(){
                                window.location.reload();
                            },
                            function(errorStr){
                                this.showMainPage();
                                alert(errorStr);
                            }.bind(this));
                    }.bind(this));
                }
            } else if (this.state.page === "EDIT_CALENDAR_ITEM_PAGE") {
                this._editItemView.renderAt($("#editCalendarItemPageDiv"));
            } else if (this.state.page === "LOGIN_PAGE") {
                this._loginPage.renderAt($("#loginPageDiv"));
            }
        }
    };

    //Utility methods

    WTPLAN.MainPage.prototype.showLoginPage = function(retryFunction) {
        var oldPage = this.state.page;
        this.state.page = "LOGIN_PAGE";
        this._loginPage = new WTPLAN.LoginView(
            function(password){
                this.showLoadingPage();
                WTPLAN.loginTokenRequest(
                    password,
                    function(){
                        this.state.outgoingRequest = false;
                        this.state.page = oldPage;
                        this.setState(this.state);
                        this.showLoadingPage();
                        retryFunction();
                    }.bind(this),
                    function(errorStr){
                        this.state.outgoingRequest = false;
                        alert(errorStr);
                        this.state.page = oldPage;
                        this.showLoginPage(retryFunction);
                    }.bind(this))
            }.bind(this)
        );
        this.setState(this.state);
    }
    
    WTPLAN.MainPage.prototype.handleNotAuth = function(secondErrorHandler) {
        var outerThis = this;
        return function(errorString, retryFunction){
            if(errorString.startsWith("NOT_AUTHENTICATED")) {
                outerThis.state.outgoingRequest = false;
                outerThis.showLoginPage(retryFunction);
            } else {
                secondErrorHandler(errorString);
            }
        }
    }
    
    WTPLAN.MainPage.prototype.showCalendarItemPage = function(calendarItem,
                                                              successCallback) {
        var outerThis = this;
        this._editItemView = new WTPLAN.EditItemView(calendarItem,
                                                     function(item) {
                                                         outerThis.showMainPage();
                                                         successCallback(item);
                                                     },
                                                     function() {
                                                         outerThis.showMainPage();
                                                     });
        this.state.page = "EDIT_CALENDAR_ITEM_PAGE";
        this.setState(this.state);
    };

    WTPLAN.MainPage.prototype.showMainPage = function() {
        this.state.outgoingRequest = false;
        this.state.page = "MAIN_PAGE";
        this.setState(this.state);
    };

    WTPLAN.MainPage.prototype.showLoadingPage = function() {
        this.state.outgoingRequest = true;
        this.setState(this.state);
    }

    //Helper functions
    WTPLAN.MainPage.prototype.openAddDialog = function(dateString) {
        var calendarItemTemplate = {
            date: dateString,
            duration: "NA",
            description: ""
        };
        var outerThis = this;
        outerThis.showCalendarItemPage(
            new WTPLAN.CalendarItem(calendarItemTemplate),
            function(item) {
                WTPLAN.addCalendarItem(outerThis.state.calendarItems, item);
                outerThis.showLoadingPage();
                WTPLAN.remoteAddCalendarItem(
                    item,
                    function() {
                        outerThis.showMainPage();
                    },
                    this.handleNotAuth(function(error) {
                        alert(error)
                        outerThis.showMainPage();
                    }));
            }.bind(this));
    };

    WTPLAN.MainPage.prototype.openEditDialog = function(calendarItem) {
        var outerThis = this;
        outerThis.showCalendarItemPage(
            calendarItem,
            function(item) {
                WTPLAN.updateCalendarItem(outerThis.state.calendarItems,
                                          calendarItem, item);
                outerThis.showLoadingPage();
                WTPLAN.remoteEditCalendarItem(
                    item, calendarItem.id,
                    function() {
                        outerThis.showMainPage();
                    },
                    this.handleNotAuth(function(error) {
                        alert(error)
                        outerThis.showMainPage();
                    }));
            }.bind(this));
    };

    WTPLAN.MainPage.prototype.removeItemAction = function(id) {
        var outerThis = this;
        WTPLAN.removeCalendarItem(outerThis.state.calendarItems, id);
        outerThis.showLoadingPage();
        WTPLAN.remoteRemoveCalendarItem(
            id,
            function() {
                outerThis.showMainPage();
            },
            this.handleNotAuth(function(error) {
                alert(error)
                outerThis.showMainPage();
            }));
    };

})();
