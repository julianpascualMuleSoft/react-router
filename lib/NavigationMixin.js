'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _QueryUtils = require('./QueryUtils');

var func = _react2['default'].PropTypes.func;

var NavigationMixin = {

  propTypes: {
    stringifyQuery: func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      stringifyQuery: _QueryUtils.stringifyQuery
    };
  },

  createPath: function createPath(pathname, query) {
    var stringifyQuery = this.props.stringifyQuery;

    var queryString;
    if (query == null || (queryString = stringifyQuery(query)) === '') return pathname;

    return pathname + (pathname.indexOf('?') === -1 ? '?' : '&') + queryString;
  },

  /**
   * Returns a string that may safely be used to link to the given
   * pathname and query.
   */
  createHref: function createHref(pathname, query) {
    var path = this.createPath(pathname, query);
    var history = this.props.history;

    if (history && history.createHref) return history.createHref(path);

    return path;
  },

  /**
   * Pushes a new Location onto the history stack.
   */
  transitionTo: function transitionTo(pathname, query) {
    var state = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var history = this.props.history;

    _invariant2['default'](history, 'Router#transitionTo needs history');

    history.pushState(state, this.createPath(pathname, query));
  },

  /**
   * Replaces the current Location on the history stack.
   */
  replaceWith: function replaceWith(pathname, query) {
    var state = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
    var history = this.props.history;

    _invariant2['default'](history, 'Router#replaceWith needs history');

    history.replaceState(state, this.createPath(pathname, query));
  },

  /**
   * Navigates forward/backward n entries in the history stack.
   */
  go: function go(n) {
    var history = this.props.history;

    _invariant2['default'](history, 'Router#go needs history');

    history.go(n);
  },

  /**
   * Navigates back one entry in the history stack. This is identical to
   * the user clicking the browser's back button.
   */
  goBack: function goBack() {
    this.go(-1);
  },

  /**
   * Navigates forward one entry in the history stack. This is identical to
   * the user clicking the browser's forward button.
   */
  goForward: function goForward() {
    this.go(1);
  }

};

exports['default'] = NavigationMixin;
module.exports = exports['default'];