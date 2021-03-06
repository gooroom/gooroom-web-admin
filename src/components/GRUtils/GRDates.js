import moment from 'moment';

export const formatDateToSimple = (value, format) => {
    try {
        if(value && value != '') {
            const date = new Date(value);
            return moment(date).format(format); //date.toISOString().substring(0, 10);
        } else {
            return '';
        }
    } catch (err) {
        return '';
    }
};

// 'yyyy-mm-dd' -> 'yyyy-mm-dd hh:mi:ss' -> date
export const formatSimpleStringToStartTime = (value, format) => {
    try {
        return (moment(value + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss')).valueOf();
    } catch (err) {
        return '';
    }
};

export const formatSimpleStringToEndTime = (value, format) => {
    try {
        return (moment(value + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss')).valueOf();
    } catch (err) {
        return '';
    }
};

export const calculateDiffDays = (value) => {
  try {
    const diffDur = moment(value).diff(moment().startOf('day'), 'days');
      return diffDur;
  } catch (err) {
      return '';
  }
}


