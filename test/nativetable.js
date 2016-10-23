/* eslint-env node, mocha */

import chai from 'chai'
import spies from 'chai-spies'
import Nativetable from '../src/scripts/nativetable/nativetable'

describe('Nativetable', () => {
  let nt

  chai.use(spies)
  chai.should()

  before(() => {
    global.document = {
      getElementById() {
        return {
          innerHTML: ''
        }
      }
    }
    global.btoa = () => '2U3I3O3I3'

    nt = new Nativetable('id')
  })

  beforeEach(() => {
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
  })

  describe('#source', () => {
    it('should not modify values', () => {
      nt.sources[0].id.should.equal(12)
      nt.sources[1].name.should.equal('sarah')
      nt.sources[0].age.should.equal(81)
      nt.sources[1].man.should.equal(false)
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
})
