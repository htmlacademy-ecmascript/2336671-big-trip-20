import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DATE_FORMAT = 'D MMM';
const TIME_FORMAT = 'HH:mm';

const humanizePointDate = (date) => date ? dayjs(date).format(DATE_FORMAT) : '';
const humanizePointTime = (time) => time ? dayjs(time).format(TIME_FORMAT) : '';

const getEventDuration = (dateFrom, dateTo) => {
  const diff = dayjs.duration(dayjs(dateTo) - dayjs(dateFrom));

  let eventDuration = '';

  if (diff.days() > 0) {
    eventDuration += `${diff.days()}D `;
  }
  if (diff.days() > 0 || diff.hours() > 0) {
    eventDuration += `${diff.hours()}H`;
  }
  if (diff.days() > 0 || diff.hours() > 0 || diff.minutes() > 0) {
    eventDuration += ` ${diff.minutes()}M`;
  }

  return eventDuration;
};

export { humanizePointDate, humanizePointTime, getEventDuration };
