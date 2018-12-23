import React, { useContext, useState } from 'react'
import _ from 'lodash'

import { fetchWeight } from '../../../utils/api/weight'
import { formatDate, isWithinDayRange } from '../../../utils/dates'

import { UserContext } from '../../contexts'
import { useApiRequest, useDatePicker } from '../../hooks'
import AddWeightModal from '../../reusable/modals/AddWeightModal'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'

const WeightPage = () => {
  const [addWeightModalOpen, setAddWeightModalOpen] = useState(false)
  const { jwt } = useContext(UserContext)
  const [selectedDate, changeSelectedDate] = useDatePicker()
  const { data, makeApiRequest } = useApiRequest({
    apiFn: () => fetchWeight({ jwt }),
    onMount: true,
  })
  const weightData = _.get(data, 'data') || []
  // Filter out weights that don't fall in the date range for the selected date.
  const dayWeights = weightData.filter(({ date }) =>
    isWithinDayRange(date, selectedDate)
  )

  return (
    <AuthenticatedPage>
      <div className="weight-page page">
        <DatePicker
          activeDate={selectedDate}
          changeSelectedDate={changeSelectedDate}
        >
          <div className="weights">
            {_.orderBy(dayWeights, 'createdAt').map(
              ({ createdAt, date, id, weight }) => {
                const dateForWeight = isWithinDayRange(createdAt, date)
                  ? createdAt
                  : date

                return (
                  <div className="weight" key={id}>
                    <div>{weight}</div>
                    <div className="weight-date">
                      {formatDate(dateForWeight, 'M/DD/YYYY h:mm A')}
                    </div>
                  </div>
                )
              }
            )}
            <a
              className="add-weight-link"
              onClick={() => setAddWeightModalOpen(true)}
            >
              + Add Weight
            </a>

            <AddWeightModal
              closeModal={() => {
                setAddWeightModalOpen(false)
                makeApiRequest()
              }}
              date={selectedDate}
              isOpen={addWeightModalOpen}
            />
          </div>
        </DatePicker>
      </div>
    </AuthenticatedPage>
  )
}

export default WeightPage
