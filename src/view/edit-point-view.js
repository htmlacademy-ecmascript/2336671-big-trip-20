import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { offerTitleJoin } from '../utils/common.js';
import { getDestinationById } from '../utils/point.js';
import he from 'he';

function createCityElements (cities) {
  return (
    cities.map((city) => (`<option value="${city}"></option>`)).join(' ')
  );
}

function createDestinationElement (destination) {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">

          ${createPictureElements(destination.pictures)}

        </div>
      </div>
    </section>`);
}

function createPictureElements (pictures) {
  return (
    pictures.map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )).join('')
  );
}

function createEventsElements (events) {
  return (
    events.map((event) => (
      `<div class="event__type-item">
        <input id="event-type-${event}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${event}">
        <label class="event__type-label  event__type-label--${event}" for="event-type-${event}-1">${event.charAt(0).toUpperCase() + event.substr(1).toLowerCase()}</label>
      </div>`
    )).join('')
  );
}

function createOffersElement(offersByType, offers, isDisabled) {
  return (`
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createOffersList(offersByType, offers, isDisabled)}
      </div>
    </section>
  `);
}

function createOffersList (offersByType, offers, isDisabled) {
  const newOffers = [];
  let counter = 1;

  offersByType.forEach((offer) => {

    const isChecked = offers.includes(offer.id) ? 'checked' : '';

    newOffers.push(`
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitleJoin(offer.title)}-${counter}" type="checkbox" name="event-offer-${offerTitleJoin(offer.title)}" data-id="${offer.id}" ${isChecked} ${isDisabled ? 'disabled' : ''}>
          <label class="event__offer-label" for="event-offer-${offerTitleJoin(offer.title)}-${counter}">
            <span class="event__offer-title">${offer.title}</span>
            +€&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`);
    counter += 1;
  });

  return newOffers.join('');
}

function createEditPointTemplate (
  point,
  cities,
  events,
  allOffers,
  destinations) {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isSaving,
    isDeleting,
    isDisabled,} = point;

  const thisDestination = getDestinationById(destination, destinations);
  const offersType = allOffers.find((offer) => offer.type === type);

  return (`
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createEventsElements(events)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${thisDestination ? he.encode(thisDestination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} required>
          <datalist id="destination-list-1">
            ${createCityElements(cities)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''}" ${isDisabled ? 'disabled' : ''}>
          —
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            €
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}" ${isDisabled ? 'disabled' : ''} required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersType.offers.length ? createOffersElement(offersType.offers, offers, isDisabled) : ''}

        ${thisDestination ? createDestinationElement(thisDestination) : ''}
      </section>
    </form>
  </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {

  #cities = null;
  #events = null;
  #offers = null;
  #destinations = null;

  #handleFormSubmit = null;
  #handleFormCancel = null;
  #handleFormDelete = null;

  #startDatePicker = null;
  #endDatePicker = null;

  constructor ({point, cities, events, offers, destinations, onFormSubmitClick, onFormCancelClick, onFormDeleteClick}) {
    super();
    this.#cities = cities;
    this.#events = events;
    this.#offers = offers;
    this.#destinations = destinations;

    this._setState(EditPointView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmitClick;
    this.#handleFormCancel = onFormCancelClick;
    this.#handleFormDelete = onFormDeleteClick;

    this._restoreHandlers();
  }

  get template () {
    return createEditPointTemplate(
      this._state,
      this.#cities,
      this.#events,
      this.#offers,
      this.#destinations,
    );
  }

  _restoreHandlers = () => {
    const form = this.element.querySelector('form');

    form.addEventListener('submit', this.#onFormSubmitClick);
    form.addEventListener('reset', this.#onFormDeleteClick);

    form.querySelector('.event__rollup-btn').addEventListener('click', this.#onCancelButtonClick);
    form.querySelector('.event__type-group').addEventListener('change', this.#onEventTypeChange);
    form.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);
    form.querySelector('.event__input--price').addEventListener('change', this.#onPriceChange);
    const eventOffers = form.querySelector('.event__available-offers');

    if(eventOffers) {
      eventOffers.addEventListener('change', this.#onOfferChange);
    }

    this.#setDatePicker();
  };

  #onFormSubmitClick = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #onFormDeleteClick = (evt) => {
    evt.preventDefault();
    this.#handleFormDelete(EditPointView.parseStateToPoint(this._state));
  };

  #onCancelButtonClick = (evt) => {
    evt.preventDefault();
    this.#handleFormCancel();
  };

  #onEventTypeChange = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        offers: [],
        type: evt.target.value
      });
    }
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id,
      });
    } else {
      evt.target.value = '';
      this.updateElement({
        destination: '',
      });
    }
  };

  #onPriceChange = (evt) => {
    evt.preventDefault();
    const newPrice = Math.round(Math.abs(parseFloat(evt.target.value)));

    if (isNaN(newPrice)) {
      evt.target.value = '';
      this._setState({
        basePrice: ''
      });
      return;
    }
    evt.target.value = newPrice;
    this._setState({
      basePrice: newPrice
    });
  };

  #onOfferChange = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
      const offersIds = checkedOffers.map((offer) => offer.dataset.id);

      this._setState({
        offers: [...offersIds]
      });

    }
  };

  #startDateChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #endDateChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };

  #setDatePicker () {
    const startDate = this.element.querySelector('#event-start-time-1');
    const endDate = this.element.querySelector('#event-end-time-1');

    this.#startDatePicker = flatpickr(
      startDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        locale: {
          firstDayOfWeek: 1
        },
        onChange: this.#startDateChangeHandler,
      }
    );

    this.#endDatePicker = flatpickr(
      endDate,
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        locale: {
          firstDayOfWeek: 1
        },
        onChange: this.#endDateChangeHandler,
      }
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#startDatePicker && this.#endDatePicker) {
      this.#startDatePicker.destroy();
      this.#endDatePicker.destroy();

      this.#startDatePicker = null;
      this.#endDatePicker = null;
    }
  }

  static parsePointToState = (point) => ({
    ...point,
    isSaving: false,
    isDeleting: false,
    isDisabled: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;
    return point;
  };

  reset (point) {
    this.updateElement(EditPointView.parsePointToState(point));
  }

}
