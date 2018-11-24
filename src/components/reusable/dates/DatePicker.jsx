import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  addToDate,
  formatDate,
  getTimestamp,
  startOfDay,
} from '../../../utils/dates'

import ChevronLeftIcon from '../../reusable/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../reusable/icons/ChevronRightIcon'

/**
 * Returns the timestamp for the start of the current date.
 *
 * @returns {Number}
 */
function getStartOfToday() {
  return getTimestamp(startOfDay(Date.now()))
}

const DatePicker = ({ children }) => {
  // Start with the current date as our selected date.
  const [selectedDate, setSelectedDate] = useState(getStartOfToday())

  /**
   * Changes the currently selected date either one forwards or one backwards.
   *
   * @param {String} direction
   */
  function changeSelectedDate(direction) {
    let selectedDate = selectedDate
    if (direction === 'prev') {
      selectedDate = getTimestamp(
        addToDate(selectedDate, {
          duration: -1,
          unit: 'd',
        })
      )
    } else if (direction === 'next') {
      selectedDate = getTimestamp(
        addToDate(selectedDate, {
          duration: 1,
          unit: 'd',
        })
      )
    } else if (direction === 'today') {
      selectedDate = getStartOfToday()
    }

    setSelectedDate(selectedDate)
  }

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <ChevronLeftIcon onClick={() => changeSelectedDate('prev')} />
        <div className="selected-date">
          {formatDate(selectedDate, 'dddd, MMMM Do')}
        </div>
        <ChevronRightIcon onClick={() => changeSelectedDate('next')} />
        {selectedDate !== getStartOfToday() && (
          <a
            className="date-picker-today-link"
            onClick={() => changeSelectedDate('today')}
          >
            Back to Today
          </a>
        )}
      </div>

      {children(selectedDate)}
    </div>
  )
}

DatePicker.propTypes = {
  children: PropTypes.func.isRequired,
}

export default DatePicker
