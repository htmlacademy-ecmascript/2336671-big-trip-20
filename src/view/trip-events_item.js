import AbstractView from '../framework/view/abstract-view.js';
import { humanizePointDate, humanizePointTime, getEventDuration } from '../utils/point.js';
import dayjs from 'dayjs';

function createSelectedOffers (offers) {
  return (
    offers.map((offer) => (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      +€&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
    )).join(' ')
  );
}

function createTripEventsItemTemplate (point, pointsModel) {
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type} = point;

  const date = humanizePointDate(dateFrom);
  const timeFrom = humanizePointTime(dateFrom);
  const timeTo = humanizePointTime(dateTo);
  const destinationObject = pointsModel.getDestinationById(destination);
  const eventDuration = getEventDuration(dateFrom, dateTo);
  const favorite = isFavorite ? 'event__favorite-btn--active' : '';

  const offersList = [];

  offers.forEach((id) => {
    offersList.push(pointsModel.getOfferById(id));
  });

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(date).format('YYYY-MM-DD')}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destinationObject.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(dateFrom).format('YYYY-MM-DDTHH:mm')}">${timeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(dateTo).format('YYYY-MM-DDTHH:mm')}">${timeTo}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createSelectedOffers(offersList)}
        </ul>
        <button class="event__favorite-btn ${favorite}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class TripEventsItemView extends AbstractView {

  #pointsModel = null;
  #point = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor ({pointsModel, point, onEditClick, onFavoriteClick}) {
    super();
    this.#pointsModel = pointsModel;
    this.#point = point;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editEventHandler);

    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onFavoriteButtonClick);
  }

  get template() {
    return createTripEventsItemTemplate(this.#point, this.#pointsModel);
  }

  #editEventHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #onFavoriteButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

}