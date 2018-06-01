import { createStore, applyMiddleware } from 'redux';
import modules from './modules';
import promiseMiddleware from 'redux-promise-middleware';


import loggerMiddleware from './lib/loggerMiddleware';

import ReduxThunk from 'redux-thunk';

const customizedPromiseMiddleware = promiseMiddleware({
    promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
});

const store = createStore(modules, applyMiddleware(loggerMiddleware, ReduxThunk, customizedPromiseMiddleware));

export default store;
