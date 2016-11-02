// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

  //Constructor
  WTPLAN.DayList = function(params) {
      WTPLAN.Component.call(this);
      this.state = params;
    }
    //Extending Component
  WTPLAN.DayList.prototype = Object.create(WTPLAN.Component.prototype);
  WTPLAN.DayList.prototype.constructor = WTPLAN.DayList;

  //Methods
  WTPLAN.DayList.prototype.render = function() {
    var dayDivs = "";
    var i = 0;
    for (var i = 0; i <= this.state.numberOfDaysAfterToday; i++) {
       dayDivs = dayDivs + '<div id="day' + i + '"></div>';
    }
    return '<div>' + dayDivs + '</div>';
  };

  WTPLAN.DayList.prototype.componentDidMount = function(component) {
    var currentDay = WTPLAN.getLocalStartOfDay(this.state.currentDay);
    var i = 0;
    for (; i <= this.state.numberOfDaysAfterToday; i++) {
      new WTPLAN.DayListDay({
        'currentDay': new Date(currentDay.getTime()),
        'calendarItems': this.state.calendarItems,
        'openAddDialog': this.state.openAddDialog,
        'openEditDialog': this.state.openEditDialog,
        'removeItemAction': this.state.removeItemAction
      }).renderAt($('#day' + i));
      currentDay.setDate(currentDay.getDate() + 1);;
    }
  };

})()
