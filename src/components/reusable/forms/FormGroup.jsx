import React from 'react'
import PropTypes from 'prop-types'

const FormGroup = ({ children, error, hint, label }) => (
  <div className="form-group">
    {label && <label className="form-label">{label}</label>}

    {children}

    {hint && <p className="form-group-hint">{hint}</p>}

    {error && <div className="form-validation-message">{error}</div>}
  </div>
)

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
  hint: PropTypes.string,
  label: PropTypes.node,
}

export default FormGroup
