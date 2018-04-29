import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { MODAL_TYPES } from '../../../utils/modals'
import {
  addToDate,
  endOfDay,
  formatDate,
  getTimestamp,
  startOfDay,
} from '../../../utils/dates'

import { getExercises } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'
import { openModal } from '../../../actions/modal'

import ApiRequest from '../../reusable/api/ApiRequest'
import ChevronLeft from '../../reusable/icons/ChevronLeft'
import ChevronRight from '../../reusable/icons/ChevronRight'
import Exercise from './Exercise'

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // Start with the current date as our selected date.
      selectedDate: getTimestamp(startOfDay(Date.now())),
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
      selectedDate = addToDate(selectedDate, {
        duration: -1,
        unit: 'd',
      })
    } else if (direction === 'next') {
      selectedDate = addToDate(selectedDate, {
        duration: 1,
        unit: 'd',
      })
    }

    this.setState({
      selectedDate: getTimestamp(selectedDate),
    })
  }

  render() {
    const { data, fetchExercises, openModal } = this.props
    const { selectedDate } = this.state
    // Filter out exercises that don't fall in the date range for the selected date.
    const dayExercises = data.filter(
      ({ date }) =>
        date >= selectedDate && date <= getTimestamp(endOfDay(selectedDate))
    )

    return (
      <div className="home-page page">
        <ApiRequest apiFn={fetchExercises} onMount={true} />
        <div className="workout-date-header">
          <ChevronLeft onClick={() => this.changeSelectedDate('prev')} />
          <div className="workout-date">
            {formatDate(selectedDate, 'dddd, MMMM Do')}
          </div>
          <ChevronRight onClick={() => this.changeSelectedDate('next')} />
        </div>
        <div className="workouts">
          {_.orderBy(dayExercises, 'createdAt').map(({ id, name, sets }) => (
            <Exercise key={id} id={id} name={name} sets={sets} />
          ))}
          <a
            className="workout-add-exercise"
            onClick={() =>
              openModal({
                date: selectedDate,
                type: MODAL_TYPES.ADD_EXERCISE,
              })
            }
          >
            + Add Exercise
          </a>
        </div>
      </div>
    )
  }
}

HomePage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.array.isRequired,
    })
  ).isRequired,
  fetchExercises: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    data: getExercises(state),
  }),
  {
    fetchExercises,
    openModal,
  }
)(HomePage)
