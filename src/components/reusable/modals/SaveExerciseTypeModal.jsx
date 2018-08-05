import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveExerciseType } from '../../../actions/exerciseTypes'

import ApiForm from '../forms/ApiForm'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ExerciseCategorySelect from '../forms/selects/ExerciseCategorySelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'
import MuscleGroupCheckboxes from '../forms/muscleGroups/MuscleGroupCheckboxes'
import Textarea from '../forms/fields/Textarea'

const FORM_STATE_FIELDS = {
  EXERCISE_TYPE_CATEGORY: {
    fieldName: 'category',
  },
  EXERCISE_TYPE_DESCRIPTION: {
    fieldName: 'description',
  },
  EXERCISE_TYPE_MUSCLE_GROUPS: {
    fieldName: 'muscleGroups',
  },
  EXERCISE_TYPE_NAME: {
    fieldName: 'name',
  },
  EXERCISE_TYPE_VARIATION: {
    fieldName: 'variation',
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
              [FORM_STATE_FIELDS.EXERCISE_TYPE_CATEGORY.fieldName]: 'Weight',
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
                  <FormGroup label="Category">
                    <ExerciseCategorySelect
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_CATEGORY.fieldName,
                          value
                        )
                      }
                      name="category"
                      value={
                        fields[
                          FORM_STATE_FIELDS.EXERCISE_TYPE_CATEGORY.fieldName
                        ].value
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
                  <FormGroup label="Variation">
                    <Input
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_VARIATION.fieldName,
                          value
                        )
                      }
                      name="variation"
                      type="text"
                      value={
                        fields[
                          FORM_STATE_FIELDS.EXERCISE_TYPE_VARIATION.fieldName
                        ].value
                      }
                    />
                  </FormGroup>
                  <FormGroup label="Muscle Groups">
                    <MuscleGroupCheckboxes
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE_MUSCLE_GROUPS
                            .fieldName,
                          value
                        )
                      }
                      value={
                        fields[
                          FORM_STATE_FIELDS.EXERCISE_TYPE_MUSCLE_GROUPS
                            .fieldName
                        ].value
                      }
                    />
                  </FormGroup>
                </div>

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
