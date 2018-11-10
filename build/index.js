"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var dispatchAction = function dispatchAction(dispatch) {
  return function (type) {
    return function (payload) {
      return dispatch(Object.assign({ type: type }, payload && { payload: payload })) && Promise.resolve(payload);
    };
  };
};

var funk = exports.funk = function funk(extraArguments) {
  return function (_ref) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;

    var funkyDispatch = function funkyDispatch() {
      return dispatch.apply(undefined, arguments);
    };
    funkyDispatch.action = dispatchAction(dispatch);
    return function (next) {
      return function (action) {
        return typeof action === "function" ? action(funkyDispatch, getState, extraArguments) : next(action);
      };
    };
  };
};

var toFunk = exports.toFunk = function toFunk(fn) {
  return function () {
    for (var _len = arguments.length, payload = Array(_len), _key = 0; _key < _len; _key++) {
      payload[_key] = arguments[_key];
    }

    return function () {
      return Promise.resolve.apply(Promise, payload).then(fn);
    };
  };
};

var pipe = exports.pipe = function pipe(funks) {
  return function () {
    for (var _len2 = arguments.length, payload = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      payload[_key2] = arguments[_key2];
    }

    return function (dispatch, getState, extraArguments) {
      return funks.reduce(function (f, g) {
        return f.then(function (x) {
          return g(x)(dispatch, getState, extraArguments);
        });
      }, Promise.resolve.apply(Promise, payload));
    };
  };
};

var compose = exports.compose = function compose(funks) {
  return pipe(funks.reverse());
};

var all = exports.all = function all(funks) {
  return function () {
    for (var _len3 = arguments.length, payload = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      payload[_key3] = arguments[_key3];
    }

    return function (dispatch, getState, extraArguments) {
      return Promise.resolve(funks.map(function (f) {
        return f.apply(undefined, payload)(dispatch, getState, extraArguments);
      })).then(Promise.all.bind(Promise));
    };
  };
};

var race = exports.race = function race(funks) {
  return function () {
    for (var _len4 = arguments.length, payload = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      payload[_key4] = arguments[_key4];
    }

    return function (dispatch, getState, extraArguments) {
      return Promise.resolve(funks.map(function (f) {
        return f.apply(undefined, payload)(dispatch, getState, extraArguments);
      })).then(Promise.race.bind(Promise));
    };
  };
};