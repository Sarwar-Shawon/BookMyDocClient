/*
 * @copyRight by md sarwar hoshen.
 */

import moment from 'moment';
//
export const formatDateToString = (val) => {
  if (!val) return '';
  const formattedDate = moment(val).format('DD-MM-YYYY');
  return formattedDate;
};
//
export const formatStringToStringDate = (val) => {
  if (!val) return '';
  const formattedDate = moment(val).format('DD-MM-YYYY');
  return formattedDate;
};
//
export const calculateAge = (val) => {
  const dob = moment(val);
  const age = moment().diff(dob, "years");
  return age;
};
