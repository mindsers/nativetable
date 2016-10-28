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
    if ( // pagination cached
      this.data.paginated &&
      this.data.paginated.length > 0 &&
      this.data.reloading === false
    ) {
      return this.data.paginated
    }

    const sources = this.filtered
    const maxLength = this.options.pagination.maxLength

    if (sources.length <= 0) { // no sources
      this.data.paginated = []
      return this.data.paginated
    }

    if (maxLength === -1) { // no pagination
      this.data.paginated = [ sources ]
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
    this.options.pagination.currentPage = 0
    this.sources = rows.length > 0 ? rows : this.sources

    this.data.reloading = true
    this.draw()
    this.data.reloading = false
  }

  /**
   * Draw HTML table.
   */
  draw() {
    const sources = this.paginated
    const isPaginated = sources.length !== 1

    if (sources.length <= 0) {
      return
    }

    let currentPage = this.options.pagination.currentPage
    currentPage = currentPage < sources.length ? currentPage : 0

    let tableTag, theadTag, tbodyTag, paginationTag

    if ( // Delete pagination if exist
      this.options.box.children[1] &&
      this.options.box.children[1].classList.contains('nt-pagination')
    ) {
      paginationTag = this.options.box.children[1]
      this.options.box.removeChild(paginationTag)
    }

    if (isPaginated) { // Rebuild pagination if data is paginated
      paginationTag = this.buildPagination(sources, currentPage)
      this.options.box.appendChild(paginationTag)
    }

    if ( // Doesn't recreate the full table if already exist
      this.options.box.children[1] &&
      this.options.box.children[1].classList.contains('nt-table')
    ) {
      theadTag = tableTag.children[0]
      tbodyTag = tableTag.children[1]
      tableTag.removeChild(tbodyTag)

      tbodyTag = this.buildTableBody(sources[currentPage], this.columns)
      tableTag.appendChild(tbodyTag)

      return
    }

    // Creation
    tableTag = document.createElement('table')
    theadTag = this.buildTableHeader(this.columns)
    tbodyTag = this.buildTableBody(sources[currentPage], this.columns)

    tableTag.classList.add('nt-table')

    tableTag.appendChild(theadTag)
    tableTag.appendChild(tbodyTag)

    this.options.box.insertBefore(tableTag, paginationTag)
  }

  buildTableHeader(cols) {
    const columns = cols

    let theadTag = document.createElement('thead')
    let trTag = document.createElement('tr')

    theadTag.classList.add('nt-head')

    for (let name of columns) {
      let tdTag = document.createElement('td')
      tdTag.textContent = name
      trTag.appendChild(tdTag)
    }

    theadTag.appendChild(trTag)
    return theadTag
  }

  buildTableBody(rows, cols) {
    const sources = rows
    const columns = cols

    let tbodyTag = document.createElement('tbody')
    tbodyTag.classList.add('nt-body')

    for (let row of sources) {
      let trTag = document.createElement('tr')

      trTag.classList.add('nt-row')
      trTag.dataset.ntObject = this.objectSignature(row)

      for (let name of columns) {
        let tdTag = document.createElement('td')
        tdTag.textContent = typeof row[name] === 'undefined' ? '' : row[name]
        trTag.appendChild(tdTag)
      }

      tbodyTag.appendChild(trTag)
    }

    return tbodyTag
  }

  buildPagination(pages, current = 0) {
    const sources = pages

    let ulTag = document.createElement('ul')
    for (let index in sources) {
      let liTag = document.createElement('li')
      let aTag = document.createElement('a')

      aTag.href = '#'
      aTag.textContent = index

      liTag.classList.add('nt-pagination-item')
      liTag.dataset.ntPaginationIndex = index
      liTag.appendChild(aTag)

      if (index === current) {
        liTag.classList.add('nt-pagination-item-active')
      }

      ulTag.appendChild(liTag)
    }

    ulTag.classList.add('nt-pagination')
    return ulTag
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
