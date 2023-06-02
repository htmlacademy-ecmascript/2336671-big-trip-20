import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate (filter, isChecked) {
  const {type, isDisabled} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${(type).toLowerCase()}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${(type).toLowerCase()}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${(type).toLowerCase()}">${type}</label>
    </div>`
  );

}

function createFiltersTemplate (filterItems) {

  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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

  constructor ({filters, onFilterClick}) {
    super();
    this.#filters = filters;
    this.#onFilterClick = onFilterClick;
    this.element.addEventListener('click', this.#FilterHandler);
  }

  get template () {
    return createFiltersTemplate(this.#filters);
  }

  #FilterHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      evt.preventDefault();
      this.#onFilterClick(evt.target.value);
    }
  };

}
