export const isValidPassword = (password) => {
  return /^.*(?=^.{8,20}$)(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()=_+?><.,\"\'\/\|\\\-`~;:\[\]\{\}]).*$/.test(password);
};

export const isEmpty = (value) => {
  return value === '';
};

export const isUndefined = (value) => {
  return value === undefined;
};

export const isNull = (value) => {
  return value === null;
};

export const isValidEmail = (email) => {
  const regex = /[a-zA-Z0-9/.+_-]+@[a-zA-Z0-9./+_-]+\.[a-zA-Z0-9.+_-]{2,}/;

  if (regex.test(email))
    return true;

  return false;
};

export const getInvalidEmailInJson = (json, key) => {
  return json.reduce((acc, cur, idx) => {
    if (!isEmpty(cur[key]) && !isUndefined(cur[key]) && !isValidEmail(cur[key]))
      acc.push(cur.Email);

    return acc;
  }, []);
};