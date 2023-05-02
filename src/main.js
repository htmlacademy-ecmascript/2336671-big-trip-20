import filtersView from './View/filters-view.js';
import {render} from './render.js';

const filtersControls = document.querySelector('.trip-controls__filters');

render (new filtersView(), filtersControls);
