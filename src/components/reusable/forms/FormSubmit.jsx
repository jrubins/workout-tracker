import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import { info } from '../../../utils/logs'

import Button from './fields/Button'

const FormSubmit = ({ children, handleSubmit, hasInlineLoader, isLoading }) => (
  <div className={cn('form-submit', { 'form-submit-loading': isLoading })}>
    <Button
      handleClick={event => {
        const submitResult = handleSubmit(event)
        if (submitResult && _.isFunction(submitResult.catch)) {
          submitResult.catch(err => {
            info('Form submit failed:', err)
          })
        }
      }}
      hasInlineLoader={hasInlineLoader}
      isDisabled={isLoading}
      isLoading={isLoading}
      type="submit"
    >
      {children}
    </Button>
  </div>
)

FormSubmit.defaultProps = {
  hasInlineLoader: true,
}

FormSubmit.propTypes = {
  children: PropTypes.node.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  hasInlineLoader: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
}

export default FormSubmit
