import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const EmptyListText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESET]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function cretateTripEventsListEmptyTemplate (filterType) {
  return `<p class="trip-events__msg">${EmptyListText[filterType]}</p>`;
}

export default class TripEventsListEmptyView extends AbstractView {

  #filterType = null;

  constructor ({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template () {
    return cretateTripEventsListEmptyTemplate(this.#filterType);
  }
}
