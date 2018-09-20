import { FilterApplicator } from './filter-applicator.class.js'
import { Sorter } from './sorter.class.js'

export class Nativetable {
  /**
   * Data sources
   * Getter
   *
   * @return {Object[]}
   */
  get sources() {
    return this.data.sources
  }

  /**
   * Data sources
   * Setter
   *
   * @return {Object[]}
   */
  set sources(rows) {
    this.options.reloading.filtered = true
    this.options.reloading.sorted = true
    this.options.reloading.paginated = true
    this.data.sources = rows
  }

  /**
   * Data sources filtered by filters
   * Getter
   *
   * @return {Object[]}
   */
  get filtered() {
    return this.data.filtered
  }

  /**
   * Data sources sorted
   * Getter
   *
   * @return {Object[]}
   */
  get sorted() {
    return this.data.sorted
  }

  /**
   * @param {Object}    [options]                      - options of Nativetable
   * @param {Object[]}  [options.sources]              - array of source values
   * @param {Object}    [options.filters]              - filters to applies
   * @param {string[]}  [options.columns]              - column's nouns
   * @param {Object}    [options.pagination]           - options for pagination
   * @param {Object}    [options.pagination.maxLength] - number max of elements per page
   * @param {boolean}   [options.sorting]              - a flag that activates sorting
   *
   * @return {Nativetable} - an instance of Nativetable
   */
  constructor({ sources = [], filters = {}, columns = [], pagination: { maxLength = -1 } = {}, sorting = false } = {}) {
    this.options = {}
    this.data = {}

    this.options.reloading = {}
    this.options.filters = filters
    this.options.sorting = {
      activated: sorting
    }
    this.options.pagination = {
      currentPage: 0,
      maxLength
    }

    this.columns = columns
    this.sources = sources
  }

  /**
   * Apply filters on sources.
   * Fill `.filtered` property.
   *
   * @return {Object[]} - The source filtered
   */
  filter() {
    const filters = this.options.filters

    if ( // pagination cached
      this.data.filtered &&
      this.data.filtered.length > 0 &&
      this.options.reloading.filtered === false
    ) {
      return this.data.filtered
    }

    if (Object.keys(filters).length === 0) {
      this.data.filtered = this.sources

      this.options.reloading.filtered = false
      return this.data.filtered
    }

    const applicator = new FilterApplicator(filters)
    this.data.filtered = applicator.apply(this.sources)

    this.options.reloading.filtered = false
    return this.data.filtered
  }

  /**
   * Sort sources
   * Fill `.sorted` property.
   *
   * @return {Object[]}
   */
  sort() {
    if ( // pagination cached
      this.data.sorted &&
      this.data.sorted.length > 0 &&
      this.options.reloading.sorted === false
    ) {
      return this.data.sorted
    }

    const sources = this.filtered
    const { column, order = 'none', activated: isSortingActivated } = this.options.sorting

    if (
      sources.length <= 0 ||
      isSortingActivated === false ||
      typeof column === 'undefined'
    ) { // no sources or no sorting
      this.data.sorted = sources

      this.options.reloading.sorted = false
      return this.data.sorted
    }

    const sorter = new Sorter()
    this.data.sorted = sorter.sort(sources, column, order)

    this.options.reloading.sorted = false
    return this.data.sorted
  }
}
