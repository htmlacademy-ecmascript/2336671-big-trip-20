import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMM';
const TIME_FORMAT = 'HH:mm';
const DIFF_FORMAT = 'HH[h] mm[m]';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const createIdGenerator = () => {
  let lastGeneratedId = 0;

  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
const humanizePointTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';
const getdatesDifference = (dateFrom, dateTo) => dayjs(dayjs(dateTo).diff(dayjs(dateFrom))).format(DIFF_FORMAT);

export { getRandomArrayElement, getRandomInteger, createIdGenerator, humanizePointDate, humanizePointTime, getdatesDifference };
