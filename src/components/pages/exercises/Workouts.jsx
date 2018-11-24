import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import AddExerciseModal from '../../reusable/modals/AddExerciseModal'
import Exercise from './Exercise'

const Workouts = ({ activeDate, exercises }) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0)
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(0)
  const selectedExercise = exercises[selectedExerciseIndex]

  useEffect(
    () => {
      setSelectedExerciseIndex(0)
    },
    [activeDate]
  )

  useEffect(
    () => {
      setSelectedExerciseIndex(exercises.length - 1)
    },
    [exercises.length]
  )

  return (
    <div className="workouts">
      <div className="workouts-numbers">
        {exercises.map((exercise, i) => (
          <div
            key={i}
            className={cn('workouts-number', {
              'workouts-number-selected': selectedExerciseIndex === i,
            })}
            onClick={() => setSelectedExerciseIndex(i)}
          >
            {i + 1}
          </div>
        ))}

        <a
          className="workout-add-exercise"
          onClick={() => setAddExerciseModalOpen(true)}
        >
          +
        </a>
        <AddExerciseModal
          activeDate={activeDate}
          closeModal={() => setAddExerciseModalOpen(false)}
          isOpen={addExerciseModalOpen}
        />
      </div>
      <div className="workouts-exercises">
        {selectedExercise && <Exercise {...selectedExercise} />}
      </div>
    </div>
  )
}

Workouts.propTypes = {
  activeDate: PropTypes.number.isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Workouts
