import React from 'react'
import { Link } from 'react-router-dom'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import Input from '@jrubins/react-components/lib/forms/fields/Input'

import { signup } from '../../../utils/api/users'

import UnauthenticatedPage from '../../reusable/pages/UnauthenticatedPage'

const FORM_STATE_FIELDS = {
  EMAIL: {
    fieldName: 'email',
  },
  FIRST_NAME: {
    fieldName: 'firstName',
  },
  LAST_NAME: {
    fieldName: 'lastName',
  },
  PASSWORD: {
    fieldName: 'password',
  },
}

const SignupPage = () => (
  <UnauthenticatedPage>
    <div className="signup-page page">
      <h1>Let's get started!</h1>
      <ApiForm apiFn={formData => signup({ data: formData })}>
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
            {({ fields, handleChange }) => (
              <div>
                <FormGroup label="First Name">
                  <Input
                    handleChange={value =>
                      handleChange(
                        FORM_STATE_FIELDS.FIRST_NAME.fieldName,
                        value
                      )
                    }
                    name="firstName"
                    type="text"
                    value={fields[FORM_STATE_FIELDS.FIRST_NAME.fieldName].value}
                  />
                </FormGroup>
                <FormGroup label="Last Name">
                  <Input
                    handleChange={value =>
                      handleChange(FORM_STATE_FIELDS.LAST_NAME.fieldName, value)
                    }
                    name="lastName"
                    type="text"
                    value={fields[FORM_STATE_FIELDS.LAST_NAME.fieldName].value}
                  />
                </FormGroup>
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

                <div className="signup-form-actions">
                  <div>
                    Already have an account? <Link to="/login">Log in.</Link>
                  </div>
                  <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
                    Sign up
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

export default SignupPage
