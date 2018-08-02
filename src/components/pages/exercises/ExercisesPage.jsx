import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { endOfDay, getTimestamp } from '../../../utils/dates'

import { getExercises } from '../../../reducers'
import { fetchExercises } from '../../../actions/exercises'

import ApiRequest from '../../reusable/api/ApiRequest'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'
import Workouts from './Workouts'

const ExercisesPage = ({ data, fetchExercises }) => (
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

          return (
            <Workouts
              activeDate={selectedDate}
              exercises={orderedDayExercises}
            />
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
    })
  ).isRequired,
  fetchExercises: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    data: getExercises(state),
  }),
  {
    fetchExercises,
  }
)(ExercisesPage)
