import React from 'react'
import PropTypes from 'prop-types'

import { formatDate, getStartOfToday } from '../../../utils/dates'

import ChevronLeftIcon from '../../reusable/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../reusable/icons/ChevronRightIcon'

const DatePicker = ({ activeDate, changeSelectedDate, children }) => {
  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <ChevronLeftIcon onClick={() => changeSelectedDate('prev')} />
        <div className="selected-date">
          {formatDate(activeDate, 'dddd, MMMM Do')}
        </div>
        <ChevronRightIcon onClick={() => changeSelectedDate('next')} />
        {activeDate !== getStartOfToday() && (
          <a
            className="date-picker-today-link"
            onClick={() => changeSelectedDate('today')}
          >
            Back to Today
          </a>
        )}
      </div>

      {children}
    </div>
  )
}

DatePicker.propTypes = {
  activeDate: PropTypes.number.isRequired,
  changeSelectedDate: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default DatePicker
