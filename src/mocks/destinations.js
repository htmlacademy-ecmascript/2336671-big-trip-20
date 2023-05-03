import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils.js';
import { CITIES, DESCRIPTIONS } from '../const.js';

const MAX_PICTURES = 5;

const getPicture = () => ({
  src: `https://loremflickr.com/248/152?random=${Math.random()}`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const randomDestinationID = createIdGenerator();

const getDestination = () => ({
  id: randomDestinationID(),
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(CITIES),
  pictures: Array.from({length: getRandomInteger(0, MAX_PICTURES)}, getPicture)
});

export { getDestination };
