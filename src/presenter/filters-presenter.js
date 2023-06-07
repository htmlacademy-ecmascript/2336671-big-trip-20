import FiltersView from '../view/filters-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';
import { filter } from '../utils/filter.js';
export default class FiltersPresenter {

  #eventContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #filtersViewComponent = null;

  constructor ({eventContainer, pointsModel, filterModel}) {
    this.#eventContainer = eventContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters () {
    const points = this.#pointsModel.points;

    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        isDisabled: !filterPoints(points).length,
      }),
    );
  }

  init () {
    const filters = this.filters;

    this.#filtersViewComponent = new FiltersView({
      filters: filters,
      onFilterClick: this.#handleFilterChange,
      currentFilter: this.#filterModel.filter
    });

    render(this.#filtersViewComponent, this.#eventContainer);
  }

  #handleModelEvent = () => {
    remove(this.#filtersViewComponent);
    this.init();
  };

  #handleFilterChange = (filterType) => {

    if (this.#filterModel.filter.toLowerCase() === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);

  };
}
