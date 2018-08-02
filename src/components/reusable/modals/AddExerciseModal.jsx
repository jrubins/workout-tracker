import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { saveExercise } from '../../../actions/exercises'
import { saveExerciseType } from '../../../actions/exerciseTypes'

import ApiForm from '../forms/ApiForm'
import ExerciseNameSelect from '../forms/selects/ExerciseNameSelect'
import ExerciseTypeSelect from '../forms/selects/ExerciseTypeSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'
import Textarea from '../forms/fields/Textarea'

const FORM_STATE_FIELDS = {
  EXISTING_EXERCISE_NAME: {
    fieldName: 'existingExerciseName',
  },
  NEW_EXERCISE_DESCRIPTION: {
    fieldName: 'newExerciseDescription',
  },
  NEW_EXERCISE_NAME: {
    fieldName: 'newExerciseName',
  },
  NEW_EXERCISE_TYPE: {
    fieldName: 'newExerciseType',
  },
}

class AddExerciseModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newExerciseFieldsVisible: false,
    }
  }

  render() {
    const { completedForm, date, saveExercise, saveExerciseType } = this.props
    const { newExerciseFieldsVisible } = this.state

    return (
      <ApiForm
        apiFn={async formData => {
          const isNewExerciseType = !formData[
            FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName
          ]
          let saveExerciseTypeResult

          if (isNewExerciseType) {
            saveExerciseTypeResult = await saveExerciseType({
              description:
                formData[FORM_STATE_FIELDS.NEW_EXERCISE_DESCRIPTION.fieldName],
              muscleGroups: ['Abs'],
              name: formData[FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName],
              type: formData[FORM_STATE_FIELDS.NEW_EXERCISE_TYPE.fieldName],
              variation: 'variation 1',
            })
          }

          return saveExercise({
            date,
            exerciseType: isNewExerciseType
              ? saveExerciseTypeResult.id
              : formData[FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName],
          })
        }}
        completedForm={completedForm}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form
            ref={saveFormRef}
            defaults={{
              [FORM_STATE_FIELDS.NEW_EXERCISE_TYPE.fieldName]: 'Weight',
            }}
            formFields={FORM_STATE_FIELDS}
          >
            {({ fields, handleChange }) => (
              <div className="add-exercise-form">
                {!newExerciseFieldsVisible && (
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
                        fields[
                          FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName
                        ].value
                      }
                    />
                  </FormGroup>
                )}

                {newExerciseFieldsVisible && (
                  <div className="add-exercise-form-new-exercise">
                    <FormGroup label="Name">
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
                          fields[FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Type">
                      <ExerciseTypeSelect
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.NEW_EXERCISE_TYPE.fieldName,
                            value
                          )
                        }
                        name="newExerciseType"
                        value={
                          fields[FORM_STATE_FIELDS.NEW_EXERCISE_TYPE.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Description">
                      <Textarea
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.NEW_EXERCISE_DESCRIPTION
                              .fieldName,
                            value
                          )
                        }
                        name="newExerciseDescription"
                        value={
                          fields[
                            FORM_STATE_FIELDS.NEW_EXERCISE_DESCRIPTION.fieldName
                          ].value
                        }
                      />
                    </FormGroup>
                  </div>
                )}

                <a
                  className="add-exercise-form-change-fields-link"
                  onClick={() => {
                    this.setState({
                      newExerciseFieldsVisible: !newExerciseFieldsVisible,
                    })
                  }}
                >
                  {newExerciseFieldsVisible ? 'Back' : '+ New Exercise'}
                </a>

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
  saveExercise: PropTypes.func.isRequired,
  saveExerciseType: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(null, {
  saveExercise,
  saveExerciseType,
})(AddExerciseModal)
