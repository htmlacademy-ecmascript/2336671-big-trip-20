import TripEventsListView from '../view/trip-events_list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events_list-empty.js';
import { render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { updateItem } from '../utils/common.js';

export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #sortComponent = new SortingView();
  #emptyListComponent = new TripEventsListEmptyView();

  #eventContainer = null;
  #pointsModel = null;

  #eventPoints = [];
  #eventPresenters = new Map();

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

  #handleEventChange = (updatedEvent) => {
    this.#eventPoints = updateItem(this.#eventPoints, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);

    this.#eventPresenters.set(point.id, eventPresenter);
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
