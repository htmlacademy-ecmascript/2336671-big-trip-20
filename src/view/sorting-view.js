import { SortType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

function createSortingTemplate (currentSortType) {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" ${currentSortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SortType.TIME ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>`
  );
}

export default class SortingView extends AbstractView {

  #currentSortType = null;
  #handleSortChange = null;

  constructor ({currentSortType, onSortChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortChange = onSortChange;
    this.element.addEventListener('click', this.#sortChangeClick);
  }

  get template () {
    return createSortingTemplate(this.#currentSortType);
  }

  #sortChangeClick = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();
      this.#handleSortChange(evt.target.id);
    }
  };
}
