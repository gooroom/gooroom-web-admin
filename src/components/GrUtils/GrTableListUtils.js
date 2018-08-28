
export const getTableListObject = (propObj, compId) => {

    let viewItem = null;
    if(propObj.viewItems) {
      viewItem = propObj.viewItems.find((element) => {
        return element._COMPID_ == compId;
      });
    }

    return {
        listData: (viewItem) ? viewItem.listData : [],
        listParam: (viewItem) ? viewItem.listParam : propObj.defaultListParam,
        orderDir: (viewItem && viewItem.listParam) ? viewItem.listParam.orderDir : propObj.defaultListParam.orderDir,
        orderColumn: (viewItem && viewItem.listParam) ? viewItem.listParam.orderColumn : propObj.defaultListParam.orderColumn,
    }
}

export const getTableSelectedObject = (propObj, compId) => {

  if(propObj && propObj.viewItems) {
    const viewItem = propObj.viewItems.find(function(element) {
      return element._COMPID_ == compId;
    });
  
    if(viewItem) {
      return viewItem.selectedItem;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
