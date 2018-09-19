import { FilterApplicator } from './filter-applicator.class.js'

export class Nativetable {
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
   * Apply filters on source.
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
}
