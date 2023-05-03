import { CITIES, EVENTS } from '../const.js';
import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils.js';
import { MAX_OFFERS } from './offers.js';

const randomPointID = createIdGenerator();

const getPoint = () => ({
  id: randomPointID(),
  basePrice: getRandomInteger(100, 2000),
  dateProm: '2019-07-10T22:55:56.845Z',
  dateTo: '2019-07-11T11:22:13.375Z',
  destination: getRandomArrayElement(CITIES),
  isFavorite: false,
  offers: Array.from(new Set(Array.from({length: getRandomInteger(0, MAX_OFFERS)}, () => Math.floor(Math.random() * MAX_OFFERS)))),
  type: getRandomArrayElement(EVENTS)
});

export { getPoint };
