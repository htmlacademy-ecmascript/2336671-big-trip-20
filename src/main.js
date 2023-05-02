import FiltersView from './View/filters-view.js';
import SortingView from './View/sorting-view.js';
import {render} from './render.js';

const filtersControls = document.querySelector('.trip-controls__filters');
const sortingControls = document.querySelector('.trip-events');

render (new FiltersView(), filtersControls);
render (new SortingView(), sortingControls);
