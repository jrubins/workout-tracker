import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getExercises } from '../../../reducers'
import { saveExercise } from '../../../actions/exercises'

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
    const { completedForm, date, exercises, saveExercise } = this.props
    const { newExerciseFieldsVisible } = this.state

    return (
      <ApiForm
        apiFn={formData => {
          const existingExerciseName =
            formData[FORM_STATE_FIELDS.EXISTING_EXERCISE_NAME.fieldName]
          const existingExercise = _.find(exercises, {
            name: existingExerciseName,
          })

          return saveExercise({
            date,
            description: existingExercise
              ? existingExercise.description
              : formData[FORM_STATE_FIELDS.NEW_EXERCISE_DESCRIPTION.fieldName],
            // Prefer an existing exercise name and fallback to a new one.
            name: existingExercise
              ? existingExercise.name
              : formData[FORM_STATE_FIELDS.NEW_EXERCISE_NAME.fieldName],
            type: existingExercise
              ? existingExercise.type
              : formData[FORM_STATE_FIELDS.NEW_EXERCISE_TYPE.fieldName],
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
  exercises: PropTypes.array.isRequired,
  saveExercise: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(
  state => ({
    exercises: getExercises(state),
  }),
  {
    saveExercise,
  }
)(AddExerciseModal)
