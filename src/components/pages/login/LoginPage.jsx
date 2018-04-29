import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { login } from '../../../actions/users'

import ApiForm from '../../reusable/forms/ApiForm'
import Form from '../../reusable/forms/Form'
import FormGroup from '../../reusable/forms/FormGroup'
import FormSubmit from '../../reusable/forms/FormSubmit'
import Input from '../../reusable/forms/fields/Input'
import UnauthenticatedPage from '../../reusable/pages/UnauthenticatedPage'

const FORM_STATE_FIELDS = {
  EMAIL: {
    fieldName: 'email',
  },
  PASSWORD: {
    fieldName: 'password',
  },
}

const LoginPage = ({ login }) => (
  <UnauthenticatedPage>
    <div className="login-page page">
      <h1>Welcome back!</h1>
      <ApiForm apiFn={login}>
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
            {({ fields, handleChange }) => (
              <div>
                <FormGroup label="Email">
                  <Input
                    handleChange={value =>
                      handleChange(FORM_STATE_FIELDS.EMAIL.fieldName, value)
                    }
                    name="email"
                    type="email"
                    value={fields[FORM_STATE_FIELDS.EMAIL.fieldName].value}
                  />
                </FormGroup>
                <FormGroup label="Password">
                  <Input
                    handleChange={value =>
                      handleChange(FORM_STATE_FIELDS.PASSWORD.fieldName, value)
                    }
                    name="password"
                    type="password"
                    value={fields[FORM_STATE_FIELDS.PASSWORD.fieldName].value}
                  />
                </FormGroup>

                <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
                  Log in
                </FormSubmit>
              </div>
            )}
          </Form>
        )}
      </ApiForm>
    </div>
  </UnauthenticatedPage>
)

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
}

export default connect(null, {
  login,
})(LoginPage)
