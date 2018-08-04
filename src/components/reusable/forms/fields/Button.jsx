import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import CircleSnakeLoader from '../../loaders/CircleSnakeLoader'

const Button = ({
  children,
  className,
  handleClick,
  hasInlineLoader,
  isDanger,
  isDisabled,
  isLoading,
  isSecondary,
  type,
}) => (
  <button
    className={cn('button', className, {
      'button-danger': isDanger,
      'button-disabled': isDisabled,
      'button-secondary': isSecondary,
    })}
    onClick={event => {
      if (!isDisabled && _.isFunction(handleClick)) {
        handleClick(event)
      } else if (isDisabled && type === 'submit') {
        // Otherwise this could cause a page refresh on click.
        event.preventDefault()
      }
    }}
    type={type}
  >
    {isLoading && <CircleSnakeLoader isInline={hasInlineLoader} />}
    <span className="button-content">{children}</span>
  </button>
)

Button.defaultProps = {
  type: 'button',
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  handleClick: PropTypes.func,
  hasInlineLoader: PropTypes.bool,
  isDanger: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  isSecondary: PropTypes.bool,
  type: PropTypes.string,
}

export default Button
