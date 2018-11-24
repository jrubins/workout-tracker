import React, { useState } from 'react'
import _ from 'lodash'
import ApiRequest from '@jrubins/react-components/lib/api/ApiRequest'

import { fetchWeight } from '../../../utils/api/weight'
import { formatDate, isWithinDayRange } from '../../../utils/dates'

import { UserContext } from '../../contexts'
import AddWeightModal from '../../reusable/modals/AddWeightModal'
import AuthenticatedPage from '../../reusable/pages/AuthenticatedPage'
import DatePicker from '../../reusable/dates/DatePicker'

const WeightPage = () => {
  const [addWeightModalOpen, setAddWeightModalOpen] = useState(false)

  return (
    <AuthenticatedPage>
      <div className="weight-page page">
        <UserContext.Consumer>
          {({ jwt }) => (
            <ApiRequest apiFn={() => fetchWeight({ jwt })} onMount={true}>
              {({ data }) => (
                <DatePicker>
                  {selectedDate => {
                    // Filter out weights that don't fall in the date range for the selected date.
                    const dayWeights = data.filter(({ date }) =>
                      isWithinDayRange(date, selectedDate)
                    )

                    return (
                      <div className="weights">
                        {_.orderBy(dayWeights, 'createdAt').map(
                          ({ createdAt, date, id, weight }) => {
                            const dateForWeight = isWithinDayRange(
                              createdAt,
                              date
                            )
                              ? createdAt
                              : date

                            return (
                              <div className="weight" key={id}>
                                <div>{weight}</div>
                                <div className="weight-date">
                                  {formatDate(
                                    dateForWeight,
                                    'M/DD/YYYY h:mm A'
                                  )}
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
                          closeModal={() => setAddWeightModalOpen(false)}
                          date={selectedDate}
                          isOpen={addWeightModalOpen}
                        />
                      </div>
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
}

export default WeightPage
