import { EVENTS, OFFERS } from '../const.js';
import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils.js';

const MAX_OFFERS = 5;

const randomOfferID = createIdGenerator();

const getOfferDescription = () => ({
  id: randomOfferID(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInteger(10, 500)
});

const getOffer = () => ({
  type: getRandomArrayElement(EVENTS),
  offers: Array.from ({length: getRandomInteger(0, MAX_OFFERS)}, getOfferDescription)
});

export { getOffer };
