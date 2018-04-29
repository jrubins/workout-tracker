import React from 'react'
import PropTypes from 'prop-types'

const TimeMetricDisplay = ({ time, timeUnit }) => {
  const timeMin = Math.floor(time)
  const timeSec = Math.ceil((time - timeMin) * 60)

  return (
    <div className="time-metric-display">
      {`${timeMin}${timeSec ? `:${timeSec}` : ''}`} {timeUnit}
    </div>
  )
}

TimeMetricDisplay.propTypes = {
  time: PropTypes.number.isRequired,
  timeUnit: PropTypes.string.isRequired,
}

export default TimeMetricDisplay
