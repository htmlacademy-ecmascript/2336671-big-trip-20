import {RenderPosition, render} from './render.js';
import FiltersView from './View/filters-view.js';
import SortingView from './View/sorting-view.js';
import TripInfoView from './View/trip-info-view.js';

const tripMainElement = document.querySelector('.trip-main');
const filtersControls = document.querySelector('.trip-controls__filters');
const sortingControls = document.querySelector('.trip-events');

render (new TripInfoView(),tripMainElement, RenderPosition.AFTERBEGIN);
render (new FiltersView(), filtersControls);
render (new SortingView(), sortingControls);

