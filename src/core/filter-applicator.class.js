import { FilterUtils } from './filter.utils'

export class FilterApplicator {
  constructor(filters = {}) {
    this.filters = filters
  }

  /**
   * Apply filters on given source
   *
   * @param {Object[]} sources - List of items to be filtered
   *
   * @return {Object[]}
   */
  apply(sources) {
    if (Object.keys(this.filters).length === 0) {
      return sources
    }

    return sources.filter(item => {
      const results = []
      if ('$and' in this.filters) {
        results.push(this._getAndResults(item))
      }

      if ('$or' in this.filters) {
        results.push(this._getOrResults(item))
      }

      return FilterUtils.applyAndCondition(results)
    })
  }

  _getInnerResults(item, logicalCondition = '$and') {
    const conditions = this.filters[logicalCondition]
    const keys = Object.keys(conditions)
    const innerResults = []

    for (const key of keys) {
      innerResults.push(FilterUtils.applyCustomCondition(item[key], conditions[key]))
    }

    return innerResults
  }

  _getOrResults(item) {
    return FilterUtils.applyOrCondition(
      this._getInnerResults(item, '$or')
    )
  }

  _getAndResults(item) {
    return FilterUtils.applyAndCondition(
      this._getInnerResults(item, '$and')
    )
  }
}
