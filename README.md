# ship-components-select
[React](http://facebook.github.io/react/) table that is sortable and multi-selectable. Exports a commonjs module that can be used with [webpack](http://webpack.github.io/). Source is in ES6 and is compiled down to ES5 using [Babel](https://babeljs.io/).

[![npm](https://img.shields.io/npm/v/ship-components-table.svg)](https://www.npmjs.com/package/ship-components-table)
[![Build Status](http://img.shields.io/travis/ship-components/ship-components-table/master.svg?style=flat)](https://travis-ci.org/ship-components/ship-components-table)
[![Coverage](http://img.shields.io/coveralls/ship-components/ship-components-table.svg?style=flat)](https://coveralls.io/github/ship-components/ship-components-table)
[![dependencies](https://img.shields.io/david/ship-components/ship-components-table.svg?style=flat)](https://david-dm.org/ship-components/ship-components-table)
[![devDependencies](https://img.shields.io/david/dev/ship-components/ship-components-table.svg?style=flat)](https://david-dm.org/ship-components/ship-components-table?type=dev)

## Usage

### ES6/JSX (Recommended)
The component is written using ES6/JSX therefore Babel is recommended to use it. The below example is based on using [webpack](http://webpack.github.io/) and [babel-loader](https://github.com/babel/babel-loader).
```js
/**
 * Example
 */
import React from 'react';
import { List, OrderedMap } from 'immutable';
import Table from 'ship-components-table';

const columnSettings = new OrderedMap({
  name: {
    label: 'Name',
    sort: 'string'
  },
  description: {
    label: 'Description'
  },
  created: {
    label: 'Created',
    sort: 'date'
  }
});

const sample_data = new List([
  {
    key: 1,
    name: 'Item 1',
    description: "This is the first item.",
    created: '12-01-1970'
  },
  {
    key: 2,
    name: 'Item 2',
    description: "This is the second item",
    created: '02-20-1997'
  },
  {
    key: 3,
    name: 'Item 3',
    description: "This is the third item",
    created: '01-01-2018'
  },
  {
    key: 4,
    name: 'Item 4',
    description: "This is the fourth item",
    created: '01-16-1989'
  },{
    key: 5,
    name: 'Item 5',
    description: "This is the fifth item",
    created: '01-01-1984'
  },
  {
    key: 6,
    name: 'Item 6',
    description: "This is the sixth item",
    created: '03-14-1985'
  }
]);

export default class Examples extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: new List()
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  /**
   * Handle the Select event to make use of the selected rows.
   * @param {List} selection    the rows selected as a result of the event.
   * @param {Event} clickEvent  the click event of the row clicked during the selection.
   */
  handleSelect(selection, clickEvent) {
    this.setState({
      selection: selection
    })
  }

  render() {
    return (
      <div>
        <Table
          data={sample_data}
          columns={columnSettings}
          onSelect={this.handleSelect}
        />        
      </div>
    );
  }
}
```

## Examples and Development
Examples can be found in the `examples/` folder. A development server can be run with:

```shell
$ npm install
$ npm start
```

which will live reload any changes you make and serve them at http://localhost:8080.

### Webpack Configuration
This module is designed to be used with webpack but requires a few loaders if you are pulling the source into another project.

```shell
$ npm install --save-dev\
  webpack\
  babel-loader\
  css-loader\
  style-loader\
  extract-text-webpack-plugin\
  postcss-loader\
  postcss-nested\
  postcss-simple-vars\
  postcss-color-hex-alpha\
  postcss-color-function\
  postcss-calc\
  autoprefixer
```

Below are is a sample of how to setup the loaders:

```js
/**
 * Relevant Webpack Configuration
 */
{
  [...]
  module: {
    loaders: [
      // Setup support for ES6
      {
        test: /\.(jsx?|es6)$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      // Setup support for CSS Modules
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      }
    ]
  },
  plugins: [
    // Extract the css and put it in one file. Path is relative to output path
    new ExtractTextPlugin('../css/[name].css', { allChunks: true })
  ],
  // CSS Modules
  postcss: [
    require('postcss-nested'),
    require('postcss-simple-vars'),
    require('postcss-color-hex-alpha'),
    require('postcss-color-function'),
    require('postcss-calc'),
    require('autoprefixer')
  ],
  [...]
}
```

## Tests
1. `npm install`
2. `npm test`

## History
* 0.1.0 - Initial

## License
The MIT License (MIT)

Copyright (c) 2015 Isaac Suttell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
