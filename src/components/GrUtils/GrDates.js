import moment from 'moment';

export const formatDateToSimple = (value, format) => {
    try {
        const date = new Date(value);
        return moment(date).format(format); //date.toISOString().substring(0, 10);
    } catch (err) {
        return '';
    }
};