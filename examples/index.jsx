/**
 * Example
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { List, OrderedMap } from 'immutable';

import Table from '../src/Table';

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
        <h1>{'Examples Page'}</h1>
        <div>
          <h2>Sort by Name or Date. Select multiple rows.</h2>
          <Table
            data={sample_data}
            columns={columnSettings}
            onSelect={this.handleSelect}
          />
          {!!this.state.selection.size &&
            <div>
              <h3>Selection:</h3>
                {this.state.selection.toList().toJS().map(obj => {
                return (
                  <pre>
                    {JSON.stringify(obj,null,2)}
                  </pre>
                );
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Examples />, document.getElementById('examples'));
