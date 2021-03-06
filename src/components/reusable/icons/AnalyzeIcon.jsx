import React from 'react'
import PropTypes from 'prop-types'

const AnalyzeIcon = ({ onClick }) => (
  <svg
    className="icon icon-analyze"
    fill="#000000"
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

AnalyzeIcon.propTypes = {
  onClick: PropTypes.func,
}

export default AnalyzeIcon
