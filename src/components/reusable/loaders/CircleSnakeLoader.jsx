import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

const CircleSnakeLoader = ({ isColored, isInline }) => (
  <div
    className={cn('circle-snake-loader', {
      'circle-snake-loader-colored': isColored,
      'circle-snake-loader-inline': isInline,
    })}
  />
)

CircleSnakeLoader.defaultProps = {
  isColored: true,
}

CircleSnakeLoader.propTypes = {
  isColored: PropTypes.bool,
  isInline: PropTypes.bool,
}

export default CircleSnakeLoader
