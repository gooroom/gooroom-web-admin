import { PORTABLE_IMAGE_STATUS_CODE } from 'components/GRComponents/GRPortableConstants';
import { List } from 'immutable';

//const rowHeads = {
//  id: 'ID',
//  passwd: 'Password',
//  email: 'Email',
//  name: 'Name',
//  phone: 'Phone',
//};

const rowHeads = ['ID', 'Password', 'Email', 'Name', 'Phone'];

const getCsvRows = (csv) => {
  return csv.split('\r\n')
}

const getCsvHead = (rows) => {
  return rows[0].split(',');
}

export const convertCsvToJson = (csv) => {
  const rows = getCsvRows(csv);
  const headers = getCsvHead(rows);

  const json = [];
  for (let i = 1; i < rows.length; i++) {
    let obj = {};
    let row = rows[i].split(',');

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }

    json.push(obj);
  }

  return json;
};

export const isPortableCsvFile = (csv) => {
  const rows = getCsvRows(csv);
  const headers = getCsvHead(rows);

  if (headers.length !== rowHeads.length)
    return false;

  for (let i = 0; i < rowHeads.length; i++) {
    if (headers.indexOf(rowHeads[i]) === -1)
      return false;
  }

  return true;
}

export const getDuplicateStringArray = (arr) => {
  const duplicate = [];
  const str = arr.reduce((acc, cur, idx) => {
    if (arr.indexOf(cur) !== idx) {
      acc.add(cur);
    }

    return acc;
  }, new Set());

  return [...str];
};

export const toStringList = (ids) => {
  return ids.reduce((acc, cur, index, arr) => {
    acc += `\"${cur}\"`;
    if (index === arr.length)
      return acc;

    return acc + ',';
  }, '');
};

export const getItemsExceptCreating = (propObj, compId, idName, status, checked, mappingToId = true) => {
  const listData = propObj.getIn(['viewItems', compId, 'listData']);

  if(checked) {
    const datas = (listData) ? listData.filter((e) => {

      if (PORTABLE_IMAGE_STATUS_CODE[e.get(status)] !== PORTABLE_IMAGE_STATUS_CODE.CREATE) {
        return true;
      }

      return false;
      })
    : List([]);

    if (datas) {
      if (mappingToId) {
        return datas.map(e => {
          return e.get(idName)
        });
      } else {
        return datas;
      }
    }

    return List([]);
  } else {
    return List([]);
  }
}