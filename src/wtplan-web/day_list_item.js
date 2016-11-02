// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    var dayListItemIdCounter = 0;

    //Constructor
    WTPLAN.DayListItem = function(state) {
        WTPLAN.Component.call(this);
        this.dayListItemId = dayListItemIdCounter;
        dayListItemIdCounter = dayListItemIdCounter + 1;
        this.state = state;
    }
    //Extending Component
    WTPLAN.DayListItem.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.DayListItem.prototype.constructor = WTPLAN.DayListItem;

    //Methods
    WTPLAN.DayListItem.prototype.render = function() {
        var currentDayTime = this.state.currentDay.getTime();
        var nextDayTime = this.state.nextDay.getTime();
        var startDate = this.state.calendarItem.startDate();
        var startDateTime = startDate.getTime();
        var endDate = this.state.calendarItem.endDate();
        var endDateTime = endDate.getTime();
        var hoursStart = startDate.getHours();
        var minutesStart = startDate.getMinutes();
        var hoursEnd = endDate.getHours();
        var minutesEnd = endDate.getMinutes();

        function pad(i) {
            var str = "" + i;
            return ('00' + str).substring(str.length);
        }
        var timeString = undefined;
        if ((startDateTime >= currentDayTime && startDateTime < nextDayTime) &&
            (endDateTime >= currentDayTime && endDateTime < nextDayTime)) {
            //Both end and start date are inside day
            timeString = pad(hoursStart) + ":" + pad(minutesStart);
            if (startDate.getTime() != endDate.getTime()) {
                timeString = timeString + "-" + pad(hoursEnd) + ":" + pad(minutesEnd);
            }
        } else if (startDateTime >= currentDayTime && startDateTime < nextDayTime) {
            // Start date in day
            timeString = pad(hoursStart) + ":" + pad(minutesStart) + "-(->)";
        } else if (endDateTime >= currentDayTime && endDateTime < nextDayTime) {
            // End date in day
            timeString = "(<-)-" + pad(hoursEnd) + ":" + pad(minutesEnd);
        } else if (startDateTime < currentDayTime && endDateTime >= nextDayTime) {
            //Start date before day and end date after day
            timeString = "(<-)-(->)";
        }
        return WTPLAN.template(
            '<div style="border-top: 1px solid black;padding:0.15em;" class="grayOnHover">\
               <div id="itemHeader">\
                 <div style="float:left;"><i><%timeString%></i></div>\
                 <button id="editButton<%dayListItemId%>" style="float:right;display:inline-block;">Edit</button>\
                 <button id="removeButton<%dayListItemId%>" style="float:right;display:inline-block;">Remove</button><br/>\
               </div>\
               <%description%>\
             </div>',
            {timeString: timeString,
             dayListItemId: this.dayListItemId,
             description: this.state.calendarItem.description});

    };

    WTPLAN.DayListItem.prototype.componentDidMount = function(component) {
        var outerThis = this;
        $('#editButton' +outerThis.dayListItemId).click(function() {
            outerThis.state.openEditDialog(outerThis.state.calendarItem);
        });
        $('#removeButton' + outerThis.dayListItemId).click(function() {
            outerThis.state.removeItemAction(outerThis.state.calendarItem.id);
        });
    };

})();
