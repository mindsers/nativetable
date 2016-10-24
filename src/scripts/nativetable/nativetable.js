export default class Nativetable {

  /**
   * Data source filtered by filters
   * Getter
   *
   * @return {Object[]}
   */
  get filtered() {
    return this.sources
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

    if (typeof id !== 'string' || document.getElementById(id) == null) {
      throw new TypeError('First parameter of Nativetable need to be a valid tag ID.')
    }

    this.options.id = id
    this.options.box = document.getElementById(id)
    this.options.pagination = {
      current: 0,
      nbElements: typeof pagination.nbElements === 'number' ? pagination.nbElements : -1
    }

    this.columns = columns
    this.sources = sources

    this.draw()
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
    let nb = this.options.pagination.nbElements

    if (nb === -1) {
      return this.filtered
    }

    let firstEl = nb * page
    let elements = []

    for (let index = firstEl; index < firstEl + nb; index += 1) {
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
