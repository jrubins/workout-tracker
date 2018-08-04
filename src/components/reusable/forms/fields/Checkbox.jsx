import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import CheckmarkIcon from '../../icons/CheckmarkIcon'

const Checkbox = ({ handleChange, label, value }) => (
  <div
    className={cn('checkbox', {
      'checkbox-checked': value,
    })}
    onClick={() => handleChange(!value)}
  >
    <div className="checkbox-box">{value && <CheckmarkIcon />}</div>
    <span className="checkbox-label">{label}</span>
  </div>
)

Checkbox.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
}

export default Checkbox
