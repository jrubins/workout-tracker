import React from 'react'
import PropTypes from 'prop-types'

const ChevronRightIcon = ({ onClick }) => (
  <svg
    className="icon icon-chevron-right"
    fill="#000000"
    onClick={onClick}
    viewBox="0 0 24 24"
  >
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

ChevronRightIcon.propTypes = {
  onClick: PropTypes.func,
}

export default ChevronRightIcon
