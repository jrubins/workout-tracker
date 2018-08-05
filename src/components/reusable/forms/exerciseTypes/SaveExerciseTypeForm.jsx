import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveExerciseType } from '../../../../actions/exerciseTypes'

import ApiForm from '../ApiForm'
import CheckmarkIcon from '../../icons/CheckmarkIcon'
import ExerciseCategorySelect from '../selects/ExerciseCategorySelect'
import Form from '../Form'
import FormGroup from '../FormGroup'
import FormSubmit from '../FormSubmit'
import Input from '../fields/Input'
import MuscleGroupCheckboxes from '../muscleGroups/MuscleGroupCheckboxes'
import Textarea from '../fields/Textarea'

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

const SaveExerciseTypeForm = ({
  completedForm,
  initialData,
  isLoading,
  isNested,
  saveExerciseType,
}) => (
  <ApiForm
    apiFn={saveExerciseType}
    completedForm={completedForm}
    initialData={initialData}
  >
    {({ isSaving, saveFormRef, submitToApi }) => (
      <Form
        ref={saveFormRef}
        defaults={{
          [FORM_STATE_FIELDS.EXERCISE_TYPE_CATEGORY.fieldName]: 'Weight',
        }}
        formFields={FORM_STATE_FIELDS}
        initialData={initialData}
        isNested={isNested}
      >
        {({ fields, handleChange }) => (
          <div className="save-exercise-type-form">
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
                  fields[FORM_STATE_FIELDS.EXERCISE_TYPE_NAME.fieldName].value
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
                  fields[FORM_STATE_FIELDS.EXERCISE_TYPE_CATEGORY.fieldName]
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
                  fields[FORM_STATE_FIELDS.EXERCISE_TYPE_DESCRIPTION.fieldName]
                    .value
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
                  fields[FORM_STATE_FIELDS.EXERCISE_TYPE_VARIATION.fieldName]
                    .value
                }
              />
            </FormGroup>
            <FormGroup label="Muscle Groups">
              <MuscleGroupCheckboxes
                handleChange={value =>
                  handleChange(
                    FORM_STATE_FIELDS.EXERCISE_TYPE_MUSCLE_GROUPS.fieldName,
                    value
                  )
                }
                value={
                  fields[
                    FORM_STATE_FIELDS.EXERCISE_TYPE_MUSCLE_GROUPS.fieldName
                  ].value
                }
              />
            </FormGroup>

            <FormSubmit
              handleSubmit={submitToApi}
              hasInlineLoader={false}
              isLoading={isLoading || isSaving}
            >
              {!isLoading && !isSaving && <CheckmarkIcon />}
            </FormSubmit>
          </div>
        )}
      </Form>
    )}
  </ApiForm>
)

SaveExerciseTypeForm.propTypes = {
  saveExerciseType: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isLoading: PropTypes.bool,
  isNested: PropTypes.bool,
}

export default connect(null, {
  saveExerciseType,
})(SaveExerciseTypeForm)
