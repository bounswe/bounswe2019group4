import rootReducer from './reducers/rootReducer';


import { applyMiddleware, compose, createStore } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";

import { devTools}  from "./_core/devTools";
import { loadState } from "./_core/localStorage";
import requestMiddleware from "./_core/requestMiddleware";

const composeEnhancers = devTools || compose;

const middleWare = applyMiddleware(
    thunk,
    promise,
    requestMiddleware
);

const persistedState = loadState();

const store = createStore(rootReducer, persistedState, composeEnhancers(middleWare));

export default store;
