import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


const DATE_FORMAT = 'D MMM';
const TIME_FORMAT = 'HH:mm';

const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
const humanizePointTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';

const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

const getEventDuration = (dateFrom, dateTo) => {
  const diffDays = dayjs(dateTo).diff(dayjs(dateFrom), 'day', true);

  const days = Math.floor(diffDays);
  const hours = Math.floor((diffDays - days) * 24);
  const minutes = Math.floor((((diffDays - days) * 24) - hours) * 60);

  let eventDuration = '';

  if (days > 0) {
    eventDuration += `${days}D `;
  }
  if (days > 0 || hours > 0) {
    eventDuration += `${hours}H`;
  }
  if (days > 0 || hours > 0 || minutes > 0) {
    eventDuration += ` ${minutes}M`;
  }

  return eventDuration;
};

function isPointFuture(dateFrom) {
  return dateFrom && dayjs().isBefore(dateFrom, 'D');
}

function isPointPast(dateTo) {
  return dateTo && dayjs().isAfter(dateTo, 'D');
}

function isPointPreset(dateFrom, dateTo) {
  const isDateFromSameDateOrBefore = dayjs().isSameOrAfter(dayjs(dateFrom), 'D');
  const isDateToSameDateOrAfter = dayjs().isSameOrBefore(dayjs(dateTo), 'day');

  return isDateFromSameDateOrBefore && isDateToSameDateOrAfter;
}

export { humanizePointDate, humanizePointTime, getDuration, getEventDuration, isPointFuture, isPointPast, isPointPreset };
