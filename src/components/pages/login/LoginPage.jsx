import React from 'react'
import { Link } from 'react-router-dom'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormError from '@jrubins/react-components/lib/forms/FormError'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import Input from '@jrubins/react-components/lib/forms/fields/Input'

import { login } from '../../../utils/api/users'

import UnauthenticatedPage from '../../reusable/pages/UnauthenticatedPage'

const FORM_STATE_FIELDS = {
  EMAIL: {
    fieldName: 'email',
  },
  PASSWORD: {
    fieldName: 'password',
  },
}

const LoginPage = () => (
  <UnauthenticatedPage>
    <div className="login-page page">
      <h1>Welcome back!</h1>
      <ApiForm apiFn={formData => login({ data: formData })}>
        {({ error, isSaving, saveFormRef, submitToApi }) => (
          <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
            {({ fields, handleChange }) => (
              <div>
                <FormError error={error} />
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

                <div className="login-form-actions">
                  <div>
                    Need an account? <Link to="/signup">Sign up.</Link>
                  </div>
                  <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
                    Log in
                  </FormSubmit>
                </div>
              </div>
            )}
          </Form>
        )}
      </ApiForm>
    </div>
  </UnauthenticatedPage>
)

export default LoginPage
