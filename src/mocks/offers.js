import { OFFERS } from '../const.js';
import { createIdGenerator, getRandomArrayElement, getRandomInteger } from '../utils.js';

const MAX_OFFERS = 5;

const randomOfferID = createIdGenerator();

const getOfferDescription = () => ({
  id: randomOfferID(),
  title: getRandomArrayElement(OFFERS),
  price: getRandomInteger(10, 500)
});

const getOffer = (event) => ({
  type: event,
  offers: Array.from ({length: getRandomInteger(1, MAX_OFFERS)}, getOfferDescription)
});

const offers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Add meal',
        price: 179
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 2,
        title: 'Order Uber',
        price: 237
      },
      {
        id: 3,
        title: 'Add breakfast',
        price: 347
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: 4,
        title: 'Add meal',
        price: 36
      },
      {
        id: 5,
        title: 'Book tickets',
        price: 99
      },
      {
        id: 6,
        title: 'Rent a car',
        price: 273
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 7,
        title: 'Switch to comfort class',
        price: 348
      },
      {
        id: 8,
        title: 'Book tickets',
        price: 378
      },
      {
        id: 9,
        title: 'Lunch in city',
        price: 441
      },
      {
        id: 10,
        title: 'Add breakfast',
        price: 281
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 11,
        title: 'Rent a car',
        price: 63
      },
      {
        id: 12,
        title: 'Add breakfast',
        price: 177
      },
      {
        id: 13,
        title: 'Travel by train',
        price: 335
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 14,
        title: 'Rent a car',
        price: 182
      },
      {
        id: 15,
        title: 'Switch to comfort class',
        price: 453
      },
      {
        id: 16,
        title: 'Lunch in city',
        price: 34
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 17,
        title: 'Add breakfast',
        price: 186
      },
      {
        id: 18,
        title: 'Order Uber',
        price: 150
      },
      {
        id: 19,
        title: 'Add meal',
        price: 218
      },
      {
        id: 20,
        title: 'Book tickets',
        price: 429
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 21,
        title: 'Add breakfast',
        price: 285
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 22,
        title: 'Order Uber',
        price: 103
      },
      {
        id: 23,
        title: 'Book tickets',
        price: 40
      },
      {
        id: 24,
        title: 'Add luggage',
        price: 254
      },
      {
        id: 25,
        title: 'Rent a car',
        price: 434
      },
      {
        id: 26,
        title: 'Lunch in city',
        price: 308
      }
    ]
  }
];

export { getOffer, MAX_OFFERS, offers };
