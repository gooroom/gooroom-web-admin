import { List } from "@material-ui/core";

export const getTableListObject = (propObj, compId) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });
        return viewItem.toJS();
    } else {
        return {listParam: propObj.get('defaultListParam').toJS(), listData: []};
    }

}

export const getTableSelectedObject = (propObj, compId, id) => {

    if(propObj.get('viewItems')) {
        let viewItem = propObj.get('viewItems').find((element) => {
            return element.get('_COMPID_') == compId;
        });

        if(viewItem && viewItem.get('listData')) {
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> viewItem.get : ", viewItem.get('listData'));
            const selectedItem = viewItem.get('listData').find((element) => {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> element : ", element);
                console.log("-------------------------------------------");
                return element.grpId == id;
            });
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> selectedItem : ", selectedItem);
            console.log("-------------------------------------------");
            return (selectedItem) ? selectedItem : null;
        }
    }
    console.log("-------------------------------------------");
    return null;
    
}


// export const getTableSelectedObject = (propObj, compId) => {

//     if(propObj.get('viewItems')) {
//         let viewItem = propObj.get('viewItems').find((element) => {
//             return element.get('_COMPID_') == compId;
//         });
//         console.log(">>> viewItem : ", viewItem);
//         console.log(">>> viewItem >>> : ", viewItem.get('selectedItem'));
//         console.log((viewItem.get('selectedItem')) ? 'T' : 'F');
//         return (viewItem.get('selectedItem')) ? viewItem.get('selectedItem') : null;
//     }
//     return null;
    
// }
