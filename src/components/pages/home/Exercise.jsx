import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MODAL_TYPES } from '../../../utils/modals'

import { openModal } from '../../../actions/modal'

const Exercise = ({ id, name, openModal, sets }) => (
  <div className="exercise">
    <div className="exercise-header">
      <div className="exercise-name">{name}</div>
    </div>
    <div className="exercise-details">
      {sets.map(
        (
          { distance, distanceUnit, time, timeUnit, reps, weight, weightUnit },
          i
        ) => (
          <div key={i} className="exercise-set">
            <div className="exercise-set-number">Set {i + 1}</div>
            <div className="exercise-set-details">
              {distance && (
                <Fragment>
                  <div className="exercise-metric">
                    {distance} {distanceUnit}
                  </div>
                  <div className="exercise-metric">
                    {`${Math.floor(time)}:${Math.ceil(
                      (time - Math.floor(time)) * 60
                    )}`}{' '}
                    {timeUnit}
                  </div>
                </Fragment>
              )}
              {weight && (
                <Fragment>
                  <div className="exercise-metric">
                    {weight} {weightUnit}
                  </div>
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
)

Exercise.propTypes = {
  openModal: PropTypes.func.isRequired,

  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
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
