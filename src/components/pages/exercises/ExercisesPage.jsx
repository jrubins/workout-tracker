import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import cn from 'classnames'

import { MODAL_TYPES } from '../../../utils/modals'
import { endOfDay, getTimestamp } from '../../../utils/dates'

import { getExercises } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'
import { openModal } from '../../../actions/modal'

import ApiRequest from '../../reusable/api/ApiRequest'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'
import Exercise from './Exercise'

class ExercisesPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedExerciseIndex: 0,
    }

    this.selectExerciseIndex = this.selectExerciseIndex.bind(this)
  }

  /**
   * Selects an exercise index.
   *
   * @param {Number} selectedExerciseIndex
   */
  selectExerciseIndex(selectedExerciseIndex) {
    this.setState({
      selectedExerciseIndex,
    })
  }

  render() {
    const { data, fetchExercises, openModal } = this.props
    const { selectedExerciseIndex } = this.state

    return (
      <AuthenticatedPage>
        <div className="exercises-page page">
          <ApiRequest apiFn={fetchExercises} onMount={true} />
          <DatePicker>
            {selectedDate => {
              // Filter out exercises that don't fall in the date range for the selected date.
              const dayExercises = data.filter(
                ({ date }) =>
                  date >= selectedDate &&
                  date <= getTimestamp(endOfDay(selectedDate))
              )
              const orderedDayExercises = _.orderBy(dayExercises, 'createdAt')
              const exercise = orderedDayExercises[selectedExerciseIndex]
              console.log(orderedDayExercises, exercise)

              return (
                <div className="workouts">
                  <div className="workouts-numbers">
                    {orderedDayExercises.map((exercise, i) => (
                      <div
                        key={i}
                        className={cn('workouts-number', {
                          'workouts-number-selected':
                            selectedExerciseIndex === i,
                        })}
                        onClick={() => this.selectExerciseIndex(i)}
                      >
                        {i + 1}
                      </div>
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
                      +
                    </a>
                  </div>
                  <div className="workouts-exercises">
                    {exercise && <Exercise {...exercise} />}
                  </div>
                </div>
              )
            }}
          </DatePicker>
        </div>
      </AuthenticatedPage>
    )
  }
}

ExercisesPage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sets: PropTypes.array.isRequired,
      type: PropTypes.string.isRequired,
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
)(ExercisesPage)
