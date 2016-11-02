// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    WTPLAN.rfc3339regexp =
        /([0-9]+)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])[Tt]([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60)(\.[0-9]+)?(([Zz])|([\+|\-]([01][0-9]|2[0-3]):[0-5][0-9]))/;

    WTPLAN.durationRegExp = /^(\s*NA\s*)|\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*$/;


    WTPLAN.serverRequest = function(url, dataObject, successCallback, errorCallback, noAuth){
       var requestFun;
       requestFun = function(){
           if(WTPLAN.loginToken === "NOT_AUTHENTICATED" && (noAuth !== true)) {
               errorCallback("NOT_AUTHENTICATED", requestFun);
               return;
           }
           if(dataObject !== null && noAuth !== true){
               dataObject.loginToken = WTPLAN.loginToken;
           }
           $.ajax({
               url: url,
               data: JSON.stringify(dataObject),
               type: 'POST',
               success: successCallback,
               error:function(msg){
                   errorCallback(msg.responseText, requestFun);                   
               }
           });
       };
       requestFun();
   };

  WTPLAN.addCalendarItem = function(calendarItems, calendarItem) {
    calendarItems.push(calendarItem);
    calendarItems.sort(function(item1, item2) {
      return item1.startDate().getTime() - item2.startDate().getTime();
    });
    calendarItems.forEach(function(item, index) {
      item.id = index + 1;
    });
  };

  WTPLAN.updateCalendarItem = function(calendarItems, oldItem, newItem) {
    calendarItems.splice(oldItem.id - 1, 1);
    WTPLAN.addCalendarItem(calendarItems, newItem);
  };

  WTPLAN.removeCalendarItem = function(calendarItems, id) {
    calendarItems.splice(id - 1, 1);
    calendarItems.forEach(function(item, index) {
      item.id = index + 1;
    });
  };

  WTPLAN.dayStringFromDate = function(date) {
    var day = date.getDay();
    if (day === 0) {
      return "Sunday";
    } else if (day === 1) {
      return "Monday";
    } else if (day === 2) {
      return "Tuesday";
    } else if (day === 3) {
      return "Wednesday";
    } else if (day === 4) {
      return "Thursday";
    } else if (day === 5) {
      return "Friday";
    } else if (day === 6) {
      return "Saturday";
    }
  };

  WTPLAN.getLocalStartOfDay = function(dateString) {
    var local = new Date(dateString);
    local.setMinutes(local.getMinutes() + local.getTimezoneOffset());
    return local;
  };


  WTPLAN.getLocalDayString = function(date) {
    var local;
    if (date === undefined) {
      local = new Date();
    } else {
      local = new Date(date);
    }
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().split("T")[0];
  };

  WTPLAN.dateToRfc3339String = function(dateParam) {
    var date;
    if (dateParam === undefined) {
      date = new Date();
    } else {
      date = dateParam;
    }

    function pad(num) {
      var str = "" + num;
      var tmp = ('0' + num);
      return tmp.substring(str.length - 1, str.length + 1);
    }
    var offset = date.getTimezoneOffset();
    var absOffset = Math.abs(offset);
    var offsetMinutes = absOffset % 60;
    var offsetHours = (absOffset - offsetMinutes) / 60;
    return (
      date.getFullYear() + "-" +
      pad(date.getMonth() + 1) + "-" +
      pad(date.getDate()) + "T" +
      pad(date.getHours()) + ":" +
      pad(date.getMinutes()) + ":" +
      pad(date.getSeconds()) +
      (offset === 0 ? "Z" :
        ((offset < 0 ? "+" : "-") +
          pad(offsetHours) + ":" +
          pad(offsetMinutes))));
  };


    WTPLAN.template = function(string, varDict) {
        Object.keys(varDict).forEach(function(vari){
            string = string.replace(new RegExp('\<%'+vari+'%\>', 'g'), varDict[vari]);   
        });
        return string;
    };
    
})();
