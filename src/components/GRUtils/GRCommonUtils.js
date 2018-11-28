
export const getMergedObject = (source, param) => {
    let tempSource = source;
    if(source) {
        Object.assign(tempSource, param);
    } else {
        Object.assign({}, param);
    }
    return tempSource;
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

export const getMergedArray = (masterArray, newArray, isImport) => {

    if(isImport) {
        newArray.forEach((item) => {
            if(!masterArray.includes(item)) {
                masterArray.push(item);
            }
        });
    } else {
        let newMasterArray = [];
        masterArray.forEach((item) => {
            if(!newArray.includes(item)) {
                newMasterArray.push(item);
            }
        });
        masterArray = newMasterArray;
    }

    return masterArray;
};


export const getJobStatusToString = (status) => {

    let clientStatus = '';

    if(status && status.startsWith('R')) {
        clientStatus = '작업전';  
    } else if(status && status.startsWith('C')) {
        clientStatus = '작업완료';  
    } else if(status && status.startsWith('D')) {
        clientStatus = '작업중';  
    } else if(status && status.startsWith('E')) {
        clientStatus = '작업오류';  
    } else if(status && status.startsWith('Q')) {
        clientStatus = '작업취소';  
    }

    if(status && status.endsWith('K')) {
        clientStatus = '폐기단말(' + clientStatus + ')';
    }

    return clientStatus;
};
