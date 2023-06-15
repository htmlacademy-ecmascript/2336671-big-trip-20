import AbstractView from '../framework/view/abstract-view.js';
import { getDestinationById, getOfferById, humanizePointDate } from '../utils/point.js';

const MAX_TRIP_LENGTH = 3;

const humanizeTripDates = (startDate, endDate) => {
  const start = startDate.split(' ').reverse();
  const end = endDate.split(' ').reverse();

  if (start[0] === end[0]) {
    end.shift();
  }

  return `${start.join(' ')}&nbsp;&mdash;&nbsp;${end.join(' ')}`;

};

function createTripInfoTemplate (points, allDestinations, allOffers) {

  const destinations = [];

  let sum = 0;


  points.forEach((point) => {
    destinations.push(getDestinationById(point.destination, allDestinations).name);

    const pointOffers = point.offers.map((offerId) => getOfferById(offerId, allOffers));
    const offersPrice = pointOffers.reduce((total, offer) => total + offer.price, 0);

    sum += point.basePrice + offersPrice;
  });

  const startDate = humanizePointDate(points[0].dateFrom);
  const endDate = humanizePointDate(points[points.length - 1].dateTo);

  const humanizeTripDate = (humanizeTripDates(startDate, endDate));

  return (`
  <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${destinations.length > MAX_TRIP_LENGTH ? `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}` : destinations.join(' &mdash; ')}</h1>

    <p class="trip-info__dates">${humanizeTripDate}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
  </p>
</section>`);
}

export default class TripInfoView extends AbstractView {

  #points = null;
  #destinations = null;
  #offers = null;

  constructor ({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template () {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
