// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

  //Constructor
  WTPLAN.CalendarItem = function(calendarItemData, id) {
    this.date = calendarItemData.date;
    this.duration = calendarItemData.duration;
    this.description = calendarItemData.description;
    this.id = id;
  };

  WTPLAN.CalendarItem.prototype.startDate = function() {
    return new Date(this.date);
  };

  WTPLAN.CalendarItem.prototype.endDate = function() {
    var result = WTPLAN.durationRegExp.exec(this.duration);
    if (result[1] === "NA") {
      return this.startDate();
    }
    var hours = 0;
    var minutes = 0;
    if (result[2] != undefined) {
      hours = parseInt(result[2], 10);
    }
    if (result[3] != undefined) {
      minutes = parseInt(result[3], 10);
    }
    var endDate = new Date(this.startDate());
    endDate.setHours(endDate.getHours() + hours);
    endDate.setMinutes(endDate.getMinutes() + minutes);
    return endDate;
  };

  WTPLAN.CalendarItem.prototype.toPlainObject = function() {
    return {
      date: this.date,
      duration: this.duration,
      description: this.description
    };
  };

  WTPLAN.CalendarItem.prototype.toString = function() {
    return this.date;
  };

})();
