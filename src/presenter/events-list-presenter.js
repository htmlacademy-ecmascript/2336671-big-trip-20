import TripEventsListView from '../view/trip-events_list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events_list-empty.js';
import { render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';

export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #sortComponent = new SortingView();
  #emptyListComponent = new TripEventsListEmptyView();

  #eventContainer = null;
  #pointsModel = null;

  #eventPoints = [];

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
  }

  init () {
    this.#eventPoints = [...this.#pointsModel.points];

    this.#renderEventsList();
  }

  #renderEventsList() {
    if (!this.#eventPoints.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();
    this.#renderEvents();
  }

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({eventsListContainer: this.#eventsListComponent.element});
    eventPresenter.init(point);
  }

  #renderEvents() {
    render (this.#eventsListComponent, this.#eventContainer);

    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderEvent(this.#eventPoints[i]);
    }
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventContainer);
  }

  #renderSort() {
    render (this.#sortComponent, this.#eventContainer);
  }
}
