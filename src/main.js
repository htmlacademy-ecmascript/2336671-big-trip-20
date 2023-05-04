import { render } from './render.js';
import FiltersView from './View/filters-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';


const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel ();
const tripInfoPresenter = new TripInfoPresenter({eventContainer: tripMainElement, pointsModel});
const eventsPresenter = new EventsPresenter({eventContainer: tripEventsElement, pointsModel});

render (new FiltersView(), filtersElement);

tripInfoPresenter.init();
eventsPresenter.init();
