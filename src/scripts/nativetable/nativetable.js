export default class Nativetable {

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
    this.data.sources = rows
  }

  /**
   * Data sources filtered by filters
   * Getter
   *
   * @return {Object[]}
   */
  get filtered() {
    return this.sources
  }

  /**
   * Data sources paginated
   * Getter
   *
   * @return {Object[]}
   */
  get paginated() {
    if ( // pagination en cache
      this.data.paginated &&
      this.data.paginated.length > 0 &&
      this.data.reloading === false
    ) {
      return this.data.paginated
    }

    const sources = this.filtered
    const maxLength = this.options.pagination.maxLength

    if (maxLength === -1) { // pas de pagination
      this.data.paginated = sources
      return this.data.paginated
    }

    let pages = []
    let page = []

    for (let row of sources) {
      if (page.length >= maxLength) {
        pages.push(page)
        page = []
      }

      page.push(row)
    }
    pages.push(page)

    this.data.paginated = pages
    return this.data.paginated
  }

  /**
   * Colum's nouns getter
   *
   * @return {string[]} - colum's nouns
   */
  get columns() {
    let headers = this.options.columns || []

    if (headers.length > 0) {
      return headers
    }

    this.filtered.forEach((el) => {
      let tmpHeaders = Object.keys(el)

      for (let col of tmpHeaders) {
        if (headers.indexOf(col) !== -1) {
          continue
        }

        headers.push(col)
      }
    })

    this.options.columns = headers
    return this.options.columns
  }

  /**
   * Colum's nouns setter
   *
   * @param {string[]} value - colum's nouns
   */
  set columns(value) {
    this.options.columns = []

    if (value == null) {
      return
    }

    for (let noun of value) {
      if (typeof noun === 'string') {
        this.options.columns.push(noun)
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
   * @throws {TypeError} if the id parameter is invalid
   *
   * @return {Nativetable} - an instance of Nativetable
   */
  constructor(id, { sources = [], filters = {}, columns = [], pagination = {} } = {}) {
    this.options = {}
    this.data = {}

    if (typeof id !== 'string' || document.getElementById(id) == null) {
      throw new TypeError('First parameter of Nativetable need to be a valid tag ID.')
    }

    this.options.id = id
    this.options.box = document.getElementById(id)
    this.options.pagination = {
      currentPage: 0,
      maxLength: typeof pagination.maxLength === 'number' ? pagination.maxLength : -1
    }

    this.columns = columns
    this.sources = sources

    this.draw()
  }

  /**
   * Reload data before drawing table
   *
   * @param {Object[]} rows - objects to reload
   */
  reload(rows = []) {
    this.sources = rows.length > 0 ? rows : this.sources

    this.data.reloading = true
    this.draw()
    this.data.reloading = false
  }

  /**
   * Draw HTML table.
   *
   * @param {number} page - page to draw
   */
  draw(page = 0) {
    let headerstr = ''
    let bodystr = ''
    for (let name of this.columns) {
      headerstr += `
      <td>
        ${name}
      </td>`
    }

    headerstr = `
    <tr>
      ${headerstr}
    </tr>`

    for (let row of this.filtered) {
      let rowstr = ''
      for (let name of this.columns) {
        let val = typeof row[name] === 'undefined' ? '' : row[name]
        rowstr += `
        <td>
          ${val}
        </td>`
      }

      bodystr += `
      <tr class="nativetable-row" data-nativetable-object="${this.objectSignature(row)}">
        ${rowstr}
      </tr>`
    }

    this.options.box.innerHTML = `
    <table>
      <thead class="nativetable-head">
        ${headerstr}
      </thead>
      <tbody class="nativetable-body">
        ${bodystr}
      </tbody>
    </table>`
  }

  paginatedRows(page = 0) {
    let nb = this.options.pagination.maxLength
    let firstEl = nb * page
    let offset = this.filtered.length - firstEl
    let lastEl = offset < firstEl + nb ? offset : firstEl + nb
    let elements = []

    if (nb === -1) {
      return this.filtered
    }

    if (firstEl >= this.filtered.length) {
      return elements
    }

    for (let index = firstEl; index < lastEl; index += 1) {
      elements.push(this.filtered[index])
    }

    return elements
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
