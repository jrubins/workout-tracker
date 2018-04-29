import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { MODAL_TYPES } from '../../../utils/modals'
import { endOfDay, getTimestamp } from '../../../utils/dates'

import { getExercises } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'
import { openModal } from '../../../actions/modal'

import ApiRequest from '../../reusable/api/ApiRequest'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'
import Exercise from './Exercise'

const ExercisesPage = ({ data, fetchExercises, openModal }) => (
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

          return (
            <div className="workouts">
              {_.orderBy(dayExercises, 'createdAt').map(
                ({ id, name, sets, type }) => (
                  <Exercise
                    key={id}
                    id={id}
                    name={name}
                    sets={sets}
                    type={type}
                  />
                )
              )}
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
          )
        }}
      </DatePicker>
    </div>
  </AuthenticatedPage>
)

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
