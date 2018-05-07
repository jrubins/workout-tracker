import React from 'react'
import PropTypes from 'prop-types'

import { getTimeDisplay } from '../../../utils/exercises'

const TimeMetricDisplay = ({ time, timeUnit }) => (
  <div className="time-metric-display">{getTimeDisplay(time, timeUnit)}</div>
)

TimeMetricDisplay.propTypes = {
  time: PropTypes.number.isRequired,
  timeUnit: PropTypes.string.isRequired,
}

export default TimeMetricDisplay
