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
    this.options.reloading.filtered = true
    this.options.reloading.sorted = true
    this.options.reloading.paginated = true
    this.data.sources = rows
  }

  /**
   * Filters rules
   * Getter
   *
   * @return {Object}
   */
  get filters() {
    return this.options.filters
  }

  /**
   * Filters rules
   * Setter
   *
   * @return {Object}
   */
  set filters(filters) {
    this.options.reloading.filtered = true
    this.options.filters = filters
  }

  /**
   * Data sources filtered by filters
   * Getter
   *
   * @return {Object[]}
   */
  get filtered() {
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

    /**
     * Closure
     * AND logical condition
     *
     * @param {Object[]} items - array of boolean value
     * @returns {boolean}
     */
    let $and = (items) => {
      let condition = true
      for (let item of items) {
        condition = condition && item
      }

      return condition
    }

    /**
     * Closure
     * OR logical condition
     *
     * @param {Object[]} items - array of boolean value
     * @returns {boolean}
     */
    let $or = (items) => {
      let condition = false
      for (let item of items) {
        condition = condition || item
      }

      return condition
    }

    /**
     * Closure
     * Calculate conditionnal result for one columns
     *
     * @param {Object} item - item to test
     * @param {function|any[]} - array of value to match or a closure for custom condition
     *
     * @return {boolean}
     */
    let $resultForColumn = (item, condition) => {
      if (typeof condition === 'function') { // custom condition
        let closure = condition
        let result = closure(item)
        if (typeof result === 'boolean') {
          return result
        }

        return false // bad return type of closure
      }

      let column = []
      for (let value of condition) { // normal condition
        column.push(item === value)
      }

      return $or(column)
    }

    this.data.filtered = this.sources.filter((item) => {
      let result = []
      if ('$and' in filters) {
        let keys = Object.keys(filters.$and)
        let conditions = filters['$and']
        let resultAND = []

        for (let key of keys) {
          resultAND.push($resultForColumn(item[key], conditions[key]))
        }

        result.push($and(resultAND))
      }

      if ('$or' in filters) {
        let keys = Object.keys(filters.$or)
        let conditions = filters['$or']
        let resultOR = []

        for (let key of keys) {
          resultOR.push($resultForColumn(item[key], conditions[key]))
        }

        result.push($or(resultOR))
      }

      return $and(result)
    })

    this.options.reloading.filtered = false
    return this.data.filtered
  }

  /**
   * Data sources sorted
   * Getter
   *
   * @return {Object[]}
   */
  get sorted() {
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

    let tmpArray = sources.map((e, i) => { // create temporary array that is easier to sort
      let el = e[column]

      if (typeof e[column] === 'string') {
        el = e[column].toLowerCase()
      }

      if (typeof e[column] === 'undefined') {
        el = ''
      }

      console.log(el)
      return {
        index: i,
        value: el
      }
    })

    tmpArray.sort((a, b) => {
      if (a.value > b.value) {
        return order === 'asc' ? 1 : -1
      }

      if (a.value < b.value) {
        return order === 'asc' ? -1 : 1
      }

      return 0
    })

    this.data.sorted = tmpArray.map((e) => { // rebuild sources in data.sorted
      return sources[e.index]
    })

    this.options.reloading.sorted = false
    return this.data.sorted
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
      this.options.reloading.paginated === false
    ) {
      return this.data.paginated
    }

    const sources = this.sorted
    const maxLength = this.options.pagination.maxLength

    if (sources.length <= 0) { // no sources
      this.data.paginated = []

      this.options.reloading.paginated = false
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
    this.options.reloading.paginated = false
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
   * Setting pagination
   * Setter
   *
   * @param {number} maxLength - number max of elements per page
   */
  set pagination({ maxLength = -1 }) {
    this.options.reloading.paginated = true
    this.options.pagination.maxLength = maxLength
  }

  /**
   * Setting pagination
   * Getter
   *
   * @return {Object} current pagination settings
   */
  get pagination() {
    return {
      currentPage: this.options.pagination.currentPage,
      maxLength: this.options.pagination.maxLength
    }
  }

  /**
   * @param {string}    id                             - identifiant of <table/> tag targeted
   * @param {Object}    [options]                      - options of Nativetable
   * @param {Object[]}  [options.sources]              - array of source values
   * @param {Object}    [options.filters]              - filters to applies
   * @param {string[]}  [options.columns]              - column's nouns
   * @param {Object}    [options.pagination]           - options for pagination
   * @param {Object}    [options.pagination.maxLength] - number max of elements per page
   * @param {boolean}   [options.sorting]              - a flag that activates sorting
   *
   * @throws {TypeError} when the id parameter is invalid
   *
   * @return {Nativetable} - an instance of Nativetable
   */
  constructor(id, { sources = [], filters = {}, columns = [], pagination: { maxLength = -1 } = {}, sorting = false } = {}) {
    this.options = {}
    this.data = {}

    if (typeof id !== 'string' || document.getElementById(id) == null) {
      throw new TypeError('First parameter of Nativetable need to be a valid tag ID.')
    }

    this.options.id = id
    this.options.box = document.getElementById(id)
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

    this.draw()
  }

  /**
   * Reload data before drawing table
   *
   * @param {Object[]} [rows] - objects to reload
   */
  reload(rows = []) {
    this.options.pagination.currentPage = 0
    this.sources = rows.length > 0 ? rows : this.sources

    this.options.reloading.filtered = true
    this.options.reloading.paginated = true

    this.draw()
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
      this.options.box.children[0] &&
      this.options.box.children[0].classList.contains('nt-table')
    ) {
      tableTag = this.options.box.children[0]
      theadTag = tableTag.children[0]
      tbodyTag = tableTag.children[1]
      tableTag.removeChild(tbodyTag)

      if (this.options.reloading.headers) {
        tableTag.removeChild(theadTag)
        theadTag = this.buildTableHeader(this.columns)
        tableTag.appendChild(theadTag)
      }

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

  /**
   * Builder for table header
   *
   * @param {string[]} cols - Array of columns
   *
   * @return {HTMLElement} A thead HTML tag
   */
  buildTableHeader(cols) {
    const columns = cols

    let theadTag = document.createElement('thead')
    let trTag = document.createElement('tr')

    theadTag.classList.add('nt-head')

    for (let name of columns) {
      let tdTag = document.createElement('td')
      tdTag.textContent = name

      if (this.options.sorting.activated) {
        const glyphList = {
          asc: '<span class="nt-icon nt-icon-sort-asc"></span>',
          desc: '<span class="nt-icon nt-icon-sort-desc"></span>',
          none: '<span class="nt-icon nt-icon-sort-none"></span>'
        }
        let order = this.options.sorting.column === name ? this.options.sorting.order : 'none'
        let glyph = glyphList[order]
        let aTag = document.createElement('a')

        aTag.href = '#'
        aTag.addEventListener('click', this.onSortingClick.bind(this))
        aTag.innerHTML = `${name} ${glyph}`

        tdTag.dataset.ntColumnName = name
        tdTag.textContent = ''

        tdTag.appendChild(aTag)
      }

      trTag.appendChild(tdTag)
    }

    theadTag.appendChild(trTag)
    return theadTag
  }

  /**
   * Builder for table body
   *
   * @param {Object[]} rows - All rows to display
   * @param {string[]} cols - Array of columns
   *
   * @return {HTMLElement} A tbody HTML tag with all rows inside
   */
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

  /**
   * Builder for pagination ul
   *
   * @param {array[]} pages - Paginated rows
   * @param {number} [current] - Number of current page
   *
   * @return {HTMLElement} A ul HTML tag for pagination
   */
  buildPagination(pages, current = 0) {
    const sources = pages

    let ulTag = document.createElement('ul')
    for (let index in sources) {
      let liTag = document.createElement('li')
      let aTag = document.createElement('a')

      aTag.href = '#'
      aTag.textContent = index
      aTag.addEventListener('click', this.onPaginationClick.bind(this))

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
   * Event handler. Called when user click on pagination links
   *
   * @param {Event} event - the event
   */
  onPaginationClick(event) {
    event.preventDefault()

    let item = event.target.parentNode
    this.options.pagination.currentPage = parseInt(item.dataset.ntPaginationIndex)

    this.draw()
  }

  /**
   * Event handler.
   * Called when user click on header to sort corresponding column
   *
   * @param {Event} event - the event
   */
  onSortingClick(event) {
    event.preventDefault()

    let item = event.target.parentNode

    if (this.options.sorting.column !== item.dataset.ntColumnName) {
      this.options.sorting.column = item.dataset.ntColumnName
      this.options.sorting.order = 'none'
    }
    this.options.sorting.order = this.options.sorting.order === 'asc' ? 'desc' : 'asc'

    this.options.reloading.sorted = true
    this.options.reloading.headers = true
    this.draw()
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
