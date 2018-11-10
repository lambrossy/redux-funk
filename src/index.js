const dispatchAction = dispatch => type => payload =>
  dispatch(Object.assign({ type }, payload && { payload })) &&
  Promise.resolve(payload);

export const funk = extraArguments => ({ dispatch, getState }) => {
  const funkyDispatch = (...payload) => dispatch(...payload);
  funkyDispatch.action = dispatchAction(dispatch);
  return next => action =>
    typeof action === "function"
      ? action(funkyDispatch, getState, extraArguments)
      : next(action);
};

export const toFunk = fn => (...payload) => () =>
  Promise.resolve(...payload).then(fn);

export const pipe = funks => (...payload) => (
  dispatch,
  getState,
  extraArguments
) =>
  funks.reduce(
    (f, g) => f.then(x => g(x)(dispatch, getState, extraArguments)),
    Promise.resolve(...payload)
  );

export const compose = funks => pipe(funks.reverse());

export const all = funks => (...payload) => (
  dispatch,
  getState,
  extraArguments
) =>
  Promise.resolve(
    funks.map(f => f(...payload)(dispatch, getState, extraArguments))
  ).then(Promise.all.bind(Promise));

export const race = funks => (...payload) => (
  dispatch,
  getState,
  extraArguments
) =>
  Promise.resolve(
    funks.map(f => f(...payload)(dispatch, getState, extraArguments))
  ).then(Promise.race.bind(Promise));
