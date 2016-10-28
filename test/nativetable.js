/* eslint-env node, mocha */

import chai from 'chai'
import spies from 'chai-spies'
import Nativetable from '../src/scripts/nativetable/nativetable'

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

  describe('#filtered', () => {
    it('should be equal to sources', () => {
      nt.filtered[0].id.should.equal(nt.sources[0].id)
      nt.filtered[1].name.should.equal(nt.sources[1].name)
      nt.filtered[0].age.should.equal(nt.sources[0].age)
      nt.filtered[1].man.should.equal(nt.sources[1].man)
    })
  })

  describe('#columns', () => {
    it('should have datasource keys as columns name', () => {
      nt.columns.should.to.eql(['id', 'name', 'lastname', 'age', 'man', 'brother'])
    })

    it('should have datasource keys as columns name by default', () => {
      nt.options.columns = null
      nt.columns.should.to.eql(['id', 'name', 'lastname', 'age', 'man', 'brother'])
    })

    it('should have datasource keys as columns name when user would force empty array', () => {
      nt.columns = []
      nt.columns.should.to.eql(['id', 'name', 'lastname', 'age', 'man', 'brother'])
    })

    it('should replace _column by an empty array if user try to set columns as null', () => {
      nt.columns = null
      nt.columns = undefined
      nt.options.columns.should.to.eql([])
    })

    it('should have the given array elements as columns name', () => {
      nt.columns = ['lastname', 'age']
      nt.columns.should.to.eql(['lastname', 'age'])
    })

    it('should have the given array elements as columns name only when element is a string', () => {
      nt.columns = ['lastname', ['name'], 'age', 2, 'brother']
      nt.columns.should.to.eql(['lastname', 'age', 'brother'])
    })
  })

  describe('#objectSignature', () => {
    it('should return an encoded ocject as string', () => {
      nt.objectSignature({}).should.be.a('string')
    })
  })

  describe('#draw', () => {
    it('should generate string in table tag', () => {
      nt.draw()
      nt.options.box.innerHTML.should.be.a('string')
    })

    it('should generate string with all columns name in tablebox', () => {
      nt.columns = []
      nt.draw()
      nt.options.box.innerHTML.should.contain('name')
      nt.options.box.innerHTML.should.contain('man')
      nt.options.box.innerHTML.should.contain('id')
      nt.options.box.innerHTML.should.contain('brother')
      nt.options.box.innerHTML.should.contain('age')
    })

    it('should generate string with only indicated columns name in tablebox', () => {
      nt.columns = ['name', 'brother']
      nt.draw()
      nt.options.box.innerHTML.should.contain('name')
      nt.options.box.innerHTML.should.not.contain('man')
      nt.options.box.innerHTML.should.not.contain('id')
      nt.options.box.innerHTML.should.contain('brother')
      nt.options.box.innerHTML.should.not.contain('age')
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

  describe('#paginated', () => {
    beforeEach(() => {
      nt.options.pagination.maxLength = 10
      nt.data.reloading = true
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
})
