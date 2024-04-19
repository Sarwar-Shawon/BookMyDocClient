/*
 * @copyRight by md sarwar hoshen.
 */

import moment from 'moment';
//
export const formatStringToDate = (val) => {
  if (!val) return '';
  const formattedDate = moment(val, "DD-MM-YYYY").toDate();
  return formattedDate;
};
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
//
export const calculateValidDt = (val) => {
  const now = moment();
  const upd = now.add(val, 'months');
  return formatStringToStringDate(upd);
};
