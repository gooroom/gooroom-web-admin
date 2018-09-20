
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

// export const getListParam = (param) => {
//     let viewItem = null;
//     if(param.props.viewItems) {
//       viewItem = param.props.viewItems.find((element) => {
//         return element._COMPID_ == param.compId
//       });
//     }
//     return (viewItem) ? viewItem.listParam : param.props.defaultListParam;
// };

// export const getListData = (param) => {
//     let viewItem = null;
//     if(param.props.viewItems) {
//       viewItem = param.props.viewItems.find((element) => {
//         return element._COMPID_ == param.compId
//       });
//     }
//     return (viewItem) ? viewItem.listData : [];
// };

// export const getViewItem = (param) => {
//     let viewItem = null;
//     if(param.props.viewItems) {
//       viewItem = param.props.viewItems.find((element) => {
//         return element._COMPID_ == param.compId
//       });
//     }
//     return viewItem;
// };


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

