import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { CITIES, DESCRIPTIONS } from '../const.js';

const MAX_PICTURES = 5;

const getPicture = () => ({
  src: `https://loremflickr.com/248/152?random=${Math.random()}`,
  description: getRandomArrayElement(DESCRIPTIONS)
});

const randomDestinationID = createIdGenerator();

const createDestination = (city) => ({
  id: randomDestinationID(),
  description: getRandomArrayElement(DESCRIPTIONS),
  name: city,
  pictures: Array.from({length: getRandomInteger(0, MAX_PICTURES)}, getPicture)
});

const getDestinations = () => {
  const destinations = [];
  for (let i = 0; i < CITIES.length; i++) {
    destinations[i] = createDestination(CITIES[i]);
  }
  return destinations;
};

const allDestinations = getDestinations();

const getDestinationById = (id) => {
  const destination = allDestinations.find((element) => element.id === id);
  return destination;
};

export { getDestinationById };
