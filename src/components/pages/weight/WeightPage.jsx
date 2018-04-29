import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { MODAL_TYPES } from '../../../utils/modals'
import { formatDate, isWithinDayRange } from '../../../utils/dates'

import { getWeight } from '../../../reducers'
import { fetchWeight } from '../../../actions/weight'
import { openModal } from '../../../actions/modal'

import ApiRequest from '../../reusable/api/ApiRequest'
import DatePicker from '../../reusable/dates/DatePicker'

const WeightPage = ({ data, fetchWeight, openModal }) => (
  <div className="weight-page page">
    <ApiRequest apiFn={fetchWeight} onMount={true} />
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
              onClick={() =>
                openModal({
                  date: selectedDate,
                  type: MODAL_TYPES.ADD_WEIGHT,
                })
              }
            >
              + Add Weight
            </a>
          </div>
        )
      }}
    </DatePicker>
  </div>
)

WeightPage.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      date: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
    })
  ).isRequired,
  fetchWeight: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    data: getWeight(state),
  }),
  {
    fetchWeight,
    openModal,
  }
)(WeightPage)
