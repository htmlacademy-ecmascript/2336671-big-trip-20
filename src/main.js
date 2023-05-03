import {RenderPosition, render} from './render.js';
import FiltersView from './View/filters-view.js';
import TripInfoView from './View/trip-info-view.js';
import EventsPresenter from './presenter/events-presenter.js';
import PointsModel from './model/points-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel ();
const eventsPresenter = new EventsPresenter({eventContainer: tripEventsElement, pointsModel});

render (new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render (new FiltersView(), filtersElement);

eventsPresenter.init();
