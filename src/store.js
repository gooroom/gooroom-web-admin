import { createStore, applyMiddleware } from 'redux';
import modules from './modules';

import loggerMiddleware from './lib/loggerMiddleware';

import promiseMiddelware from 'redux-promise-middleware';

const customizedPromiseMiddleware = promiseMiddleware({
    promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
});

const store = createStore(modules, applyMiddleware(loggerMiddleware, customizedPromiseMiddleware));

export default store;
