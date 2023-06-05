import TripEventsListView from '../view/trip-events_list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events_list-empty.js';
import { remove, render } from '../framework/render.js';
import EventPresenter from './event-presenter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { getDuration } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';


export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #sortComponent = null;
  #emptyListComponent = null;

  #eventContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #filterType = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #newEventElement = document.querySelector('.trip-main__event-add-btn');

  #isNewPoint = false;

  #currentSortType = SortType.DAY;

  constructor({eventContainer, pointsModel, filterModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventElement.addEventListener('click',this.#onNewEventClick);

    this.#newEventPresenter = new NewPointPresenter({
      pointsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onPointDestroy: this.#handleNewTaskFormClose,
    });
  }

  get points () {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort((a, b) => a.dateFrom - b.dateFrom);
      case SortType.TIME:
        return filteredPoints.sort((a, b) => {
          const durationA = getDuration(a.dateFrom, a.dateTo);
          const durationB = getDuration(b.dateFrom, b.dateTo);
          return durationB - durationA;
        });
      case SortType.PRICE:
        return filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
    }

    return filteredPoints;
  }

  init () {
    this.#renderEventsList();
  }

  #createPoint () {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
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
    if (!this.points.length && !this.#isNewPoint) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort();

    render (this.#eventsListComponent, this.#eventContainer);
    this.points.forEach((point) => this.#renderEvent(point));
  }

  #clearEventsList({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderEmptyList() {
    this.#emptyListComponent = new TripEventsListEmptyView({filterType: this.#filterType});
    render(this.#emptyListComponent, this.#eventContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortingView({currentSortType: this.#currentSortType, onSortChange: this.#handleSortChange});

    render (this.#sortComponent, this.#eventContainer);
  }

  #handleModeChange = () => {
    this.#newEventPresenter.destroy();
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

  #onNewEventClick = () => {
    this.#isNewPoint = true;
    this.#newEventElement.disabled = true;
    this.#createPoint();
  };

  #handleNewTaskFormClose = () => {
    this.#isNewPoint = false;
    this.#newEventElement.disabled = false;
    if (!this.points.length && !this.#isNewPoint) {
      remove(this.#sortComponent);
      this.#renderEmptyList();
    }
  };
}
