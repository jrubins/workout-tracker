import React from 'react'
import PropTypes from 'prop-types'

const ChevronLeftIcon = ({ onClick }) => (
  <svg
    className="icon icon-chevron-left"
    fill="#000000"
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

ChevronLeftIcon.propTypes = {
  onClick: PropTypes.func,
}

export default ChevronLeftIcon
