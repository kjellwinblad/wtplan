// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    function validateDurationFiled() {
        var str = $('#durationField').val();
        var result = WTPLAN.durationRegExp.exec(str);
        return result != null && str == result[0];
    }

    function validateDateFiled() {
        var str = $('#dateField').val();
        var result = WTPLAN.rfc3339regexp.exec(str);
        return result != null && str == result[0];
    }

    function validateDescriptionFiled() {
        var str = $('#descriptionField').val();
        return str != "";
    }

    //Constructor
    WTPLAN.EditItemView = function(calendarItem, saveCallback, cancelCallback) {
        WTPLAN.Component.call(this);
        this.state.calendarItem = calendarItem;
        this.saveCallback = saveCallback;
        this.cancelCallback = cancelCallback;
    }
    //Extending Component
    WTPLAN.EditItemView.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.EditItemView.prototype.constructor = WTPLAN.EditItemView;

    //Methods
    WTPLAN.EditItemView.prototype.render = function() {
        return WTPLAN.template(
            '\<div>\
                <button id="saveButton">Save</button>\
                <button id="cancelButton">Cancel</button>\
                <hr/>\
                Date (RFC3339):\
                <input id="dateField" type="text" style="width:100%" value="<%date%>"/>\
                <br/>\
                Duration (e.g. NA, 2h, 2h20m):\
                <input id="durationField" type="text" style="width:100%" value="<%duration%>"/>\
                <br/>\
                Description:\
                <textarea id="descriptionField" style="width:100%" rows="10"><%description%></textarea>\
             </div>',
            {date: this.state.calendarItem.date,
             duration: this.state.calendarItem.duration,
             description: this.state.calendarItem.description});

    };

    WTPLAN.EditItemView.prototype.componentDidMount = function(component) {
        var outerThis = this;
        $("#saveButton").click(function() {
            if (!validateDateFiled()) {
                alert("The date filed contains an invalid date.");
                return;
            }
            if (!validateDurationFiled()) {
                alert("The duration filed contains an invalid date.");
                return;
            }
            if (!validateDescriptionFiled()) {
                alert("The description filed is empty.");
                return;
            }
            outerThis.saveCallback(new WTPLAN.CalendarItem({
                date: $("#dateField").val(),
                duration: $("#durationField").val(),
                description: $("#descriptionField").val()
            }));
        });
        $("#cancelButton").click(function() {
            outerThis.cancelCallback();
        });
        $("#dateField").on('change textInput input', function() {
            if (!validateDateFiled()) {
                $(this).css({
                    backgroundColor: 'red'
                });
            } else {
                $(this).css({
                    backgroundColor: ''
                });
            }
        });
        $("#durationField").on('change textInput input', function() {
            if (!validateDurationFiled()) {
                $(this).css({
                    backgroundColor: 'red'
                });
            } else {
                $(this).css({
                    backgroundColor: ''
                });
            }
        });
    };

})()
