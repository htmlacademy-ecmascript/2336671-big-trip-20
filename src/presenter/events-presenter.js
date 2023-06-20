import TripEventsListView from '../view/trip-events-list.js';
import SortingView from '../view/sorting-view.js';
import TripEventsListEmptyView from '../view/trip-events-list-empty.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import TripEventsListLoadingView from '../view/trip-events-list-loading.js';
import EventPresenter from './event-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UserAction, UpdateType, FilterType } from '../const.js';
import { getDuration } from '../utils/point.js';
import { filter } from '../utils/filter.js';
import { remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorView from '../view/error-view.js';

const TimeLimit = {
  LOWER_LIMIT: 300,
  UPPER_LIMIT: 1000,
};

export default class EventsPresenter {
  #eventsListComponent = new TripEventsListView();
  #loadingComponent = new TripEventsListLoadingView();
  #errorComponent = null;

  #newEventComponent = null;
  #sortComponent = null;
  #emptyListComponent = null;

  #eventContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #filterType = null;

  #eventPresenters = new Map();
  #newEventPresenter = null;

  #isNewPoint = false;
  #isLoading = true;

  #currentSortType = SortType.DAY;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({newEventButtonContainer, eventContainer, pointsModel, filterModel}) {
    this.#eventContainer = eventContainer;

    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newEventComponent = new NewPointButtonView({
      onNewPointButtonClick: this.#onNewEventClick
    });

    render(this.#newEventComponent, newEventButtonContainer);

    this.#newEventPresenter = new NewPointPresenter({
      pointsModel: this.#pointsModel,
      pointsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onPointDestroy: this.#handleNewPointFormClose,
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
      pointsModel: this.#pointsModel,
      eventsListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(point);

    this.#eventPresenters.set(point.id, eventPresenter);
  }

  #renderEventsList() {

    if (this.#isLoading) {
      this.#newEventComponent.element.disabled = true;
      this.#renderLoading();
      return;
    }

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

  #renderLoading() {
    render(this.#loadingComponent, this.#eventContainer);
  }

  #renderError(data) {
    this.#errorComponent = new ErrorView(data);
    render(this.#errorComponent, this.#eventContainer);
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
      case UpdateType.INIT:
        this.#isLoading = false;
        this.#newEventComponent.element.disabled = false;
        remove(this.#loadingComponent);
        this.#renderEventsList();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#newEventComponent.element.disabled = true;
        remove(this.#loadingComponent);
        this.#renderError(data);
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
    this.#newEventComponent.element.disabled = true;
    this.#createPoint();
  };

  #handleNewPointFormClose = () => {
    this.#isNewPoint = false;
    this.#newEventComponent.element.disabled = false;
    if (!this.points.length && !this.#isNewPoint) {
      remove(this.#sortComponent);
      this.#renderEmptyList();
    }
  };
}
