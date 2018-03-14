import React from 'react';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import classNames from 'classnames';
import css from './TableRow.css';

export default function DataViewRow(props) {

  const {row, columns} = props;
  const columnKeys = columns.keySeq();
  const handleClick = function handleTableRowClick(event) {
    props.onClick(row, props.rowIndex, props.selected, event);
  };
  return (
    <li
      className={classNames(css.row,{[css.selected]:props.selected})}
      onClick={handleClick}
    >
      {columnKeys.map((_key) => {
        const column = props.columns.get(_key);
        return (
          <div
            key={`${_key}-${row.key}`}
            style={column.style}
            className={classNames(css.cell, css[_key])}
          >
            {row[_key]}
          </div>
        );
      })}
    </li>
  );
}

/**
 * Defaults
 * @type    {Object}
 */
DataViewRow.defaultProps = {
  selected: false
};

/**
 * Types
 * @type    {Object}
 */
DataViewRow.propTypes = {
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columns: PropTypes.instanceOf(OrderedMap).isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};
