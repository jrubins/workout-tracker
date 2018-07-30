import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const Textarea = ({ handleChange, name, value }) => (
  <textarea
    className="textarea"
    name={name}
    onChange={event => handleChange(event.target.value)}
    value={_.isNil(value) ? '' : value}
  />
)

Textarea.propTypes = {
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
}

export default Textarea
