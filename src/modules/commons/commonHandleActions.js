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

export const handleListAction = (state, action, idName) => {
    const { data } = action.response.data;
    const targetType = action.targetType;
    const targetNames = (targetType && targetType != '') ? ['viewItems', action.compId, targetType] : ['viewItems', action.compId];

    if(data && data.length > 0) {
        if(state.hasIn(targetNames)) {

            const beforeItemId = state.getIn(List(targetNames).push('selectedOptionItemId'));
            const pos = (beforeItemId) ? data.map((e) => (e[idName])).indexOf(beforeItemId) : -1;
            if(pos < 0) {
                // no exist or selected id was deleted
                return state
                    .setIn(List(targetNames).push('listAllData'), fromJS(data))
                    .setIn(List(targetNames).push('selectedOptionItemId'), '-');
            } else {
                // before exist and selected id is exist
                return state
                    .setIn(List(targetNames).push('listAllData'), fromJS(data))
                    .setIn(List(targetNames).push('selectedOptionItemId'), beforeItemId);
            }
        }

        return state
            .setIn(targetNames, Map({'listAllData': List(data.map((e) => {return Map(e)}))
        }));
        
    } else {
        return state
        .deleteIn(List(targetNames).push('listAllData'))
        .deleteIn(List(targetNames).push('selectedOptionItemId'));
    }
}

export const handleListActionForDesktopConf = (state, action) => {
    const { data } = action.response.data;
    const targetType = action.targetType;
    const targetNames = (targetType && targetType != '') ? ['viewItems', action.compId, targetType] : ['viewItems', action.compId];

    if(data && data.length > 0) {
        if(state.hasIn(targetNames)) {

            const beforeItemId = state.getIn(List(targetNames).push('selectedOptionItemId'));
            const pos = (beforeItemId) ? data.map((e) => (e.confId)).indexOf(beforeItemId) : -1;
            if(pos < 0) {
                // no exist or selected id was deleted
                return state
                    .setIn(List(targetNames).push('listAllData'), fromJS(data))
                    .setIn(List(targetNames).push('selectedOptionItemId'), '-');
            } else {
                // before exist and selected id is exist
                return state
                    .setIn(List(targetNames).push('listAllData'), fromJS(data))
                    .setIn(List(targetNames).push('selectedOptionItemId'), beforeItemId);
            }
        }

        return state
            .setIn(targetNames, Map({'listAllData': List(data.map((e) => {return Map(e)}))
        }));
        
    } else {
        return state
        .deleteIn(List(targetNames).push('listAllData'))
        .deleteIn(List(targetNames).push('selectedOptionItemId'));
    }
}

export const handleListPagedAction = (state, action) => {
    const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir, extend } = action.response.data;
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
            }))
            .deleteIn(['viewItems', action.compId, 'checkedIds']);
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

    if(extend && extend.length > 0 && extend[0]) {
        // extend parameter value, must have 'name' and 'value'
        extend.map(e => {
            newState = newState.setIn(['viewItems', action.compId, 'listParam', e.name], e.value);
        });
    }

    if(action.extOption) {
        if(action.extOption.isResetSelect) {
            newState = newState.deleteIn(['viewItems', action.compId, 'checkedIds']);
        }
        if(action.extOption.isCloseInform) {
            newState = newState.deleteIn(['viewItems', action.compId, 'informOpen'])
                        .deleteIn(['viewItems', action.compId, 'viewItem']);
        }
    }

    return newState;
}


export const handleCustomListPagedAction = (state, action, customTag) => {
    const { data, recordsFiltered, recordsTotal, draw, rowLength, orderColumn, orderDir } = action.response.data;
    let newState = null;
    const listDataName = 'listData_' + customTag;
    const listParamName = 'listParam_' + customTag;
    const checkedIdsName = 'checkedIds_' + customTag;
    if(state.getIn(['viewItems', action.compId])) {

        if(state.getIn(['viewItems', action.compId, listDataName])) {
            newState = state
            .setIn(['viewItems', action.compId, listDataName], List(data.map((e) => {return Map(e)})))
            .setIn(['viewItems', action.compId, listParamName], action.listParam.merge({
                rowsFiltered: parseInt(recordsFiltered, 10),
                rowsTotal: parseInt(recordsTotal, 10),
                page: parseInt(draw, 10),
                rowsPerPage: parseInt(rowLength, 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            }))
            .deleteIn(['viewItems', action.compId, checkedIdsName]);
        } else {
            const tempObj = state
            .getIn(['viewItems', action.compId]).merge(
                Map({
                    [listDataName]: List(data.map((e) => {return Map(e)})),
                    [listParamName]: action.listParam.merge({
                        rowsFiltered: parseInt(((recordsFiltered) ? recordsFiltered: 0), 10),
                        rowsTotal: parseInt(((recordsTotal) ? recordsTotal: 0), 10),
                        page: parseInt(((draw) ? draw: 0), 10),
                        rowsPerPage: parseInt(((rowLength) ? rowLength: 0), 10),
                        orderColumn: orderColumn,
                        orderDir: orderDir
                    })
                })
            );
            newState = state.setIn(['viewItems', action.compId], tempObj);
        }

    } else {
        newState = state.setIn(['viewItems', action.compId], Map({
            [listDataName]: List(data.map((e) => {return Map(e)})),
            [listParamName]: action.listParam.merge({
                rowsFiltered: parseInt(((recordsFiltered) ? recordsFiltered: 0), 10),
                rowsTotal: parseInt(((recordsTotal) ? recordsTotal: 0), 10),
                page: parseInt(((draw) ? draw: 0), 10),
                rowsPerPage: parseInt(((rowLength) ? rowLength: 0), 10),
                orderColumn: orderColumn,
                orderDir: orderDir
            })
        }));
    }

    if(action.extOption) {
        if(action.extOption.isResetSelect) {
            newState = newState.deleteIn(['viewItems', action.compId, 'checkedIds']);
        }
        if(action.extOption.isCloseInform) {
            newState = newState.deleteIn(['viewItems', action.compId, 'informOpen'])
                        .deleteIn(['viewItems', action.compId, 'viewItem']);
        }
    }

    return newState;
}

export const handleGetObjectAction = (state, compId, data, extend, target, idName) => {
    if(data && data.length > 0) {

        const ruleGrade = (extend && extend.length > 0) ? extend[0] : '';
        let selectedOptionItemId = data[0][idName];

        if(target && target != '') {
            
            if(target == 'DEPT' && ruleGrade != 'DEPT') {
                selectedOptionItemId = '';
            } else if(target == 'USER' && ruleGrade != 'USER') {
                selectedOptionItemId = '';
            } else if(target == 'GROUP' && ruleGrade != 'GROUP') {
                selectedOptionItemId = '';
            }
            return state
            .setIn(['viewItems', compId, target, 'viewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, target, 'selectedOptionItemId'], selectedOptionItemId)
            .setIn(['viewItems', compId, target, 'ruleGrade'], ruleGrade)
            .setIn(['viewItems', compId, target, 'informOpen'], true);
        } else {
            return state
            .setIn(['viewItems', compId, 'viewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, 'selectedOptionItemId'], selectedOptionItemId)
            .setIn(['viewItems', compId, 'ruleGrade'], ruleGrade)
            .setIn(['viewItems', compId, 'informOpen'], true);
        }
    } else  {
        return state.deleteIn(['viewItems', compId]);
    }
}

export const handleGetObjectActionForDesktopConf = (state, compId, data, extend, target) => {
    if(data && data.length > 0) {

        const ruleGrade = (extend && extend.length > 0) ? extend[0] : '';
        let selectedOptionItemId = data[0].confId;

        if(target && target != '') {
            
            if(target == 'DEPT' && ruleGrade != 'DEPT') {
                selectedOptionItemId = '';
            } else if(target == 'USER' && ruleGrade != 'USER') {
                selectedOptionItemId = '';
            } else if(target == 'GROUP' && ruleGrade != 'GROUP') {
                selectedOptionItemId = '';
            }
            return state
            .setIn(['viewItems', compId, target, 'viewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, target, 'selectedOptionItemId'], selectedOptionItemId)
            .setIn(['viewItems', compId, target, 'ruleGrade'], ruleGrade)
            .setIn(['viewItems', compId, target, 'informOpen'], true);
        } else {
            return state
            .setIn(['viewItems', compId, 'viewItem'], fromJS(data[0]))
            .setIn(['viewItems', compId, 'selectedOptionItemId'], selectedOptionItemId)
            .setIn(['viewItems', compId, 'ruleGrade'], ruleGrade)
            .setIn(['viewItems', compId, 'informOpen'], true);
        }
    } else  {
        return state.deleteIn(['viewItems', compId]);
    }
}

export const handleShowDialogAction = (state, action) => {

    return state.merge({
        editingItem: action.viewItem,
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
        .setIn(['viewItems', action.compId, 'viewItem'], action.viewItem)
        .setIn(['viewItems', action.compId, 'selectId'], action.selectId)
        .setIn(['viewItems', action.compId, 'informOpen'], true);
}

export const handleCloseInformAction = (state, action) => {
    return state
        .setIn(['viewItems', action.compId, 'informOpen'], false)
        .deleteIn(['viewItems', action.compId, 'selectId'])
        .deleteIn(['viewItems', action.compId, 'viewItem']);
}

export const handleEditSuccessAction = (state, action) => {
    let newState = state;
    if(newState.get('viewItems')) {
        newState.get('viewItems').forEach((e, i) => {
            // if(e.get('viewItem')) {
            //     if(e.getIn(['viewItem', 'objId']) == action.objId) {
                    // replace
                    newState = newState
                        .setIn(['viewItems', i, 'viewItem'], fromJS(action.response.data.data[0]))
//                        .setIn(['viewItems', i, 'informOpen'], false);
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

export const handleDeleteSuccessAction = (state, action, idName) => {
    let newState = state;
    if(newState.get('viewItems')) {
        newState.get('viewItems').forEach((e, i) => {
            if(e.get('viewItem')) {
                if(e.getIn(['viewItem', idName]) == action[idName]) {
                    // replace
                    newState = newState.deleteIn(['viewItems', i, 'viewItem']);
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

export const handleDeleteSuccessActionForDesktopConf = (state, action) => {
    let newState = state;
    if(newState.get('viewItems')) {
        newState.get('viewItems').forEach((e, i) => {
            if(e.get('viewItem')) {
                if(e.getIn(['viewItem', 'confId']) == action.confId) {
                    // replace
                    newState = newState.deleteIn(['viewItems', i, 'viewItem']);
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

