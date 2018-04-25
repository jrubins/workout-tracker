import React from 'react'
import PropTypes from 'prop-types'

import Input from './Input'

const Checkbox = ({ label, ...rest }) => (
  <div className="checkbox">
    <Input {...rest} type="checkbox" />

    {label && <span className="checkbox-label">{label}</span>}
  </div>
)

Checkbox.propTypes = {
  label: PropTypes.string,
}

export default Checkbox
