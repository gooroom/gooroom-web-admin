export const isValidPassword = (password) => {
  //const check = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/.test(password);
  // 숫자, 특수문자 1자 이상 / 8자 이상 20자 이하
  const check = /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(password);

  // 영문, 숫자, 특수문자 조합 / 8자 이상 12자 이하
  if (!check)
    return false;

  return true;
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