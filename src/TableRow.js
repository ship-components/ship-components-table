import React from 'react';
import PropTypes from 'prop-types';
import { OrderedMap } from 'immutable';
import classNames from 'classnames';
import css from './TableRow.css';

export default function DataViewRow(props) {

  const { row, columns } = props;
  const columnKeys = columns.keySeq();
  const handleClick = function handleTableRowClick(event) {
    props.onClick(row, props.rowIndex, props.selected, event);
  };
  return (
    <li
      data-row-key={row.key}
      className={classNames(css.row, { [css.selected]: props.selected })}
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
      {props.deletable ?
        <button className={classNames(
          'icon',
          'request-button',
          'btn',
          'btn-flat',
          'btn-icon-effect-loading'
        )} type='button' onClick={props.onDelete.bind(this)}>
          <span className={classNames('icon')}></span>
          <span className='btn-value'><span className='icon-cross' /></span>
        </button>
        : null}
    </li>
  );
}

/**
 * Defaults
 * @type    {Object}
 */
DataViewRow.defaultProps = {
  selected: false,
  deletable: false,
  onDelete: void 0
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
  onClick: PropTypes.func.isRequired,
  deletable: PropTypes.bool,
  onDelete: PropTypes.func
};
