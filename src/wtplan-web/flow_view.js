// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    //Constructor
    WTPLAN.FlowView = function(openAddDialog, openEditDialog, removeItemAction) {
        WTPLAN.Component.call(this);
        this.state = {
            currentDay: WTPLAN.getLocalDayString(),
            numberOfDaysAfterToday: 9,
            calendarItems: [],
            'openAddDialog': openAddDialog,
            'openEditDialog': openEditDialog,
            'removeItemAction': removeItemAction
        }

        this._dayList = new WTPLAN.DayList(this.state);
    }
    
    //Extending Component
    WTPLAN.FlowView.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.FlowView.prototype.constructor = WTPLAN.FlowView;

    //Mathods
    WTPLAN.FlowView.prototype.render = function() {
        return WTPLAN.template(
            '<div>\
               <input type="text" id="dateInput" value="<%currentDay%>" size="10"/>\
               and the next <input type="text" id="daysInput" value="<%numberOfDaysAfterToday%>" size="4"/> day(s):\
               <br>\
               <br>\
               <div id=dayListDiv></div>\
             </div>',
            {currentDay: this.state.currentDay,
             numberOfDaysAfterToday: this.state.numberOfDaysAfterToday}
        );
    };

    WTPLAN.FlowView.prototype.componentDidMount = function(component) {
        var outerThis = this;
        $(component).find("#dateInput").on('change textInput input', function() {
            var date = new Date($(this).val());
            if (isNaN(date.getTime())) {
                $(this).css({
                    backgroundColor: 'red'
                });
            } else {
                $(this).css({
                    backgroundColor: ''
                });
                var newCurrentDay = WTPLAN.getLocalDayString(date);
                if (newCurrentDay != outerThis.state.currentDay) {
                    outerThis.state.currentDay = newCurrentDay;
                    outerThis._dayList.setState(outerThis.state);
                }
            }

        });
        $(component).find("#daysInput").on('change textInput input', function() {
            var days = parseInt($(this).val(), 10);
            if (isNaN(days)) {
                $(this).css({
                    backgroundColor: 'red'
                });
            } else {
                $(this).css({
                    backgroundColor: ''
                });
                if (days != outerThis.state.numberOfDaysAfterToday) {
                    outerThis.state.numberOfDaysAfterToday = days;
                    outerThis._dayList.setState(outerThis.state);
                }
            }

        });
        this._dayList.renderAt($('#dayListDiv'));
    };

})()
