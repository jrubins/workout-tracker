import React from 'react'
import _ from 'lodash'
import ApiRequest from '@jrubins/react-components/lib/api/ApiRequest'

import { endOfDay, getTimestamp } from '../../../utils/dates'
import { fetchExercises } from '../../../utils/api/exercises'

import { UserContext } from '../../contexts'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'
import Workouts from './Workouts'

const ExercisesPage = () => (
  <AuthenticatedPage>
    <div className="exercises-page page">
      <UserContext.Consumer>
        {({ jwt }) => (
          <ApiRequest apiFn={() => fetchExercises({ jwt })} onMount={true}>
            {({ data }) => (
              <DatePicker>
                {selectedDate => {
                  // Filter out exercises that don't fall in the date range for the selected date.
                  const dayExercises = _.get(data, 'data', []).filter(
                    ({ date }) =>
                      date >= selectedDate &&
                      date <= getTimestamp(endOfDay(selectedDate))
                  )
                  const orderedDayExercises = _.orderBy(
                    dayExercises,
                    'createdAt'
                  )

                  return (
                    <Workouts
                      activeDate={selectedDate}
                      exercises={orderedDayExercises}
                    />
                  )
                }}
              </DatePicker>
            )}
          </ApiRequest>
        )}
      </UserContext.Consumer>
    </div>
  </AuthenticatedPage>
)

export default ExercisesPage
