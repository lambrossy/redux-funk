# redux-funk

Just like redux-thunk, only funky!

## Motivation

Compose your thunks into bigger thunks. Improve reuse and reduce

## Installation

```shell
$ npm i redux-funk
```

## Usage

```javascript
const store = createStore(reducer, defaultState, applyMiddleware(funk()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

## Example
