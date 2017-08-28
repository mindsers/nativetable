/// <reference path="../../nativetable/nativetable.d.ts"/>

/* global Nativetable */

'use strict'

let data = [
  {
    id: 12,
    name: 'bob',
    age: 81,
    man: true
  },
  {
    id: 43,
    name: 'sarah',
    age: 12,
    man: false
  },
  {
    id: 4,
    name: 'robert',
    age: 57,
    man: true,
    sisters: 3
  },
  {
    id: 8,
    name: 'julie',
    age: 30,
    man: false
  },
  {
    id: 6,
    name: 'julie',
    age: 36,
    man: false
  },
  {
    id: 20,
    name: 'sarah',
    age: 29,
    man: false,
    sisters: 1
  },
  {
    id: 18,
    name: 'john',
    age: 57,
    man: true,
    brothers: 1
  }
]

let main = () => {
  let ntPagination = new Nativetable('test-pagination', {
    sources: data,
    pagination: {
      maxLength: 5
    }
  })

  let ntFilter = new Nativetable('test-filtering', {
    sources: data,
    pagination: {
      maxLength: 5
    },
    filters: {
      $and: {
        name: ['julie', 'sarah'],
        age: (age) => {
          return age >= 29 && age <= 39
        }
      },
      $or: {
        man: [false],
        brothers: [1]
      }
    }
  })

  let ntSorting = new Nativetable('test-sorting', {
    sources: data,
    sorting: true
  })

  document.nt = [ntPagination, ntFilter, ntSorting]

  console.log(document.nt)
}

if (document.readyState === `interactive` || document.readyState === `complete`) {
  main()
} else {
  let onDOMContentLoaded = () => {
    main()
    document.removeEventListener('DOMContentLoaded', onDOMContentLoaded)
  }

  document.addEventListener('DOMContentLoaded', onDOMContentLoaded)
}
