import React from 'react'
import PropTypes from 'prop-types'

const FormContent = ({ children }) => (
  <div className="form-content">{children}</div>
)

FormContent.propTypes = {
  children: PropTypes.node.isRequired,
}

export default FormContent
