import filtersView from './View/filters-view.js';
import sortingView from './View/sorting-view.js';
import {render} from './render.js';

const filtersControls = document.querySelector('.trip-controls__filters');
const sortingControls = document.querySelector('.trip-events');

render (new filtersView(), filtersControls);
render (new sortingView(), sortingControls);
