import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MODAL_TYPES } from '../../../utils/modals'

import { openModal } from '../../../actions/modal'

import PencilIcon from '../../reusable/icons/PencilIcon'
import TimeMetricDisplay from './TimeMetricDisplay'

const Exercise = ({ exerciseType, id, openModal, sets }) => {
  const { description, muscleGroups, name, type, variation } = exerciseType
  const isDistanceExercise = type === 'Distance'
  const isRepsExercise = type === 'Reps'
  const isTimeExercise = type === 'Time'
  const isWeightExercise = type === 'Weight'

  return (
    <div className="exercise">
      <div className="exercise-header">
        <div className="exercise-name">
          {name}{' '}
          <PencilIcon
            onClick={() =>
              openModal({
                exerciseType,
                type: MODAL_TYPES.SAVE_EXERCISE_TYPE,
              })
            }
          />
        </div>
        <div className="exercise-variation">{variation}</div>
      </div>
      <div className="exercise-details">
        {muscleGroups.map(muscleGroup => (
          <div key={muscleGroup} className="exercise-muscle-group">
            {muscleGroup}
          </div>
        ))}
        <p className="exercise-description">{description}</p>
        <div className="exercise-sets">
          <h4>sets</h4>
          {sets.map(
            (
              {
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
              <div key={i} className="exercise-set">
                <div className="exercise-set-number">{i + 1}</div>
                <div className="exercise-set-details">
                  {(isDistanceExercise || isTimeExercise) && (
                    <Fragment>
                      {isDistanceExercise && (
                        <div className="exercise-metric">
                          {distance} {distanceUnit}
                        </div>
                      )}
                      <div className="exercise-metric">
                        <TimeMetricDisplay time={time} timeUnit={timeUnit} />
                      </div>
                    </Fragment>
                  )}
                  {(isRepsExercise || isWeightExercise) && (
                    <Fragment>
                      {isWeightExercise && (
                        <div className="exercise-metric">
                          {weight} {weightUnit}
                        </div>
                      )}
                      <div className="exercise-metric">{reps} reps</div>
                    </Fragment>
                  )}
                </div>
              </div>
            )
          )}
          <div className="exercise-add-set">
            <a
              onClick={() =>
                openModal({
                  exerciseId: id,
                  type: MODAL_TYPES.ADD_SET,
                })
              }
            >
              + Add Set
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

Exercise.propTypes = {
  openModal: PropTypes.func.isRequired,

  exerciseType: PropTypes.shape({
    description: PropTypes.string,
    muscleGroups: PropTypes.arrayOf(PropTypes.string),
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
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

export default connect(null, {
  openModal,
})(Exercise)
