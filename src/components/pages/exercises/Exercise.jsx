import React, { useState } from 'react'
import PropTypes from 'prop-types'

import PencilIcon from '../../reusable/icons/PencilIcon'
import SaveExerciseTypeModal from '../../reusable/modals/SaveExerciseTypeModal'
import SaveSetModal from '../../reusable/modals/SaveSetModal'
import TimeMetricDisplay from './TimeMetricDisplay'

const Exercise = ({ exerciseType, id, sets }) => {
  const [saveExerciseTypeModalOpen, setSaveExerciseTypeModalOpen] = useState(
    false
  )
  const [saveSetModalOpen, setSaveSetModalOpen] = useState(false)
  const { category, description, muscleGroups, name, variation } = exerciseType
  const isDistanceExercise = category === 'Distance'
  const isRepsExercise = category === 'Reps'
  const isTimeExercise = category === 'Time'
  const isWeightExercise = category === 'Weight'

  return (
    <div className="exercise">
      <div className="exercise-header">
        <div className="exercise-name">
          {name}{' '}
          <PencilIcon onClick={() => setSaveExerciseTypeModalOpen(true)} />
          <SaveExerciseTypeModal
            closeModal={() => setSaveExerciseTypeModalOpen(false)}
            exerciseType={exerciseType}
            isOpen={saveExerciseTypeModalOpen}
          />
        </div>
        <div className="exercise-variation">{variation}</div>
      </div>
      <div className="exercise-details">
        <div className="exercise-muscle-groups">
          {muscleGroups.sort().map(muscleGroup => (
            <div key={muscleGroup} className="exercise-muscle-group">
              {muscleGroup}
            </div>
          ))}
        </div>
        <p className="exercise-description">{description}</p>
        <div className="exercise-sets">
          <h4>sets</h4>
          {sets.map(
            (
              {
                _id: setId,
                distance,
                distanceUnit,
                time,
                timeUnit,
                reps,
                weight,
                weightUnit,
              },
              i
            ) => (
              <div
                key={i}
                className="exercise-set"
                onClick={() => setSaveSetModalOpen(true)}
              >
                <SaveSetModal
                  closeModal={() => setSaveSetModalOpen(false)}
                  exerciseId={id}
                  isOpen={saveSetModalOpen}
                  setId={setId}
                />
                <div className="exercise-set-number">{i + 1}</div>
                <div className="exercise-set-details">
                  {(isDistanceExercise || isTimeExercise) && (
                    <>
                      {isDistanceExercise && (
                        <div className="exercise-metric">
                          {distance} {distanceUnit}
                        </div>
                      )}
                      <div className="exercise-metric">
                        <TimeMetricDisplay time={time} timeUnit={timeUnit} />
                      </div>
                    </>
                  )}
                  {(isRepsExercise || isWeightExercise) && (
                    <>
                      {isWeightExercise && (
                        <div className="exercise-metric">
                          {weight} {weightUnit}
                        </div>
                      )}
                      <div className="exercise-metric">{reps} reps</div>
                    </>
                  )}
                </div>
              </div>
            )
          )}
          <div className="exercise-add-set">
            <a onClick={() => setSaveSetModalOpen(true)}>+ Add Set</a>
            <SaveSetModal
              closeModal={() => setSaveSetModalOpen(false)}
              exerciseId={id}
              isOpen={saveSetModalOpen}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

Exercise.propTypes = {
  exerciseType: PropTypes.shape({
    category: PropTypes.string.isRequired,
    description: PropTypes.string,
    muscleGroups: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    variation: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      distance: PropTypes.number,
      distanceUnit: PropTypes.string,
      time: PropTypes.number,
      timeUnit: PropTypes.string,
      reps: PropTypes.number,
      weight: PropTypes.number,
      weightUnit: PropTypes.string,
    })
  ).isRequired,
}

export default Exercise
