'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _RouteUtils = require('./RouteUtils');

var _PatternUtils = require('./PatternUtils');

var _PropTypes = require('./PropTypes');

var string = _react.PropTypes.string;
var object = _react.PropTypes.object;

/**
 * A <Redirect> is used to declare another URL path a client should be sent
 * to when they request a given URL.
 *
 * Redirects are placed alongside routes in the route configuration and are
 * traversed in the same manner.
 */
var Redirect = _react.createClass({

  statics: {

    createRouteFromReactElement: function createRouteFromReactElement(element) {
      var route = _RouteUtils.createRouteFromReactElement(element);

      if (route.from) route.path = route.from;

      route.onEnter = function (nextState, redirectTo) {
        var location = nextState.location;
        var params = nextState.params;

        // TODO: Handle relative pathnames.
        var pathname = route.to ? _PatternUtils.formatPattern(route.to, params) : location.pathname;

        redirectTo(pathname, route.query || location.query, route.state || location.state);
      };

      return route;
    }

  },

  propTypes: {
    path: string,
    from: string, // Alias for path
    to: string.isRequired,
    query: object,
    state: object,
    onEnter: _PropTypes.falsy,
    children: _PropTypes.falsy
  },

  render: function render() {
    _invariant2['default'](false, '<Redirect> elements are for router configuration only and should not be rendered');
  }

});

exports['default'] = Redirect;
module.exports = exports['default'];