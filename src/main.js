import EventsPresenter from './presenter/events-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import FIlterModel from './model/filters-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const newEventElement = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
const filterModel = new FIlterModel();

const tripInfoPresenter = new TripInfoPresenter({eventContainer: tripMainElement, pointsModel});
const eventsPresenter = new EventsPresenter({eventContainer: tripEventsElement, pointsModel, filterModel});
const filtersPresenter = new FiltersPresenter({eventContainer: filtersElement, pointsModel, filterModel});

tripInfoPresenter.init();
filtersPresenter.init();
eventsPresenter.init();

newEventElement.addEventListener('click', () => {
  console.log('click');
  newEventElement.disabled = true;
  eventsPresenter.createPoint();
});
