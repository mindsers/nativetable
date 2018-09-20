export class Sorter {
  /**
   * Sort the given source
   *
   * @param {Object[]} sources - List of items to be sorted
   * @param {string} column - The column name to be sorted
   * @param {string} order - The sorting order. 'asc', 'desc' or 'none'
   *
   * @return {Object[]}
   */
  sort(sources, column, order = 'none') {
    return sources
      .map(this._simplifyData(column)) // create temporary array that is easier to sort
      .sort(this._sortData(order))
      .map(e => sources[e.index]) // rebuild sources
  }

  _simplifyData(column) {
    return (el, index) => {
      let value = el[column]

      if (typeof el[column] === 'string') {
        value = el[column].toLowerCase()
      }

      if (typeof el[column] === 'undefined') {
        value = ''
      }

      return { index, value }
    }
  }

  _sortData(order) {
    return (a, b) => {
      if (a.value > b.value) {
        return order === 'asc' ? 1 : -1
      }

      if (a.value < b.value) {
        return order === 'asc' ? -1 : 1
      }

      return 0
    }
  }
}
