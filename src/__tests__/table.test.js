// README FIRST:
// 1. Uncomment the codes below to use it as an example
// 2. You can change "Index" on line 10 to anything you wish to be called
// 3. Please note that a lot of the tests below are just for reference - may or maynot be relevent to your react app. Feel free to remove them.
// 4. Examples below are using Jest with enzyme but feel free to use anything you wish.

import React from 'react';
import {List, OrderedMap} from 'immutable';
import { shallow, mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Table from '../Table';

const COLUMN_SETTINGS = new OrderedMap({
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

const SAMPLE_DATA = new List([
  {
    key: 1,
    name: 'Item 1',
    description: 'This is the first item.',
    created: '12-01-1970'
  },
  {
    key: 2,
    name: 'Item 2',
    description: 'This is the second item',
    created: '02-20-1997'
  },
  {
    key: 3,
    name: 'Item 3',
    description: 'This is the third item',
    created: '01-01-2018'
  },
  {
    key: 4,
    name: 'Item 4',
    description: 'This is the fourth item',
    created: '01-16-1989'
  },
  {
    key: 5,
    name: 'Item 5',
    description: 'This is the fifth item',
    created: '01-01-1984'
  },
  {
    key: 6,
    name: 'Item 6',
    description: 'This is the sixth item',
    created: '03-14-1985'
  }
]);

// Creates a shallow copy
function shallowTable(props) {
  return shallow(
    <Table
      {...props}
      data={SAMPLE_DATA}
      columns={COLUMN_SETTINGS}
    />
  );
}

// Creates a mounted copy
function mountTable(props) {
  return mount(
    <Table
      {...props}
      data={SAMPLE_DATA}
      columns={COLUMN_SETTINGS}
    />
  );
}

describe('ship-components-table', () => {
  describe('Table rendering', () => {
    it('renders correctly', () => {
      const tree = shallowTable();
      expect(shallowToJson(tree)).toMatchSnapshot();
    });
  });

  describe('selecting rows', () => {
    it('calls parent\'s select handler when rows are selected', () => {
      const handleSelect = jest.fn();
      const wrapper = mountTable({
        onSelect: handleSelect
      });

      const rowIndex = 0;
      const selectedRow = SAMPLE_DATA.get(rowIndex);
      const isSelected = false;
      const mockEvent = {};

      wrapper.node.handleRowClick(selectedRow, rowIndex, isSelected, mockEvent);
      expect(handleSelect.mock.calls.length).toBe(1);
    });

    it('can determine if a row is selected', () => {
      const wrapper = mountTable();
      const rowIndex = 0;
      const selectedRow = SAMPLE_DATA.get(rowIndex);
      const nonSelectedRow = SAMPLE_DATA.get(1);
      const isSelected = false;
      const mockEvent = {};

      wrapper.node.handleRowClick(selectedRow, rowIndex, isSelected, mockEvent);
      expect(wrapper.node.isSelected(selectedRow)).toBe(true);
      expect(wrapper.node.isSelected(nonSelectedRow)).toBe(false);
    });
  });

  describe('row order', () => {
    it('sorts data by defaultSort prop', () => {
      const wrapper = mountTable({
        defaultSort: {
          column: 'created',
          ascending: false
        }
      });

      const latestDate = SAMPLE_DATA.get(2);
      const earliestDate = SAMPLE_DATA.get(0);
      const data = wrapper.node.getSortedData();
      expect(data.first().key).toEqual(latestDate.key);
      expect(data.last().key).toEqual(earliestDate.key);
    });
  });
});
