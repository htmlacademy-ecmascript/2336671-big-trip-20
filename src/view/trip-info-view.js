import AbstractView from '../framework/view/abstract-view.js';
import { getDestinationById } from '../mocks/destinations.js';
import { getOfferById } from '../mocks/offers.js';
import { humanizePointDate } from '../utils/point.js';

const humanizeTripDates = (startDate, endDate) => {
  const start = startDate.split(' ').reverse();
  const end = endDate.split(' ').reverse();

  if (start[0] === end[0]) {
    end.shift();
  }

  return `${start.join(' ')}&nbsp;&mdash;&nbsp;${end.join(' ')}`;

};

function createTripInfoTemplate (points) {

  const destinations = [];

  let sum = 0;

  points.forEach((point) => {
    destinations.push(getDestinationById(point.destination).name);

    const pointOffers = point.offers.map((offerId) => getOfferById(offerId));
    const offersPrice = pointOffers.reduce((total, offer) => total + offer.price, 0);

    sum += point.basePrice + offersPrice;
  });

  const startDate = humanizePointDate(points[0].dateFrom);
  const endDate = humanizePointDate(points[points.length - 1].dateTo);

  const humanizeTripDate = (humanizeTripDates(startDate, endDate));

  return (`
  <section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${destinations.length > 3 ? `${destinations[0]} &mdash; ... &mdash; ${destinations[destinations.length - 1]}` : destinations.join(' &mdash; ')}</h1>

    <p class="trip-info__dates">${humanizeTripDate}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
  </p>
</section>`);
}

export default class TripInfoView extends AbstractView {

  #points = null;

  constructor ({points}) {
    super();
    this.#points = points;
  }

  get template () {
    return createTripInfoTemplate(this.#points);
  }
}
