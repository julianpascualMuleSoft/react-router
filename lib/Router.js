'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _react = require('react');

var _PropTypes = require('./PropTypes');

var _QueryUtils = require('./QueryUtils');

var _RouteUtils = require('./RouteUtils');

var _matchRoutes = require('./matchRoutes');

var _matchRoutes2 = _interopRequireDefault(_matchRoutes);

var _runTransitionHooks = require('./runTransitionHooks');

var _runTransitionHooks2 = _interopRequireDefault(_runTransitionHooks);

var _getComponents = require('./getComponents');

var _getComponents2 = _interopRequireDefault(_getComponents);

var _getRouteParams = require('./getRouteParams');

var _getRouteParams2 = _interopRequireDefault(_getRouteParams);

var _NavigationMixin = require('./NavigationMixin');

var _NavigationMixin2 = _interopRequireDefault(_NavigationMixin);

var _ScrollManagementMixin = require('./ScrollManagementMixin');

var _ScrollManagementMixin2 = _interopRequireDefault(_ScrollManagementMixin);

var _ActiveMixin = require('./ActiveMixin');

var _ActiveMixin2 = _interopRequireDefault(_ActiveMixin);

var arrayOf = _react.PropTypes.arrayOf;
var func = _react.PropTypes.func;
var object = _react.PropTypes.object;

var Router = _react.createClass({

  mixins: [_NavigationMixin2['default'], _ScrollManagementMixin2['default'], _ActiveMixin2['default']],

  statics: {

    run: function run(routes, location, callback) {
      var prevState = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      _matchRoutes2['default'](routes, location, function (error, nextState) {
        if (error || nextState == null) {
          callback(error, null);
        } else {
          nextState.location = location;
          _runTransitionHooks2['default'](prevState, nextState, function (error, redirectInfo) {
            if (error || redirectInfo) {
              callback(error, null, redirectInfo);
            } else {
              _getComponents2['default'](nextState, function (error, components) {
                if (error) {
                  callback(error);
                } else {
                  nextState.components = components;
                  callback(null, nextState);
                }
              });
            }
          });
        }
      });
    }

  },

  childContextTypes: {
    router: object
  },

  getChildContext: function getChildContext() {
    return {
      router: this
    };
  },

  propTypes: {
    createElement: func,
    parseQueryString: func,
    onError: func,
    onUpdate: func,
    routes: _PropTypes.routes,
    // Routes may also be given as children (JSX)
    children: _PropTypes.routes,

    // Client-side
    history: _PropTypes.history,

    // Server-side
    location: _PropTypes.location
  },

  getDefaultProps: function getDefaultProps() {
    return {
      createElement: _react.createElement,
      parseQueryString: _QueryUtils.parseQueryString
    };
  },

  getInitialState: function getInitialState() {
    return {
      isTransitioning: false,
      location: null,
      routes: null,
      params: null,
      components: null
    };
  },

  updateLocation: function updateLocation(location) {
    var _this = this;

    if (!location.query) location.query = this.props.parseQueryString(location.search.substring(1));

    this.setState({
      isTransitioning: true
    });

    Router.run(this.routes, location, function (error, state, redirectInfo) {
      if (error) {
        _this.handleError(error);
      } else if (redirectInfo) {
        var pathname = redirectInfo.pathname;
        var query = redirectInfo.query;
        var state = redirectInfo.state;

        _this.replaceWith(pathname, query, state);
      } else if (state == null) {
        _warning2['default'](false, 'Location "%s" did not match any routes', location.pathname + location.search);
      } else {
        _this.setState(state, _this.props.onUpdate);
      }

      _this.setState({
        isTransitioning: false
      });
    }, this.state);
  },

  updateHistory: function updateHistory(history) {
    if (this._unlisten) {
      this._unlisten();
      this._unlisten = null;
    }

    if (history) this._unlisten = history.listen(this.updateLocation);
  },

  handleError: function handleError(error) {
    if (this.props.onError) {
      this.props.onError.call(this, error);
    } else {
      // Throw errors by default so we don't silently swallow them!
      throw error; // This error probably originated in getChildRoutes or getComponents.
    }
  },

  componentWillMount: function componentWillMount() {
    var _props = this.props;
    var routes = _props.routes;
    var children = _props.children;
    var history = _props.history;
    var location = _props.location;

    _invariant2['default'](routes || children, '<Router>s need routes. Try using <Router routes> or ' + 'passing your routes as nested <Route> children');

    this.routes = _RouteUtils.createRoutes(routes || children);

    if (history) {
      this.updateHistory(history);
    } else if (location) {
      this.updateLocation(location);
    }
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    // TODO
  },

  componentWillUnmount: function componentWillUnmount() {
    if (this._unlisten) this._unlisten();
  },

  createElement: function createElement(component, props) {
    return component ? this.props.createElement(component, props) : null;
  },

  render: function render() {
    var _this2 = this;

    var _state = this.state;
    var routes = _state.routes;
    var params = _state.params;
    var components = _state.components;

    var element = null;

    if (components) {
      element = components.reduceRight(function (element, components, index) {
        if (components == null) return element; // Don't create new children; use the grandchildren.

        var route = routes[index];
        var routeParams = _getRouteParams2['default'](route, params);
        var props = _extends({}, _this2.state, { route: route, routeParams: routeParams });

        if (_react.isValidElement(element)) {
          props.children = element;
        } else if (element) {
          // In render, do var { header, sidebar } = this.props;
          _extends(props, element);
        }

        if (typeof components === 'object') {
          var elements = {};

          for (var key in components) if (components.hasOwnProperty(key)) elements[key] = _this2.createElement(components[key], props);

          return elements;
        }

        return _this2.createElement(components, props);
      }, element);
    }

    _invariant2['default'](element === null || element === false || _react.isValidElement(element), 'The root route must render a single element');

    return element;
  }

});

exports['default'] = Router;
module.exports = exports['default'];