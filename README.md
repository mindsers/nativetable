# Nativetable

[![Join the chat at https://gitter.im/mindsers/nativetable](https://badges.gitter.im/mindsers/nativetable.svg)](https://gitter.im/mindsers/nativetable?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![build status][badge_build_status_image]][badge_build_status_link]
[![standardjs style][badge_js_code_style_image]][badge_js_code_style_link]
[![coverage status][badge_coverage_report_image]][badge_coverage_report_link]
[![MIT license][badge_license_image]][badge_license_link]
[![Join the chat at https://gitter.im/nativetable/Lobby][badge_gitter_image]][badge_gitter_link]

Nativetable is a simple native es6 module to create and work with dynamics HTML tables.

Nativetable allow you to sort, filter and paginate your data in an HTML table. No useless features, only one line of code is required to load your data.

Check the [demo](https://mindsers.github.io/nativetable/) page.

## Installation

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

Nativetable library is ready to be import on your project : `src/scripts/build/nativetable.min.js`

## Usage

Add a script tag on your page to call Nativatable.
```html
<script src="nativetable.min.js"></script>
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

[badge_build_status_image]: https://img.shields.io/travis/Mindsers/nativetable/master.svg
[badge_build_status_link]: https://travis-ci.org/Mindsers/nativetable
[badge_js_code_style_image]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[badge_js_code_style_link]: http://standardjs.com
[badge_license_image]: https://img.shields.io/badge/license-MIT-blue.svg
[badge_license_link]: https://github.com/Mindsers/nativetable/blob/master/LICENSE
[badge_coverage_report_image]: https://img.shields.io/coveralls/Mindsers/nativetable/master.svg
[badge_coverage_report_link]: https://coveralls.io/github/Mindsers/nativetable
[badge_gitter_image]: https://badges.gitter.im/nativetable/Lobby.svg
[badge_gitter_link]: https://gitter.im/nativetable/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
