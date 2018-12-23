import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import AddExerciseModal from '../../reusable/modals/AddExerciseModal'
import Exercise from './Exercise'

const Workouts = ({ activeDate, exercises, refetchExercises }) => {
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(0)
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false)
  const selectedExercise = exercises[selectedExerciseIndex]

  // If the date changes, set the index back to zero in case the number of exercises
  // differs from day to day (which it does).
  useEffect(
    () => {
      setSelectedExerciseIndex(0)
    },
    [activeDate]
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
          closeModal={async ({ exerciseAdded = false } = {}) => {
            setAddExerciseModalOpen(false)

            // Set the index to the end so our newly added exercise is highlighted.
            if (exerciseAdded) {
              await refetchExercises()
              setSelectedExerciseIndex(exercises.length)
            }
          }}
          isOpen={addExerciseModalOpen}
        />
      </div>
      <div className="workouts-exercises">
        {selectedExercise && (
          <Exercise
            {...selectedExercise}
            onDeleteExercise={async () => {
              await refetchExercises()
              setSelectedExerciseIndex(Math.max(selectedExerciseIndex - 1, 0))
            }}
            refetchExercises={refetchExercises}
          />
        )}
      </div>
    </div>
  )
}

Workouts.propTypes = {
  activeDate: PropTypes.number.isRequired,
  exercises: PropTypes.arrayOf(PropTypes.object).isRequired,
  refetchExercises: PropTypes.func.isRequired,
}

export default Workouts
