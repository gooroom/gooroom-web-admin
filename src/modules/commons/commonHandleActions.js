import { Map, List, fromJS } from 'immutable';

export const getCommonInitialState = (initOrderColumn, initOrder = '', extValue = {}, extParam = {}) => {

    const initialState = Map({
        pending: false,
        error: false,
        resultMsg: '',
    
        defaultListParam: Map({
            keyword: '',
            orderDir: (initOrder) ? initOrder : 'desc',
            orderColumn: initOrderColumn,
            page: 0,
            rowsPerPage: 10,
            rowsPerPageOptions: List([5, 10, 25]),
            rowsTotal: 0,
            rowsFiltered: 0
        }),
    
        dialogOpen: false,
        dialogType: ''
    });

    return initialState.merge(fromJS(extValue)).set('defaultListParam', initialState.get('defaultListParam').merge(fromJS(extParam)));
}

export const handleListAction = (state, action) => {
    const { data } = action.response.data;
    if(data && data.length > 0) {
        if(state.hasIn(['viewItems', action.compId])) {
            const beforeItemId = state.getIn(['viewItems', action.compId, 'selectedOptionItemId']);
            const pos = (beforeItemId) ? data.map((e) => (e.objId)).indexOf(beforeItemId) : -1;
            if(pos < 0) {
                // no exist or selected id was deleted
                return state
                    .setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                    .setIn(['viewItems', action.compId, 'selectedOptionItemId'], '-');
            } else {
                // before exist and selected id is exist
                return state
                    .setIn(['viewItems', action.compId, 'listAllData'], List(data.map((e) => {return Map(e)})))
                    .setIn(['viewItems', action.compId, 'selectedOptionItemId'], beforeItemId);
            }
        }

        return state.setIn(['viewItems', action.compId], Map({
            'listAllData': List(data.map((e) => {return Map(e)})),
            'selectedOptionItemId': data[0].objId
        }));
        
    } else {
        return state
        .deleteIn(['viewItems', action.compId, 'listAllData'])
        .deleteIn(['viewItems', action.compId, 'selectedOptionItemId']);
    }
}

export const handleListPagedAction = (state, action) => {
    const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.response.data;
    if(state.getIn(['viewItems', action.compId])) {

        return state
            .setIn(['viewItems', action.compId, 'listData'], List(data.map((e) => {return Map(e)})))
            .setIn(['viewItems', action.compId, 'listParam'], action.listParam.merge({
                rowsFiltered: parseInt(recordsFiltered, 10),
                rowsTotal: parseInt(recordsTotal, 10),
                page: parseInt(draw, 10),
                rowsPerPage: parseInt(rowLength, 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            }));
    } else {
        return state.setIn(['viewItems', action.compId], Map({
            'listData': List(data.map((e) => {return Map(e)})),
            'listParam': action.listParam.merge({
                rowsFiltered: parseInt(recordsFiltered, 10),
                rowsTotal: parseInt(recordsTotal, 10),
                page: parseInt(draw, 10),
                rowsPerPage: parseInt(rowLength, 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            })
        }));
    }
}

export const handleGetObjectAction = (state, compId, data) => {
    if(data && data.length > 0) {
        return state
            .setIn(['viewItems', compId, 'selectedViewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, 'informOpen'], true);
    } else  {
        return state.deleteIn(['viewItems', compId]);
    }
}

export const handleShowDialogAction = (state, action) => {
    return state.merge({
        editingItem: action.selectedViewItem,
        dialogOpen: true,
        dialogType: action.dialogType
    });
}

export const handleCloseDialogAction = (state, action) => {
    return state.merge({
        dialogOpen: false,
        dialogType: ''
    });
}

export const handleShowInformAction = (state, action) => {
    return state
        .setIn(['viewItems', action.compId, 'selectedViewItem'], action.selectedViewItem)
        .setIn(['viewItems', action.compId, 'informOpen'], true);
}

export const handleCloseInformAction = (state, action) => {
    return state
        .setIn(['viewItems', action.compId, 'informOpen'], false)
        .deleteIn(['viewItems', action.compId, 'selectedViewItem']);
}

export const handleEditSuccessAction = (state, action) => {
    let newState = state;
    if(newState.get('viewItems')) {
        newState.get('viewItems').forEach((e, i) => {
            if(e.get('selectedViewItem')) {
                if(e.getIn(['selectedViewItem', 'objId']) == action.objId) {
                    // replace
                    newState = newState.setIn(['viewItems', i, 'selectedViewItem'], fromJS(action.response.data.data[0]));
                }
            }
        });
    }
    return state.merge(newState).merge({
        pending: false,
        error: false,
        dialogOpen: false,
        dialogType: ''
    });
}

export const handleDeleteSuccessAction = (state, action) => {
    let newState = state;
    if(newState.get('viewItems')) {
        newState.get('viewItems').forEach((e, i) => {
            if(e.get('selectedViewItem')) {
                if(e.getIn(['selectedViewItem', 'objId']) == action.objId) {
                    // replace
                    newState = newState.deleteIn(['viewItems', i, 'selectedViewItem']);
                }
            }
        });
    }
    return state.merge(newState).merge({
        pending: false,
        error: false,
        dialogOpen: false,
        dialogType: ''
    });
}
