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

    // return {
    //     // listData: List([]),
    //     // listParam: propObj.get('defaultListParam'),
    //     // orderDir: (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : propObj.defaultListParam.orderDir,
    //     // orderColumn: (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : propObj.defaultListParam.orderColumn,
    // }
}

export const getTableSelectedObject = (propObj, compId) => {

  // if(propObj && propObj.viewItems) {
  //   const viewItem = propObj.viewItems.find(function(element) {
  //     return element._COMPID_ == compId;
  //   });
  
  //   if(viewItem) {
  //     return viewItem.selectedItem;
  //   } else {
  //     return null;
  //   }
  // } else {
     return null;
  // }
}
