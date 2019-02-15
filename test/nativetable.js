/* eslint-env node, mocha */

import chai from 'chai'
import spies from 'chai-spies'
import { Nativetable } from '../src/nativetable/nativetable'

describe('Nativetable', () => {
  let nt

  chai.use(spies)
  chai.should()

  before(() => {
    global.btoa = () => '2U3I3O3I3'
  })

  beforeEach(() => {
    global.document = {
      htmlElement: {
        innerHTML: '',
        children: [],
        dataset: {},
        classList: {
          add() {}
        },
        appendChild() {},
        insertBefore() {}
      },
      getElementById() {
        return this.htmlElement
      },
      createElement() {
        return this.htmlElement
      }
    }

    nt = new Nativetable('id')
    nt.sources = [
      {
        id: 12,
        name: 'bob',
        lastname: 'rob',
        age: 81,
        man: true
      },
      {
        id: 20,
        name: 'sarah',
        age: 29,
        man: false,
        brother: 3
      }
    ]
  })

  describe('#constructor', () => {
    before(() => {
      chai.spy.on(Nativetable.prototype, 'draw')
    })

    it('should call draw method on init', () => {
      nt = new Nativetable('id')
      nt.draw.should.have.been.called()
    })

    it('should init source with empty array when no options is passed', () => {
      nt = new Nativetable('id')
      nt.sources.should.be.an.instanceof(Array)
      nt.sources.should.be.empty
    })

    it('should init columns with array of keys string when no options is passed', () => {
      nt.sources.should.be.an.instanceof(Array)
      nt.sources.should.not.be.empty
    })

    it('should throw a TypeError if incorrect parameter is passed', () => {
      let test = () => {
        new Nativetable(2) // eslint-disable-line no-new
      }

      test.should.throw(TypeError)
    })

    it('should throw a TypeError if null is returned by getElementById for the given id', () => {
      global.document.getElementById = () => { return null }
      let test = () => {
        new Nativetable('yolo') // eslint-disable-line no-new
      }

      test.should.throw(TypeError)
    })
  })

  describe('#filters', () => {
    it('should return same object as given', () => {
      nt.filters = { $and: {} }
      nt.filters.should.to.eql({ $and: {} })
    })
  })

  describe('#filtered', () => {
    it('should be equal to sources', () => {
      nt.filtered[0].id.should.equal(nt.sources[0].id)
      nt.filtered[1].name.should.equal(nt.sources[1].name)
      nt.filtered[0].age.should.equal(nt.sources[0].age)
      nt.filtered[1].man.should.equal(nt.sources[1].man)
    })

    it('should return data which match $and close', () => {
      nt.filters = { $and: { name: ['bob'] } }
      for (let row of nt.filtered) {
        row.name.should.equal('bob')
      }
    })

    it('should return data which match $or close', () => {
      nt.filters = { $or: { name: ['bob'], age: [29] } }
      nt.filtered.length.should.equal(2)
    })

    it('should return data which match custom condition', () => {
      nt.filters = { $and: { age: (age) => {
        return age >= 26 && age <= 32
      } } }
      nt.filtered.length.should.equal(1)
    })

    it('should ignore closure when closure not return boolean', () => {
      let test = () => {
        nt.filters = {
          $and: {
            age: (age) => {
              return 'age >= 26 && age <= 32'
            }
          }
        }

        nt.filtered
      }

      test.should.not.throw()
    })

    it('should return cached data when it is called miltiple time', () => {
      nt.filtered
      chai.spy.on(nt.sources, 'filter')
      nt.filtered

      nt.sources.filter.should.not.have.be.called()
    })
  })

  describe('#pagination', () => {
    it('should set maxLength', () => {
      nt.pagination = { maxLength: 3 }
      nt.options.pagination.maxLength.should.be.equal(3)
    })

    it('should set maxLength to -1 not specified', () => {
      nt.pagination = { }
      nt.options.pagination.maxLength.should.be.equal(-1)
    })

    it('should force reload pagination cache', () => {
      nt.pagination = { }
      nt.options.reloading.paginated.should.be.equal(true)
    })

    it('should have property currentPage', () => {
      nt.pagination.should.have.property('currentPage')
    })
  })

  describe('#paginated', () => {
    beforeEach(() => {
      nt.options.pagination.maxLength = 10
      nt.sources = [
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'bosb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rokb', age: 81, man: true },
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rfob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true }
      ]
    })

    it('should return filtered if maxLength is equal to -1', () => {
      nt.options.pagination.maxLength = -1
      nt.paginated[0].should.to.eql(nt.filtered)
    })

    it('should return 10 elements if maxLength is equal to 10', () => {
      nt.paginated[0].length.should.equal(10)
    })

    it('should return only 2 elements if maxLength is equal to 10 and source length is equal 2', () => {
      nt.sources = [
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true }
      ]
      nt.paginated[0].length.should.equal(2)
    })

    it('should return empty array if data no exist for given page', () => {
      nt.sources = []
      nt.paginated.should.to.eql([])
    })

    it('should return elements 10 to 19 if page is equal to 1', () => {
      let rows = nt.paginated[1]

      for (let index in rows) {
        rows[index].should.to.eql(nt.filtered[parseInt(index) + 10])
      }
    })
  })

  describe('#onPaginationClick', () => {
    let event

    beforeEach(() => {
      event = {
        preventDefault() {},
        target: {
          parentNode: {
            dataset: {
              ntPaginationIndex: 3
            }
          }
        }
      }
    })

    it('should call draw', () => {
      chai.spy.on(nt, 'draw')
      nt.onPaginationClick(event)

      nt.draw.should.have.be.called()
    })

    it('should change currentPage value', () => {
      nt.options.pagination.currentPage = 0
      nt.onPaginationClick(event)

      nt.options.pagination.currentPage.should.equal(3)
    })
  })

  describe('#sorted', () => {
    beforeEach(() => {
      nt.options.reloading.sorted = true
      nt.options.sorting = {
        activated: true,
        column: 'name',
        order: 'asc'
      }
      nt.sources = [
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bofgb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'botb', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'bosb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boxb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bokb', lastname: 'rokb', age: 81, man: true },
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bpob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boub', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodjb', lastname: 'rfob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true }
      ]
    })

    it('should return filtered when filtered is empty', () => {
      nt.sources = []
      nt.sorted.should.be.deep.equal(nt.filtered)
    })

    it('should return filtered when sorted is desallowed', () => {
      nt.options.sorting.activated = false
      nt.sorted.should.be.deep.equal(nt.filtered)
    })

    it('should return filtered when no columns are sorted', () => {
      delete nt.options.sorting.column
      nt.sorted.should.be.deep.equal(nt.filtered)
    })

    it('should return last sorting when options.reloading.sorted is false', () => {
      let expected = [
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodjb', lastname: 'rfob', age: 81, man: true },
        { id: 12, name: 'bofgb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bokb', lastname: 'rokb', age: 81, man: true },
        { id: 12, name: 'bosb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'botb', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'boub', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true },
        { id: 12, name: 'boxb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bpob', lastname: 'rob', age: 81, man: true }
      ]

      let falseFiltered = [
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'botb', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'boub', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true },
        { id: 12, name: 'boxb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bpob', lastname: 'rob', age: 81, man: true }
      ]

      nt.sorted // first call / adding relsult to cache
      nt.sources = falseFiltered
      nt.options.reloading.sorted = false
      nt.sorted.should.be.deep.equal(expected)
    })

    it('should return ASC sorted sources', () => {
      let expected = [
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodjb', lastname: 'rfob', age: 81, man: true },
        { id: 12, name: 'bofgb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bokb', lastname: 'rokb', age: 81, man: true },
        { id: 12, name: 'bosb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'botb', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'boub', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true },
        { id: 12, name: 'boxb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bpob', lastname: 'rob', age: 81, man: true }
      ]
      nt.sorted.should.be.deep.equal(expected)
    })

    it('should return DESC sorted sources', () => {
      let expected = [
        { id: 12, name: 'bpob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'boxb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bovb', lastname: 'rorb', age: 81, man: true },
        { id: 12, name: 'boub', lastname: 'rbob', age: 81, man: true },
        { id: 12, name: 'botb', lastname: 'riob', age: 81, man: true },
        { id: 12, name: 'bosb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bokb', lastname: 'rokb', age: 81, man: true },
        { id: 12, name: 'bofgb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bodjb', lastname: 'rfob', age: 81, man: true },
        { id: 12, name: 'bodb', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bobg', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'ronb', age: 81, man: true },
        { id: 12, name: 'boab', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bjob', lastname: 'rob', age: 81, man: true }
      ]
      nt.options.sorting.order = 'desc'
      nt.sorted.should.be.deep.equal(expected)
    })
  })

  describe('#onSortingClick', () => {
    let event

    beforeEach(() => {
      event = {
        preventDefault() {},
        target: {
          parentNode: {
            dataset: {
              ntColumnName: 'yolo'
            }
          }
        }
      }
    })

    it('should call draw', () => {
      chai.spy.on(nt, 'draw')
      nt.onSortingClick(event)

      nt.draw.should.have.be.called()
    })

    it('should toggle order', () => {
      nt.onSortingClick(event)
      let lastOrder = nt.options.sorting.order
      nt.onSortingClick(event)

      if (lastOrder === 'asc') {
        nt.options.sorting.order.should.equal('desc')
      } else {
        nt.options.sorting.order.should.equal('asc')
      }
    })
  })

  describe('#columns', () => {
    let expected = [
      { key: 'id', title: 'id' },
      { key: 'name', title: 'name' },
      { key: 'lastname', title: 'lastname' },
      { key: 'age', title: 'age' },
      { key: 'man', title: 'man' },
      { key: 'brother', title: 'brother' }
    ]

    it('should have datasource keys as columns name', () => {
      nt.columns.should.to.eql(expected)
    })

    it('should have datasource keys as columns name by default', () => {
      nt.options.columns = null
      nt.columns.should.to.eql(expected)
    })

    it('should have datasource keys as columns name when user would force empty array', () => {
      nt.columns = []
      nt.columns.should.to.eql(expected)
    })

    it('should replace _column by an empty array if user try to set columns as null', () => {
      nt.columns = null
      nt.columns = undefined
      nt.options.columns.should.to.eql([])
    })

    it('should have the given array elements as columns name', () => {
      nt.columns = ['lastname', 'age']
      nt.columns.should.to.eql([{ key: 'lastname', title: 'lastname' }, { key: 'age', title: 'age' }])
    })

    it('should have the given array object elements as columns name', () => {
      nt.columns = ['lastname', { key: 'name', title: 'Le nom' }]
      nt.columns.should.to.eql([{ key: 'lastname', title: 'lastname' }, { key: 'name', title: 'Le nom' }])
    })

    it('should have the given array elements as columns name only when element is a string', () => {
      nt.columns = ['lastname', ['name'], 'age', 2, 'brother']
      nt.columns.should.to.eql([{ key: 'lastname', title: 'lastname' }, { key: 'age', title: 'age' }, { key: 'brother', title: 'brother' }])
    })
  })

  describe('#reload', () => {
    it('should call draw', () => {
      chai.spy.on(nt, 'draw')
      nt.reload()

      nt.draw.should.have.be.called()
    })

    it('should reinit currentPage', () => {
      nt.reload()
      nt.options.pagination.currentPage.should.to.equal(0)
    })

    it('should reinit currentPage', () => {
      nt.reload([
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true }
      ])

      nt.sources.should.to.eql([
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true },
        { id: 12, name: 'bob', lastname: 'rob', age: 81, man: true }
      ])
    })
  })

  describe('#objectSignature', () => {
    it('should return an encoded ocject as string', () => {
      nt.objectSignature({}).should.be.a('string')
    })
  })
})
