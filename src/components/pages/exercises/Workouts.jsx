import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import { MODAL_TYPES } from '../../../utils/modals'

import { openModal } from '../../../actions/modal'

import Exercise from './Exercise'

class Workouts extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedExerciseIndex: 0,
    }

    this.selectExerciseIndex = this.selectExerciseIndex.bind(this)
  }

  componentDidUpdate(prevProps) {
    const { activeDate, exercises } = this.props

    if (activeDate !== prevProps.activeDate) {
      this.setState({
        selectedExerciseIndex: 0,
      })
    } else if (
      exercises.length &&
      prevProps.exercises.length &&
      exercises.length !== prevProps.exercises.length
    ) {
      this.setState({
        // Update the selected exercise to the last one if we get new exercises (user probably just added one).
        selectedExerciseIndex: exercises.length - 1,
      })
    }
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
    const { activeDate, exercises, openModal } = this.props
    const { selectedExerciseIndex } = this.state
    const selectedExercise = exercises[selectedExerciseIndex]

    return (
      <div className="workouts">
        <div className="workouts-numbers">
          {exercises.map((exercise, i) => (
            <div
              key={i}
              className={cn('workouts-number', {
                'workouts-number-selected': selectedExerciseIndex === i,
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
                date: activeDate,
                type: MODAL_TYPES.ADD_EXERCISE,
              })
            }
          >
            +
          </a>
        </div>
        <div className="workouts-exercises">
          {selectedExercise && <Exercise {...selectedExercise} />}
        </div>
      </div>
    )
  }
}

Workouts.propTypes = {
  activeDate: PropTypes.number.isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  openModal: PropTypes.func.isRequired,
}

export default connect(null, {
  openModal,
})(Workouts)
