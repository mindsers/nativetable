export default class Nativetable {

  /**
   * Data sources of Nativetable
   *
   * @return {Object[]} - sources
   */
  get source() {
    return this._data
  }

  /**
   * Data sources of Nativetable.
   *
   * @param {Object[]} value - sources
   */
  set source(value) {
    this._data = value
  }

  /**
   * Data source filtered by filters
   *
   * @return {Object[]}
   */
  get filtered() {
    return this.source
  }

  /**
   * Colum's nouns
   *
   * @return {string[]} - colum's nouns
   */
  get columns() {
    let headers = this._columns || []

    if (headers.length > 0) {
      return headers
    }

    this.filtered.map((el) => {
      let tmpHeaders = Object.keys(el)

      for (let col of tmpHeaders) {
        if (headers.indexOf(col) !== -1) {
          continue
        }

        headers.push(col)
      }
    })

    return headers
  }

  /**
   * Colum's nouns
   *
   * @param {string[]} value - colum's nouns
   */
  set columns(value) {
    this._columns = []

    for (let noun of value) {
      if (typeof noun === 'string') {
        this._columns.push(noun)
      }
    }
  }

  /**
   * @param {string}    id                  - identifiant of <table/> tag targeted
   * @param {Object}    options             - options of Nativetable
   * @param {Object[]}  options.datasource  - array of source values
   * @param {Object}    options.filters     - filters to applies
   * @param {string[]}  options.columns      - column's nouns
   *
   * @return {Nativetable} - an instance of Nativetable
   */
  constructor(id, { datasource = [], filters = {}, columns = [] } = {}) {
    this._tableBox = document.getElementById(id)
    this.source = datasource
    this.columns = columns

    this.draw()
  }

  /**
   * Draw HTML table.
   */
  draw() {
    let headerstr = ''
    let bodystr = ''
    for (let noun of this.columns) {
      headerstr += `<td>${noun}</td>`
    }
    headerstr = `<tr>${headerstr}</tr>`

    for (let row of this.filtered) {
      let rowstr = ''
      for (let noun of this.columns) {
        let val = typeof row[noun] === 'undefined' ? '' : row[noun]
        rowstr += `<td>${val}</td>`
      }
      bodystr += `<tr class="nativetable-row" data-nativetable-object="${this.objectSignature(row)}">${rowstr}</tr>`
    }

    this._tableBox.innerHTML = `<thead class="nativetable-head">${headerstr}</thead><tbody class="nativetable-body">${bodystr}</tbody>`
  }

  /**
   * Return object signature in b64
   *
   * @param {Object} obj - object to sign
   *
   * @return {string} - object signature
   */
  objectSignature(obj) {
    return btoa(JSON.stringify(obj, this.columns))
  }
}
