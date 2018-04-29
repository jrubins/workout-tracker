import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveWeight } from '../../../actions/weight'

import ApiForm from '../forms/ApiForm'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'

const FORM_STATE_FIELDS = {
  WEIGHT: {
    fieldName: 'weight',
  },
}

const AddWeightModal = ({ completedForm, date, saveWeight }) => (
  <ApiForm
    apiFn={formData =>
      saveWeight({
        ...formData,
        date,
      })
    }
    completedForm={completedForm}
  >
    {({ isSaving, saveFormRef, submitToApi }) => (
      <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
        {({ fields, handleChange }) => (
          <div>
            <FormGroup label="Weight">
              <Input
                handleChange={value =>
                  handleChange(FORM_STATE_FIELDS.WEIGHT.fieldName, value)
                }
                name="weight"
                type="number"
                value={fields[FORM_STATE_FIELDS.WEIGHT.fieldName].value}
              />
            </FormGroup>

            <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
              Save
            </FormSubmit>
          </div>
        )}
      </Form>
    )}
  </ApiForm>
)

AddWeightModal.propTypes = {
  saveWeight: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(null, {
  saveWeight,
})(AddWeightModal)
