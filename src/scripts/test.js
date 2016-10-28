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
    id: 20,
    name: 'sarah',
    age: 29,
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
    id: 6,
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
  let nt = new Nativetable('test', {
    sources: data,
    pagination: {
      maxLength: 5
    }
  })

  console.log(nt)
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
