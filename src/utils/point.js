import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


const DATE_FORMAT = 'D MMM';
const TIME_FORMAT = 'HH:mm';

export const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
export const humanizePointTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';

export const getDuration = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom));

export const getEventDuration = (dateFrom, dateTo) => {
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

export function isPointFuture(dateFrom) {
  return dateFrom && dayjs().isBefore(dateFrom, 'D');
}

export function isPointPast(dateTo) {
  return dateTo && dayjs().isAfter(dateTo, 'D');
}

export function isPointPreset(dateFrom, dateTo) {
  const isDateFromSameDateOrBefore = dayjs().isSameOrAfter(dayjs(dateFrom), 'D');
  const isDateToSameDateOrAfter = dayjs().isSameOrBefore(dayjs(dateTo), 'day');

  return isDateFromSameDateOrBefore && isDateToSameDateOrAfter;
}

export const getDestinationById = (id, destinations) => destinations.find((destination) => destination.id === id);

export const getOfferById = (id, offers) => {
  let offerItem;
  offers.forEach((offer) => {
    offer.offers.forEach((item) => {
      if (item.id === id) {
        offerItem = item;
      }
    });
  });
  return offerItem;
};
