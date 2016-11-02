// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {

    //Constructor
    WTPLAN.DayListDay = function(state) {
        WTPLAN.Component.call(this);
        this.state = state;
    }
    //Extending Component
    WTPLAN.DayListDay.prototype = Object.create(WTPLAN.Component.prototype);
    WTPLAN.DayListDay.prototype.constructor = WTPLAN.DayListDay;

    //Methods
    WTPLAN.DayListDay.prototype.render = function() {
        var currentDay = this.state.currentDay;
        var nextDay = new Date(currentDay.getTime());
        nextDay.setDate(currentDay.getDate() + 1);
        var itemsToday = this.state.calendarItems.filter(function(item) {
            var itemStartDate = item.startDate();
            var itemEndDate = item.endDate();
            return (itemStartDate.getTime() >= currentDay.getTime() &&
                    itemStartDate < nextDay.getTime()) ||
                (itemEndDate.getTime() >= currentDay.getTime() &&
                 itemEndDate < nextDay.getTime()) ||
                (itemStartDate.getTime() < currentDay.getTime() &&
                 itemEndDate >= nextDay.getTime());
        });
        this.tmpItemItemDivIdList = itemsToday.map(function(item, index) {
            return {
                'item': item,
                itemId: "item" + index
            };
        });
        var itemDivs = this.tmpItemItemDivIdList.reduce(function(acc, curr) {
            return acc + '<div data-itemId="' + curr.itemId + '"/>';
        }, "");
        var dayHeader = WTPLAN.template(
            '<div style="height:2.2em;" class="grayOnHover">\
               <span style="float:left;"><b><%localDateString%> <i><%localDayString%></i></b></span>\
               <button id="addButton<%componentId%>" style="float:right;display:inline-block;height:100%;">Add</button><br/>\
             </div>',
            {localDateString: WTPLAN.getLocalDayString(currentDay),
             localDayString:  WTPLAN.dayStringFromDate(currentDay),
             componentId: this.componentId});
        return WTPLAN.template(
            '<div style="border-top: 2px solid black;">\
               <%dayHeader%>\
               <div><%itemDivs%></div>\
             </div>',
            {dayHeader: dayHeader,
             itemDivs: itemDivs});
    };

    WTPLAN.DayListDay.prototype.componentDidMount = function(component) {
        var outerThis = this;
        var currentDay = this.state.currentDay;
        var nextDay = new Date(currentDay.getTime());
        nextDay.setDate(currentDay.getDate() + 1);
        this.tmpItemItemDivIdList.forEach(function(tuple) {
            new WTPLAN.DayListItem({
                calendarItem: tuple.item,
                'currentDay': currentDay,
                'nextDay': nextDay,
                'openEditDialog': outerThis.state.openEditDialog,
                'removeItemAction': outerThis.state.removeItemAction
            }).renderAt(component.find('[data-itemId="' + tuple.itemId +'"]'));
        });
        $('#addButton' + outerThis.componentId).click(function() {
            outerThis.state.openAddDialog(WTPLAN.dateToRfc3339String(
                outerThis.state.currentDay));
        });
    };

})()
