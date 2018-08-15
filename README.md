# Nativetable

[![build status][badge_build_status_image]][badge_build_status_link]
[![standardjs style][badge_js_code_style_image]][badge_js_code_style_link]
[![coverage status][badge_coverage_report_image]][badge_coverage_report_link]
[![MIT license][badge_license_image]][badge_license_link]
[![Patreon](https://img.shields.io/badge/support-patreon-F96854.svg?logo=patreon&style=flat-square)](https://www.patreon.com/bePatron?u=9715649)
[![Discord](https://img.shields.io/badge/chat-discord-7289DA.svg?logo=discord&logoColor=7289DA&style=flat-square)](https://discord.gg/sypJDdc)

Nativetable is a simple native es6 module to create and work with dynamics HTML tables.

Nativetable allow you to sort, filter and paginate your data in an HTML table. No useless features, only one line of code is required to load your data.

Check the [demo](https://mindsers.github.io/nativetable/) page.

## Installation

### Package manager installation

Nativetable is available as a client side npm dependency. To install Nativetable with npm or yarn:

```sh
npm install nativetable --save
yarn add nativetable
```

Nativetable library is ready. Build file is available at this path: `./node_modules/nativetable/dist/nativetable.min.js`

### Manual installation
You can build your own Nativetable with this project.

Clone the project :
```bash
git clone https://git.nathanaelcherrier.com/mindsers/nativetable.git
cd nativetable
```

Install packages and build sources :
```bash
npm install
npm run build
```

Nativetable library is ready to be import on your project: `./dist/nativetable.min.js`

## Usage

- If your are using tools for importing / bundling dependencies (umd format) for you, you can import Nativetable this way:

```js
const Nativetable = require('nativetable').Nativetable // classic

const { Nativetable } = require('nativetable') // es6 destructuring

import { Nativetable } from 'nativetable' // es6 import

// ...

const nt = new Nativetable('tableid')
```

- If you decide to import Nativetable with simple `<script/>` tag, all Nativetable classes is available in `nativetable` umd module.

Add a script tag on your page to call Nativatable.
```html
<script src="nativetable.min.js"></script>
```

And in `*.js|ts` file:
```js
const Nativetable = nativetable.Nativetable // get Nativetable class from nativetable module

// ...

const nt = new Nativetable('tableid')
```

### Sample code

```js
// Show all data in table.
let ntable = new Nativetable('tableid', { sources });
```

```js
// Show table with more options
let ntable = new Nativetable('tableid', {
    sources: data,
    sorting: true,
    pagination: {
        maxLength: 5
    },
    columns: [
        "id",
        "name",
        "age"
    ],
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
});
```

## Contribution

To contribute to this repo please follow the [contribution guide](https://github.com/Mindsers/nativetable/blob/master/CONTRIBUTING.md).

## Support

*Nativetable* is licensed under an MIT license, which means that it's a completely free open source software. Unfortunately, *Nativetable* doesn't make it itself. Which will result in many late, beer-filled nights of development for me.

If you're using *Nativetable* and want to support the development, you now have the chance! Go on my [Patreon page](https://www.patreon.com/mindsers) and become my joyful patron!!

[![Become a Patron!](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/bePatron?u=9715649)

For help on how to support *Nativetable*, please refer to [The awesome people who support *Nativetable*](https://github.com/Mindsers/nativetable/blob/develop/SPONSORS.md).

<!-- ### Premium sponsors -->

## License

This project is under the MIT License. (see LICENSE file in the root directory)

> The MIT License (MIT)
>
> Copyright (c) 2016 Nathanaël CHERRIER
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

[wiki]: https://git.nathanaelcherrier.com/mindsers/nativetable/wikis/home
[project]: https://git.nathanaelcherrier.com/mindsers/nativetable

[badge_build_status_image]: https://img.shields.io/travis/Mindsers/nativetable/master.svg&style=flat-square
[badge_build_status_link]: https://travis-ci.org/Mindsers/nativetable
[badge_js_code_style_image]: https://img.shields.io/badge/code%20style-standard-yellow.svg&style=flat-square
[badge_js_code_style_link]: http://standardjs.com
[badge_license_image]: https://img.shields.io/badge/license-MIT-blue.svg&style=flat-square
[badge_license_link]: https://github.com/Mindsers/nativetable/blob/master/LICENSE
[badge_coverage_report_image]: https://img.shields.io/coveralls/Mindsers/nativetable/master.svg&style=flat-square
[badge_coverage_report_link]: https://coveralls.io/github/Mindsers/nativetable
