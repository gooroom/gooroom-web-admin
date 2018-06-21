
export const getMergedListParam = (source, param) => {
    let tempListParam = source;
    Object.assign(tempListParam, param);
    return tempListParam;
};
