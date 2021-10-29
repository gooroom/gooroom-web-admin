export const convertCsvToJson = (csv) => {
  const rows = csv.split('\r\n');

  const json = [];

  const headers = rows[0].split(',');

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