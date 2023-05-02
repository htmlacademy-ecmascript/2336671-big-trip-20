import {RenderPosition, render} from './render.js';
import FiltersView from './view/filters-view.js';
import TripInfoView from './view/trip-info-view.js';
import SortingView from './view/sorting-view.js';
import EventsPresenter from './presenter/events-presenter.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsPresenter({eventContainer: tripEventsElement});

render (new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render (new FiltersView(), filtersElement);
render (new SortingView(), tripEventsElement);

eventsPresenter.init();
