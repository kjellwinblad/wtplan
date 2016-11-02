// Copyright 2017 Kjell Winblad (kjellwinblad@gmail.com, http://winsh.me)
// License: MIT License, see the LICENSE file

var WTPLAN = WTPLAN || {};

(function() {
  var componentId = 0;

  WTPLAN.Component = function(props) {
    if (props === undefined) {
      this.state = {};
    } else {
      this.state = props;
    }
    this.componentId = componentId;
    componentId = componentId + 1;
  }

  WTPLAN.Component.prototype.renderAt = function(element) {
    var newElement = $(this.render());
    newElement.attr("data-wtplanid", "" + this.componentId);
    element.replaceWith(newElement);
    var outerThis = this;
    outerThis.componentDidMount(newElement);
  };

  WTPLAN.Component.prototype.setState = function(newState) {
    this.state = newState;
    var element = this.getRenderedComponent();
    var renderedHtml = this.render();
    var newElement = $(renderedHtml);
    newElement.attr("data-wtplanid", "" + this.componentId);
    element.replaceWith(newElement);
    var outerThis = this;
    outerThis.componentDidMount(newElement);
  };

  WTPLAN.Component.prototype.render = function() {
    console.log("WARNING: render has not been implemented for component");
  }

  WTPLAN.Component.prototype.componentDidMount = function(element) {

  }

  WTPLAN.Component.prototype.getRenderedComponent = function() {
    return $('[data-wtplanid="' + this.componentId + '"]');
  }

  // Object.create() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

  if (typeof Object.create != 'function') {
    Object.create = (function(undefined) {
      var Temp = function() {};
      return function(prototype, propertiesObject) {
        if (prototype !== Object(prototype) && prototype !== null) {
          throw TypeError('Argument must be an object, or null');
        }
        Temp.prototype = prototype || {};
        var result = new Temp();
        Temp.prototype = null;
        if (propertiesObject !== undefined) {
          Object.defineProperties(result, propertiesObject);
        }

        // to imitate the case of Object.create(null)
        if (prototype === null) {
          result.__proto__ = null;
        }
        return result;
      };
    })();
  }

})();
