import React from 'react'
import PropTypes from 'prop-types'

import { isApiRequestError } from '../../../utils/api'

const FormError = ({ error }) => {
  if (!isApiRequestError(error)) {
    return null
  }

  return <div className="form-error">{error.message}</div>
}

FormError.propTypes = {
  error: PropTypes.instanceOf(Error),
}

export default FormError
