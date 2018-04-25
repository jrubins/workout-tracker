import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

const Select = ({
  children,
  disabled,
  emptyOptionLabel,
  handleChange,
  hasEmptyOption,
  handleKeyDown,
  name,
  value,
}) => (
  <select
    className={cn('select', {
      'select-disabled': disabled,
    })}
    disabled={disabled}
    name={name}
    onChange={event => {
      let value = _.get(event, 'target.value')

      // Need to force empty string selections to null since the empty string is not a valid enum.
      if (value === '') {
        value = null
      }

      handleChange(value)
    }}
    onKeyDown={handleKeyDown}
    value={_.isNil(value) ? '' : value}
  >
    {hasEmptyOption && <option value="">{emptyOptionLabel}</option>}

    {children}
  </select>
)

Select.defaultProps = {
  emptyOptionLabel: '',
  hasEmptyOption: true,
}

Select.propTypes = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  emptyOptionLabel: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func,
  hasEmptyOption: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default Select
