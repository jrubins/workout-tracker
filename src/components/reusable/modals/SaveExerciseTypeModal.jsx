import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveExerciseType } from '../../../actions/exerciseTypes'

import ApiForm from '../forms/ApiForm'
import ExerciseTypeSelect from '../forms/selects/ExerciseTypeSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'
import Textarea from '../forms/fields/Textarea'

const FORM_STATE_FIELDS = {
  EXERCISE_TYPE_DESCRIPTION: {
    fieldName: 'description',
  },
  EXERCISE_TYPE_NAME: {
    fieldName: 'name',
  },
  EXERCISE_TYPE_TYPE: {
    fieldName: 'type',
  },
}

class AddExerciseModal extends Component {
  render() {
    const { completedForm, exerciseType, saveExerciseType } = this.props

    return (
      <ApiForm
        apiFn={saveExerciseType}
        completedForm={completedForm}
        initialData={exerciseType}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form
            ref={saveFormRef}
            defaults={{
              [FORM_STATE_FIELDS.EXERCISE_TYPE_TYPE.fieldName]: 'Weight',
            }}
            formFields={FORM_STATE_FIELDS}
            initialData={exerciseType}
          >
            {({ fields, handleChange }) => (
              <div className="add-exercise-form">
                <div className="add-exercise-form-new-exercise">
                  <FormGroup label="Name">
                    <Input
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_NAME.fieldName,
                          value
                        )
                      }
                      name="name"
                      type="text"
                      value={
                        fields[FORM_STATE_FIELDS.EXERCISE_TYPE_NAME.fieldName]
                          .value
                      }
                    />
                  </FormGroup>
                  <FormGroup label="Type">
                    <ExerciseTypeSelect
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_TYPE.fieldName,
                          value
                        )
                      }
                      name="type"
                      value={
                        fields[FORM_STATE_FIELDS.EXERCISE_TYPE_TYPE.fieldName]
                          .value
                      }
                    />
                  </FormGroup>
                  <FormGroup label="Description">
                    <Textarea
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_DESCRIPTION.fieldName,
                          value
                        )
                      }
                      name="description"
                      value={
                        fields[
                          FORM_STATE_FIELDS.EXERCISE_TYPE_DESCRIPTION.fieldName
                        ].value
                      }
                    />
                  </FormGroup>
                </div>

                <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
                  Save
                </FormSubmit>
              </div>
            )}
          </Form>
        )}
      </ApiForm>
    )
  }
}

AddExerciseModal.propTypes = {
  saveExerciseType: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  exerciseType: PropTypes.object,
}

export default connect(null, {
  saveExerciseType,
})(AddExerciseModal)
