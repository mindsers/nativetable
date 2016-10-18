/* eslint-env node, mocha */

import chai from 'chai'
import Nativetable from '../src/scripts/nativetable/nativetable'

describe('Nativetable', () => {
  let table

  before(() => {
    chai.should()
    global.document = {
      getElementById() {
        return {}
      }
    }

    table = new Nativetable('id')
  })

  beforeEach(() => {
    table.source = [
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

  describe('#source', () => {
    it('should not change values', () => {
      table.source[0].id.should.equal(12)
      table.source[1].name.should.equal('sarah')
      table.source[0].age.should.equal(81)
      table.source[1].man.should.equal(false)
    })
  })

  describe('#columns', () => {
    it('should have datasource keys as columns name by default', () => {
      table.columns.should.to.eql(['id', 'name', 'lastname', 'age', 'man', 'brother'])
    })

    it('should have given array elements as columns name', () => {
      table.columns = ['lastname', 'age']
      table.columns.should.to.eql(['lastname', 'age'])
    })

    it('should have given array elements as columns name only when element is a string', () => {
      table.columns = ['lastname', ['name'], 'age', 2, 'brother']
      table.columns.should.to.eql(['lastname', 'age', 'brother'])
    })
  })
})
