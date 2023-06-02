import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate (filter, currentFilter) {
  const {type, isDisabled} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${(type).toLowerCase()}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${(type).toLowerCase() === currentFilter.toLowerCase() ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${(type).toLowerCase()}">${type}</label>
    </div>`
  );

}

function createFiltersTemplate (filterItems, currentFilter) {

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilter))
    .join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {

  #filters = null;
  #onFilterClick = null;
  #currentFilter = null;

  constructor ({filters, onFilterClick, currentFilter}) {
    super();
    this.#filters = filters;
    this.#onFilterClick = onFilterClick;
    this.#currentFilter = currentFilter;

    this.element.addEventListener('change', this.#filterHandler);
  }

  get template () {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterClick(evt.target.value);
  };

}
