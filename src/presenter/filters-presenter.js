import { generateFilter } from '../mocks/filters.js';
import FiltersView from '../view/filters-view.js';
import { render, remove } from '../framework/render.js';

export default class FiltersPresenter {

  #eventContainer = null;
  #pointsModel = null;

  #filtersViewComponent = null;

  #filters = null;

  constructor ({eventContainer, pointsModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init () {
    this.#filters = generateFilter(this.#pointsModel.points);

    this.#filtersViewComponent = new FiltersView({filters: this.#filters, onFilterClick: this.#handleFilterChange});

    render(this.#filtersViewComponent, this.#eventContainer);
  }

  #handleModelEvent = () => {
    remove(this.#filtersViewComponent);
    this.init();
  };

  #handleFilterChange = (filterType) => {
    console.log(filterType);
  };
}
