import TripEventsListView from '../view/trip-events_list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events_list-empty.js';
import { remove, render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import { getDuration } from '../utils/point.js';


export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #sortComponent = null;
  #emptyListComponent = new TripEventsListEmptyView();

  #eventContainer = null;
  #pointsModel = null;

  #eventPresenters = new Map();

  #currentSortType = SortType.DAY;

  constructor({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points () {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort((a, b) => a.dateFrom - b.dateFrom);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort((a, b) => {
          const durationA = getDuration(a.dateFrom, a.dateTo);
          const durationB = getDuration(b.dateFrom, b.dateTo);
          return durationB - durationA;
        });
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort((a, b) => b.basePrice - a.basePrice);
    }

    return this.#pointsModel.points;
  }

  init () {
    this.#renderEventsList();
  }

  #renderEvent(point) {
    const eventPresenter = new EventPresenter({
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);

    this.#eventPresenters.set(point.id, eventPresenter);
  }

  #renderEventsList() {
    if (!this.points.length) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();

    render (this.#eventsListComponent, this.#eventContainer);
    this.points.forEach((point) => this.#renderEvent(point));
  }

  #clearEventsList({resetSortType = false} = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderEmptyList() {
    render(this.#emptyListComponent, this.#eventContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortingView({currentSortType: this.#currentSortType, onSortChange: this.#handleSortChange});

    render (this.#sortComponent, this.#eventContainer);
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearEventsList();
        this.#renderEventsList();
        break;
      case UpdateType.MAJOR:
        this.#clearEventsList({resetSortType: true});
        this.#renderEventsList();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearEventsList();
    this.#renderEventsList();
  };
}
