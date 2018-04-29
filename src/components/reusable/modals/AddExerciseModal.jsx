import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveExercise } from '../../../actions/exercises'

import ApiForm from '../forms/ApiForm'
import ExerciseNameSelect from '../forms/selects/ExerciseNameSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'

const FORM_STATE_FIELDS = {
  EXISTING_EXERCISE_NAME: {
    fieldName: 'existingExerciseName',
  },
  NEW_EXERCISE_NAME: {
    fieldName: 'newExerciseName',
  },
}

const AddExerciseModal = ({ completedForm, date, saveExercise }) => (
  <ApiForm
    apiFn={formData =>
      saveExercise({
        date,
        // Prefer an existing exercise name and fallback to a new one.
        name:
          formData[FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName] ||
          formData[FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName],
      })
    }
    completedForm={completedForm}
  >
    {({ isSaving, saveFormRef, submitToApi }) => (
      <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
        {({ fields, handleChange }) => (
          <div>
            <FormGroup label="Existing Name">
              <ExerciseNameSelect
                handleChange={value =>
                  handleChange(
                    FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName,
                    value
                  )
                }
                name="existingExerciseName"
                value={
                  fields[FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName]
                    .value
                }
              />
            </FormGroup>
            <FormGroup label="New Exercise">
              <Input
                handleChange={value =>
                  handleChange(
                    FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName,
                    value
                  )
                }
                name="newExercise"
                type="text"
                value={
                  fields[FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName].value
                }
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

AddExerciseModal.propTypes = {
  saveExercise: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(null, {
  saveExercise,
})(AddExerciseModal)
