import React from 'react'
import PropTypes from 'prop-types'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import Input from '@jrubins/react-components/lib/forms/fields/Input'

import { createWeight } from '../../../utils/api/weight'

import { UserContext } from '../../contexts'
import CheckmarkIcon from '../icons/CheckmarkIcon'

const FORM_STATE_FIELDS = {
  WEIGHT: {
    fieldName: 'weight',
  },
}

const AddWeightModal = ({ completedForm, date }) => (
  <UserContext.Consumer>
    {({ jwt }) => (
      <ApiForm
        apiFn={formData =>
          createWeight({
            data: formData,
            date,
            jwt,
          })
        }
        completedForm={completedForm}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
            {({ fields, handleChange }) => (
              <div className="add-weight-form">
                <FormGroup label="Weight">
                  <Input
                    autoFocus={true}
                    handleChange={value =>
                      handleChange(FORM_STATE_FIELDS.WEIGHT.fieldName, value)
                    }
                    name="weight"
                    type="number"
                    value={fields[FORM_STATE_FIELDS.WEIGHT.fieldName].value}
                  />
                </FormGroup>

                <FormSubmit
                  handleSubmit={submitToApi}
                  hasInlineLoader={false}
                  isLoading={isSaving}
                >
                  {!isSaving && <CheckmarkIcon />}
                </FormSubmit>
              </div>
            )}
          </Form>
        )}
      </ApiForm>
    )}
  </UserContext.Consumer>
)

AddWeightModal.propTypes = {
  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default AddWeightModal
