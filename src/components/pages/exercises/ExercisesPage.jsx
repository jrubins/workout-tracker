import React, { useContext } from 'react'
import _ from 'lodash'

import { endOfDay, getTimestamp } from '../../../utils/dates'
import { fetchExercises } from '../../../utils/api/exercises'

import { UserContext } from '../../contexts'
import { useApiRequest, useDatePicker } from '../../hooks'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'
import Workouts from './Workouts'

const ExercisesPage = () => {
  const { jwt } = useContext(UserContext)
  const [selectedDate, changeSelectedDate] = useDatePicker()
  const { data, makeApiRequest } = useApiRequest(
    {
      apiFn: () => fetchExercises({ date: selectedDate, jwt }),
      onMount: true,
    },
    [selectedDate]
  )
  // Filter out exercises that don't fall in the date range for the selected date.
  const dayExercises = _.filter(
    _.get(data, 'data', []),
    ({ date }) =>
      date >= selectedDate && date <= getTimestamp(endOfDay(selectedDate))
  )
  const orderedDayExercises = _.orderBy(dayExercises, 'createdAt')

  return (
    <AuthenticatedPage>
      <div className="exercises-page page">
        <DatePicker
          activeDate={selectedDate}
          changeSelectedDate={changeSelectedDate}
        >
          <Workouts
            activeDate={selectedDate}
            exercises={orderedDayExercises}
            refetchExercises={makeApiRequest}
          />
        </DatePicker>
      </div>
    </AuthenticatedPage>
  )
}

export default ExercisesPage
