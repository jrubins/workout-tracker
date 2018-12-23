import React, { useState } from 'react'
import PropTypes from 'prop-types'

import DeleteExerciseModal from '../../reusable/modals/DeleteExerciseModal'
import PencilIcon from '../../reusable/icons/PencilIcon'
import SaveExerciseTypeModal from '../../reusable/modals/SaveExerciseTypeModal'
import SaveSetModal from '../../reusable/modals/SaveSetModal'
import TimeMetricDisplay from './TimeMetricDisplay'

const Exercise = ({
  exerciseType,
  id,
  onDeleteExercise,
  refetchExercises,
  sets,
}) => {
  const [saveExerciseTypeModalOpen, setSaveExerciseTypeModalOpen] = useState(
    false
  )
  const [createSetModalOpen, setCreateSetModalOpen] = useState(false)
  const [deleteExerciseModalOpen, setDeleteExerciseModalOpen] = useState(false)
  const [setToEdit, setSetToEdit] = useState(null)
  const { category, description, muscleGroups, name, variation } = exerciseType
  const isDistanceExercise = category === 'Distance'
  const isRepsExercise = category === 'Reps'
  const isTimeExercise = category === 'Time'
  const isWeightExercise = category === 'Weight'

  return (
    <>
      <SaveExerciseTypeModal
        closeModal={({ exerciseModified = false } = {}) => {
          setSaveExerciseTypeModalOpen(false)

          if (exerciseModified) {
            refetchExercises()
          }
        }}
        exerciseType={exerciseType}
        isOpen={saveExerciseTypeModalOpen}
      />
      <DeleteExerciseModal
        closeModal={({ exerciseDeleted = false } = {}) => {
          setDeleteExerciseModalOpen(false)

          if (exerciseDeleted) {
            onDeleteExercise()
          }
        }}
        exerciseId={id}
        isOpen={deleteExerciseModalOpen}
      />

      <div className="exercise">
        <div className="exercise-header">
          <div className="exercise-name">
            {name}{' '}
            <PencilIcon onClick={() => setSaveExerciseTypeModalOpen(true)} />
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
          {description && <p className="exercise-description">{description}</p>}
          <a
            className="exercise-delete-set"
            onClick={() => setDeleteExerciseModalOpen(true)}
          >
            Delete
          </a>
          <div className="exercise-sets">
            <SaveSetModal
              closeModal={({ setModified = false } = {}) => {
                setSetToEdit(null)

                if (setModified) {
                  refetchExercises()
                }
              }}
              exerciseId={id}
              exerciseType={exerciseType}
              existingSet={setToEdit}
              isOpen={!!setToEdit}
              sets={sets}
            />

            <h4>sets</h4>
            {sets.map((existingSet, i) => {
              const {
                distance,
                distanceUnit,
                time,
                timeUnit,
                reps,
                weight,
                weightUnit,
              } = existingSet

              return (
                <div
                  key={i}
                  className="exercise-set"
                  onClick={() => setSetToEdit(existingSet)}
                >
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
            })}
            <div className="exercise-add-set">
              <a onClick={() => setCreateSetModalOpen(true)}>+ Add Set</a>
              <SaveSetModal
                closeModal={({ setModified = false } = {}) => {
                  setCreateSetModalOpen(false)

                  if (setModified) {
                    refetchExercises()
                  }
                }}
                exerciseId={id}
                exerciseType={exerciseType}
                isOpen={createSetModalOpen}
                sets={sets}
              />
            </div>
          </div>
        </div>
      </div>
    </>
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
  onDeleteExercise: PropTypes.func.isRequired,
  refetchExercises: PropTypes.func.isRequired,
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
