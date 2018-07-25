import React from 'react';
import PropTypes from 'prop-types';
import { List, OrderedMap , Seq, is} from 'immutable';
import moment from 'moment';
import classNames from 'classnames';

import icons from 'ship-components-icon';
import OutsideClick from 'ship-components-outsideclick';

import TableRow from './TableRow';
import css from './Table.css';

function comparePrimitives(a, b) {
  return a > b ? 1 : -1;
}

function compareStrings(a, b, ignoreCase = true) {
  if (ignoreCase) {
    a = a.toLowerCase();
    b = b.toLowerCase();
  }
  return comparePrimitives(a,b);
}

const SortFunctions = {
  string: compareStrings,
  number: comparePrimitives,
  date: function compareDates(a, b) {
    return moment(a).isAfter(moment(b)) ? 1 : -1;
  }
};

export default class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selection: this.getSelection(props),
      sortBy: props.defaultSort
    };

    this.clear = this.clear.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.getSortedData = this.getSortedData.bind(this);
    this.getSelection = this.getSelection.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selection: this.getSelection(nextProps)
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !is(this.state.selection, nextState.selection) ||
      !Object.is(this.state.sortBy, nextState.sortBy) ||
      !is(this.props.data, nextProps.data) ||
      !is(this.props.columns, nextProps.columns) ||
      !is(this.props.value, nextProps.value) ||
      this.props.className !== nextProps.className;
  }

  getSelection(props = this.props) {
    if (!props.value) {
      return this.state && this.state.selection || new OrderedMap();
    }
    let selection = new OrderedMap();
    selection = selection.withMutations((sel) => {
      // map props.value keys to props.data objects
      props.value.forEach((key) => {
        const row = props.data.find(o => o.key === key);
        if (row) {
          sel = sel.set(key, row);
        }
      });
    });
    return selection;
  }

  /**
   * Mimic 'blur' behavior using OutsideClick
   * @param {Event} event
   */
  handleBlur(event) {
    if (typeof this.props.onBlur === 'function') {
      this.props.onBlur(event);
    }
  }

  clear(event) {
    // deselect all
    this.setState({
      selection: this.state.selection.clear()
    }, () => {
      this.props.onSelect(this.state.selection, event);
    });
  }

  /**
   * Toggle row selected with meta-key + click
   * @param {Object}  row
   * @param {Bool}    isSelected
   * @returns {OrderedMap}
   */
  handleMetaClick(row, isSelected) {
    if (isSelected) {
      // remove row
      return this.state.selection.delete(row.key);
    }

    // add row
    return this.state.selection.set(row.key, row);
  }

  /**
   * Select multiple rows
   * @param {Object}  row
   * @param {Bool}    isSelected
   * @returns {OrderedMap}
   *
   */
  handleShiftClick(row, rowIndex) {
    const last = this.state.selection.last();
    if (!last || last.key === row.key) {
      // no row is selected or user selected same row. just do a simple add.
      return this.state.selection.set(row.key, row);
    }

    // get the ordered data
    const sortedData = this.getSortedData();

    // Define index bounds of the user's selection:
    // start with the last row selected
    let start = sortedData.findIndex(o => o.key === last.key);
    // end with the row just clicked
    let end = rowIndex;
    // the "direction" user is selecting in
    let selectDirection = start > end ? 'up' : 'down';

    // get the rows between start and end
    let slice;
    if (selectDirection === 'up') {
      // order matters
      slice = sortedData.slice(end, start + 1).reverse();
    } else {
      slice = sortedData.slice(start, end + 1);
    }

    if (slice.size <= 1) {
      // selection cannot be only 1 item
      return this.state.selection;
    }

    // todo: Revisit. Deciding what to do right here gets tricky.
    // Basic behavior is easy, but if there are many nonconsecutive selections, this gets weird.
    // Part of the problem may be using OrderedMap to keep track of "last added row"
    let selection = this.state.selection;
    // if some row in the slice is not selected, then add the whole slice; otherwise, remove the whole slice.
    const functionName = slice.some(_row => !this.isSelected(_row)) ? 'set' : 'delete';
    slice.forEach((_row) => {
      selection = selection[functionName](_row.key, _row);
    });

    // make sure to include the row clicked
    return selection.set(row.key, row);
  }

  /**
   * Select/Deselect an item in the data set
   * @param  {Object} row           the object representing the row in the table
   * @param  {Number} rowIndex      the index of the row in the current order (varies with sorting)
   * @param  {Boolean} isSelected   row's current selection state
   * @param  {Event} event          the mouseclick event
   */
  handleRowClick(row, rowIndex, isSelected, event) {
    if (!this.props.selectable) {
      return;
    }

    let selection;

    if (event.shiftKey && event.metaKey) {
      // yucky key combo, do nothing
      return;
    } else if (event.shiftKey) {
      // shift + click
      selection = this.handleShiftClick(row, rowIndex);
    } else if (event.metaKey) {
      // cmd + click
      selection = this.handleMetaClick(row, isSelected);
    } else {
      // assume normal click behavior ... results in one item selected
      selection = this.state.selection.clear();
      selection = selection.set(row.key, row);
    }

    this.setState({
      selection
    }, () => {
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(this.state.selection, event);
      }
    });
  }

  /**
   * Callback function for clicking column header.
   * Set new sort params and deselect any current selection.
   * @param {String} columnKey  the key of the column clicked
   */
  handleSort(columnKey) {
    if (this.props.columns.get(columnKey) && !this.props.columns.get(columnKey).sort) {
      return;
    }

    // Set new column sort, or toggle same column sort order
    let sortBy = Object.assign({}, this.state.sortBy);
    if (sortBy && sortBy.column === columnKey) {
      // same column clicked, toggle order
      sortBy.ascending = !sortBy.ascending;
    } else {
      // new column clicked, default ascending order
      sortBy.ascending = true;
      sortBy.column = columnKey;
    }

    this.setState({
      sortBy: sortBy,
      selection: this.state.selection.clear()
    }, () => {
      if (typeof this.props.onSort === 'function') {
        this.props.onSort(this.state.sortBy);
      }
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(this.state.selection);
      }
    });
  }

  /**
   * Sort rows by column in sort state.
   * @returns {List}
   */
  getSortedData() {
    const columnKey = this.state.sortBy.column;
    if (!columnKey || !(this.props.columns.get(columnKey) && this.props.columns.get(columnKey).sort)) {
      // if there is no sort specified for the column corresponding to columnKey, return unsorted data.
      return this.extractData();
    }
    const columnSort = this.props.columns.get(columnKey).sort;
    const useCustomSort = typeof columnSort === 'function';
    const compare = useCustomSort ? columnSort : SortFunctions[columnSort];
    if (typeof compare !== 'function') {
      console.error('ship-components-table sorting requires a function.');
      return this.extractData();
    }
    let data = this.extractData().sort((a,b) => {
      if (!this.state.sortBy.ascending) {
        let tmp = a;
        a = b;
        b = tmp;
      }
      if (useCustomSort) {
        // for custom comparisons, pass the whole object to the programmer.
        return compare(a,b);
      }
      // for default comparison, pass in target column data.
      return compare(a[columnKey], b[columnKey]);
    });
    return data;
  }

  /**
   * Show appropriate icon for sorted column. Asc, desc, or none.
   * @param {String} columnKey
   * @returns {JSX}
   */
  getSortIcon(columnKey) {
    if (this.state.sortBy.column === columnKey) {
      if (this.state.sortBy.ascending) {
        return <span className={icons.keyboard_arrow_down} />;
      } else {
        return <span className={icons.keyboard_arrow_up} />;
      }
    }
    // returning this hidden icon preserves whitespace and prevents minor width changes in columns.
    return <span className={classNames(css.hidden, icons.keyboard_arrow_up)} />;
  }

  /**
   * Is this row selected
   * @param {Object} row
   * @returns {bool}
   */
  isSelected(row) {
    return this.props.selectable && !!this.state.selection.get(row.key);
  }

  /**
   * Extract data is a function is specified, otherwise return raw data.
   * @param {List} data
   * @returns {List}
   */
  extractData(data = this.props.data) {
    if (typeof this.props.dataExtractor === 'function') {
      return this.props.dataExtractor(data);
    }

    return data;
  }

  /**
   * Find a table row in the path of a doubleclick
   */
  handleDoubleClick(event) {
    let target = event.target;
    let rowKey = event.target.dataset.rowKey;
    while (!rowKey && target !== this.refs.container) {
      target = target.parentNode;
      rowKey = target.dataset.rowKey;
    }

    if (rowKey && typeof this.props.onDoubleClick === 'function') {
      const row = this.props.data.find(o => o.key.toString() === rowKey);
      this.props.onDoubleClick(row, event);
    }
  }

  render() {
    let columnKeys = this.props.columns.keySeq();
    return (
      <OutsideClick
        ref={'container'}
        className={classNames(this.props.className, css.container)}
        onClick={this.handleBlur}
      >
        <ul className={css.head}>
          {columnKeys.map((key) => {
            const column = this.props.columns.get(key);
            return (
              <li
                key={key}
                style={column.style}
                onClick={this.handleSort.bind(this, key)}
                className={classNames(css.headCell, css[key])}
              >
                {column.label}
                {this.getSortIcon.call(this, key)}
              </li>
            );
          })
          }
        </ul>

        <ul
          className={css.body}
          onDoubleClick={this.handleDoubleClick}
        >
          {this.getSortedData().map((row, index) => (
            <TableRow
              key={row.key}
              row={row}
              rowIndex={index}
              columns={this.props.columns}
              selected={this.isSelected(row)}
              onClick={this.handleRowClick}
            />
          ))}
        </ul>
      </OutsideClick>
    );
  }
}

Table.defaultProps = {
  className: '',
  columns: new OrderedMap(),
  data: new List(),
  value: void 0,
  selectable: true,
  defaultSort: {
    column: void 0,
    ascending: true
  },
  onSelect: void 0,
  onSort: void 0,
  onBlur: void 0,
  dataExtractor: void 0
};

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.instanceOf(OrderedMap).isRequired,
  data: PropTypes.instanceOf(List).isRequired,
  value: PropTypes.instanceOf(Seq.Indexed),
  dataExtractor: PropTypes.func,
  defaultSort: PropTypes.shape({
    column: PropTypes.string,
    ascending: PropTypes.bool
  }),
  selectable: PropTypes.bool,
  onSelect: PropTypes.func,
  onSort: PropTypes.func,
  onBlur: PropTypes.func
};
