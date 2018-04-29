import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  addToDate,
  formatDate,
  getTimestamp,
  startOfDay,
} from '../../../utils/dates'

import ChevronLeftIcon from '../../reusable/icons/ChevronLeftIcon'
import ChevronRightIcon from '../../reusable/icons/ChevronRightIcon'

class DatePicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // Start with the current date as our selected date.
      selectedDate: this.getStartOfToday(),
    }

    this.changeSelectedDate = this.changeSelectedDate.bind(this)
  }

  /**
   * Changes the currently selected date either one forwards or one backwards.
   *
   * @param {String} direction
   */
  changeSelectedDate(direction) {
    let selectedDate = this.state.selectedDate
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
      selectedDate = this.getStartOfToday()
    }

    this.setState({
      selectedDate,
    })
  }

  /**
   * Returns the timestamp for the start of the current date.
   *
   * @returns {Number}
   */
  getStartOfToday() {
    return getTimestamp(startOfDay(Date.now()))
  }

  render() {
    const { children } = this.props
    const { selectedDate } = this.state

    return (
      <div className="date-picker">
        <div className="date-picker-header">
          <ChevronLeftIcon onClick={() => this.changeSelectedDate('prev')} />
          <div className="selected-date">
            {formatDate(selectedDate, 'dddd, MMMM Do')}
          </div>
          <ChevronRightIcon onClick={() => this.changeSelectedDate('next')} />
          {selectedDate !== this.getStartOfToday() && (
            <a
              className="date-picker-today-link"
              onClick={() => this.changeSelectedDate('today')}
            >
              Back to Today
            </a>
          )}
        </div>

        {children(selectedDate)}
      </div>
    )
  }
}

DatePicker.propTypes = {
  children: PropTypes.func.isRequired,
}

export default DatePicker
