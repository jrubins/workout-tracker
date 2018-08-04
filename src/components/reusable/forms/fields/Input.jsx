import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

class Input extends Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * Handles a change to the input's value.
   *
   * @param {SyntheticEvent} event
   */
  handleChange(event) {
    const { handleChange, type } = this.props
    let value =
      _.get(event, 'target.type') === 'checkbox'
        ? _.get(event, 'target.checked')
        : _.get(event, 'target.value')

    // Force the value to null to a number type input that doesn't have a value since the empty string
    // is not a valid number.
    if (type === 'number' && !value) {
      value = null
    }

    handleChange(value)
  }

  render() {
    const {
      autoComplete,
      autoFocus,
      disabled,
      handleBlur,
      handleChange,
      handleClick,
      handleFocus,
      handleKeyDown,
      maxLength,
      name,
      placeholder,
      setInputRef,
      tabindex,
      type,
      uncontrolled,
      value,
    } = this.props
    const controlledProps = {}

    if (!uncontrolled) {
      controlledProps.checked = !!value
      controlledProps.value = _.isNil(value) ? '' : value
    }

    return (
      <input
        {...controlledProps}
        ref={setInputRef}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={cn('input', {
          'input-disabled': disabled,
        })}
        disabled={disabled}
        maxLength={maxLength}
        name={name}
        onBlur={handleBlur}
        onChange={handleChange ? this.handleChange : null}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        tabIndex={tabindex}
        type={type}
      />
    )
  }
}

Input.propTypes = {
  autoComplete: PropTypes.string,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleClick: PropTypes.func,
  handleFocus: PropTypes.func,
  handleKeyDown: PropTypes.func,
  maxLength: PropTypes.number,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  setInputRef: PropTypes.func,
  tabindex: PropTypes.string,
  type: PropTypes.string.isRequired,
  uncontrolled: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
}

export default Input
