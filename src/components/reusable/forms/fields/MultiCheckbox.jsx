import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import Checkbox from './Checkbox'

const MultiCheckbox = ({ handleChange, options, value }) => (
  <div className="multi-checkbox">
    {options.map(({ label, value: optionValue }) => (
      <Checkbox
        key={optionValue}
        handleChange={() => {
          if (_.includes(value, optionValue)) {
            handleChange(_.without(value, optionValue))
          } else {
            handleChange([...(value || []), optionValue])
          }
        }}
        label={label}
        value={_.includes(value, optionValue)}
      />
    ))}
  </div>
)

MultiCheckbox.propTypes = {
  handleChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
}

export default MultiCheckbox
