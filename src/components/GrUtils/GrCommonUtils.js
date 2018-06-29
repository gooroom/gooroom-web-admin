
export const getMergedListParam = (source, param) => {
    let tempListParam = source;
    Object.assign(tempListParam, param);
    return tempListParam;
};

/**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
export const arrayContainsArray = (superset, subset) => {
    if (0 === subset.length) {
        return 0;
    }

    if(subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
    })) {
        return 100;
    } else {
        if(subset.some(function (value) {
            return (superset.indexOf(value) >= 0);
        })) {
            return 50;
        } else {
            return 0;
        }
    }
};

