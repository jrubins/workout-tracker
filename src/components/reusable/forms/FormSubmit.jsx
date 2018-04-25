import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { info } from '../../../utils/logs'

import Button from './fields/Button'

const FormSubmit = ({ children, handleSubmit, isLoading }) => (
  <div className="form-submit">
    <Button
      handleClick={event => {
        const submitResult = handleSubmit(event)
        if (submitResult && _.isFunction(submitResult.catch)) {
          submitResult.catch(err => {
            info('Form submit failed:', err)
          })
        }
      }}
      isDisabled={isLoading}
      isLoading={isLoading}
      type="submit"
    >
      {children}
    </Button>
  </div>
)

FormSubmit.propTypes = {
  children: PropTypes.node.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default FormSubmit
