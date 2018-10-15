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
    const targetType = action.targetType;
    const targetNames = (targetType && targetType != '') ? ['viewItems', action.compId, targetType] : ['viewItems', action.compId];

    if(data && data.length > 0) {
        if(state.hasIn(targetNames)) {

            const beforeItemId = state.getIn(List(targetNames).push('selectedOptionItemId'));
            const pos = (beforeItemId) ? data.map((e) => (e.objId)).indexOf(beforeItemId) : -1;
            if(pos < 0) {
                // no exist or selected id was deleted
                return state
                    .setIn(List(targetNames).push('listAllData'), List(data.map((e) => {return Map(e)})))
                    .setIn(List(targetNames).push('selectedOptionItemId'), '-');
            } else {
                // before exist and selected id is exist
                return state
                    .setIn(List(targetNames).push('listAllData'), List(data.map((e) => {return Map(e)})))
                    .setIn(List(targetNames).push('selectedOptionItemId'), beforeItemId);
            }
        }

        return state.setIn(targetNames, Map({
            'listAllData': List(data.map((e) => {return Map(e)}))
        }));
        
    } else {
        return state
        .deleteIn(List(targetNames).push('listAllData'))
        .deleteIn(List(targetNames).push('selectedOptionItemId'));
    }
}

export const handleListPagedAction = (state, action) => {
    const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.response.data;
    let newState = null;
    if(state.getIn(['viewItems', action.compId])) {
        newState = state
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
        newState = state.setIn(['viewItems', action.compId], Map({
            'listData': List(data.map((e) => {return Map(e)})),
            'listParam': action.listParam.merge({
                rowsFiltered: parseInt(((recordsFiltered) ? recordsFiltered: 0), 10),
                rowsTotal: parseInt(((recordsTotal) ? recordsTotal: 0), 10),
                page: parseInt(((draw) ? draw: 0), 10),
                rowsPerPage: parseInt(((rowLength) ? rowLength: 0), 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            })
        }));
    }

    if(action.isResetSelect) {
        return newState.deleteIn(['viewItems', action.compId, 'selectedIds']);
    } else {
        return newState;
    }
}

export const handleGetObjectAction = (state, compId, data, extend, target) => {
    if(data && data.length > 0) {
        const isDefault = (extend && extend.length > 0 && extend[0] === 'DEFAULT') ? true: false;
        const isDeptRole = (extend && extend.length > 0 && extend[0] === 'DEPT') ? true: false;

        if(target && target != '') {
            return state
            .setIn(['viewItems', compId, target, 'selectedViewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, target, 'selectedOptionItemId'], (isDefault) ? '' : data[0].objId)
            .setIn(['viewItems', compId, target, 'isDefault'], isDefault)
            .setIn(['viewItems', compId, target, 'isDeptRole'], isDeptRole)
            .setIn(['viewItems', compId, target, 'informOpen'], true);
        } else {
            return state
            .setIn(['viewItems', compId, 'selectedViewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, 'selectedOptionItemId'], (isDefault) ? '' : data[0].objId)
            .setIn(['viewItems', compId, 'isDefault'], isDefault)
            .setIn(['viewItems', compId, 'isDeptRole'], isDeptRole)
            .setIn(['viewItems', compId, 'informOpen'], true);
        }
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
    return state.delete('editingItem').merge({
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
            // if(e.get('selectedViewItem')) {
            //     if(e.getIn(['selectedViewItem', 'objId']) == action.objId) {
                    // replace
                    newState = newState
                        .setIn(['viewItems', i, 'selectedViewItem'], fromJS(action.response.data.data[0]))
                        .setIn(['viewItems', i, 'informOpen'], false);
            //     }
            // }
        });
    }
    return state.delete('editingItem').merge(newState).merge({
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

export const handleChangeCompValue = (state, action) => {
    const targetType = action.targetType;
    const targetNames = (targetType && targetType != '') ? ['viewItems', action.compId, targetType] : ['viewItems', action.compId];
    return state.setIn(List(targetNames).push(action.name), action.value);
}

export const handleDeleteCompItem = (state, action) => {
    const targetType = action.targetType;
    const targetNames = (targetType && targetType != '') ? ['viewItems', action.compId, targetType] : ['viewItems', action.compId];
    return state.deleteIn(List(targetNames).push(action.name));
}

