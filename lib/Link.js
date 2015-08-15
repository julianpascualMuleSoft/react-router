'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var object = _react.PropTypes.object;
var string = _react.PropTypes.string;
var func = _react.PropTypes.func;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * <Link> components are used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name (or the
 * value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route name="showPost" path="/posts/:postID" handler={Post}/>
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along query string parameters
 * using the `query` prop.
 *
 *   <Link to="/posts/123" query={{ show: true }}/>
 */
var Link = _react.createClass({

  contextTypes: {
    router: object
  },

  propTypes: {
    activeStyle: object,
    activeClassName: string,
    to: string.isRequired,
    query: object,
    state: object,
    onClick: func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: '',
      activeClassName: 'active',
      style: {}
    };
  },

  handleClick: function handleClick(event) {
    var allowTransition = true;
    var clickResult;

    if (this.props.onClick) clickResult = this.props.onClick(event);

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) return;

    if (clickResult === false || event.defaultPrevented === true) allowTransition = false;

    event.preventDefault();

    if (allowTransition) this.context.router.transitionTo(this.props.to, this.props.query, this.props.state);
  },

  render: function render() {
    var router = this.context.router;

    var props = _extends({}, this.props, {
      onClick: this.handleClick
    });

    // Ignore if rendered outside of the context of a
    // router, simplifies unit testing.
    if (router) {
      var _props = this.props;
      var to = _props.to;
      var query = _props.query;

      props.href = router.createHref(to, query);

      if (router.isActive(to, query)) {
        if (props.activeClassName) props.className += props.className !== '' ? ' ' + props.activeClassName : props.activeClassName;

        if (props.activeStyle) props.style = _extends({}, props.style, props.activeStyle);
      }
    }

    return _react.createElement('a', props);
  }

});

exports['default'] = Link;
module.exports = exports['default'];