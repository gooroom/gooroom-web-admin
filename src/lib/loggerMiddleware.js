const loggerMiddleware = store => next => action => {
    
    // console.log('present : ', store.getState());
    // console.log('action : ', action);

    const result = next(action);

    // console.log('next : ', store.getState());
    // console.log('\n');

    return result;

}

export default loggerMiddleware;
