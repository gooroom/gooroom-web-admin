import { createStore, applyMiddleware } from 'redux';
import modules from './modules';

import ReduxThunk from 'redux-thunk';
import loggerMiddleware from './lib/loggerMiddleware';

// const customizedPromiseMiddleware = promiseMiddleware({
//     promiseTypeSuffixes: ['LOADING', 'SUCCESS', 'FAILURE']
// });

const store = createStore(modules, applyMiddleware(loggerMiddleware, ReduxThunk));

export default store;
