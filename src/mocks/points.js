import { CITIES, EVENTS } from '../const.js';
import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils.js';
import { getOffersIds } from './offers.js';

const randomPointID = createIdGenerator();
const dateStep = createIdGenerator();

//to-do list points

const getPoint = () => {
  const pointType = getRandomArrayElement(EVENTS);
  const offerIds = getOffersIds(pointType);

  const point = {
    id: randomPointID(),
    basePrice: getRandomInteger(100, 2000),
    dateFrom: new Date(new Date().getTime() + (dateStep() * getRandomInteger(500, 550) * 60 * 60 * 24)),
    dateTo: new Date(new Date().getTime() + (dateStep() * 550 * 60 * 60 * 24)),
    destination: getRandomInteger(1, CITIES.length),
    isFavorite: Math.random() < 0.5,
    offers: offerIds.slice(0, offerIds.length - 1),
    type: pointType
  };
  return point;
};

export { getPoint };
