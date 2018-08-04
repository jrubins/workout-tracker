import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import { saveExercise } from '../../../actions/exercises'
import { saveExerciseType } from '../../../actions/exerciseTypes'

import ApiForm from '../forms/ApiForm'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ExerciseExerciseTypeSelect from '../forms/selects/ExerciseTypeSelect'
import ExerciseTypeSelect from '../forms/selects/exerciseTypes/ExerciseTypeSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'
import MuscleGroupCheckboxes from '../forms/muscleGroups/MuscleGroupCheckboxes'
import Textarea from '../forms/fields/Textarea'

const FORM_STATE_FIELDS = {
  EXERCISE_DESCRIPTION: {
    fieldName: 'description',
  },
  EXERCISE_EXERCISE_TYPE: {
    fieldName: 'exerciseType',
  },
  EXERCISE_MUSCLE_GROUPS: {
    fieldName: 'muscleGroups',
  },
  EXERCISE_NAME: {
    fieldName: 'name',
  },
  EXERCISE_TYPE: {
    fieldName: 'type',
  },
  EXERCISE_VARIATION: {
    fieldName: 'variation',
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
          let saveExerciseTypeResult

          if (newExerciseFieldsVisible) {
            saveExerciseTypeResult = await saveExerciseType({
              description:
                formData[FORM_STATE_FIELDS.EXERCISE_DESCRIPTION.fieldName],
              muscleGroups:
                formData[FORM_STATE_FIELDS.EXERCISE_MUSCLE_GROUPS.fieldName],
              name: formData[FORM_STATE_FIELDS.EXERCISE_NAME.fieldName],
              type: formData[FORM_STATE_FIELDS.EXERCISE_TYPE.fieldName],
              variation:
                formData[FORM_STATE_FIELDS.EXERCISE_VARIATION.fieldName],
            })
          }

          return saveExercise({
            date,
            exerciseType: newExerciseFieldsVisible
              ? saveExerciseTypeResult.id
              : formData[FORM_STATE_FIELDS.EXERCISE_EXERCISE_TYPE.fieldName].id,
          })
        }}
        completedForm={completedForm}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form
            ref={saveFormRef}
            defaults={{
              [FORM_STATE_FIELDS.EXERCISE_TYPE.fieldName]: 'Weight',
            }}
            formFields={FORM_STATE_FIELDS}
          >
            {({ fields, handleChange }) => (
              <div className="add-exercise-form">
                <div className="add-exercise-form-tabs">
                  <a
                    className={cn('add-exercise-form-tab', {
                      'add-exercise-form-tab-active': !newExerciseFieldsVisible,
                    })}
                    onClick={() => {
                      this.setState({
                        newExerciseFieldsVisible: false,
                      })
                    }}
                  >
                    Existing
                  </a>
                  <a
                    className={cn('add-exercise-form-tab', {
                      'add-exercise-form-tab-active': newExerciseFieldsVisible,
                    })}
                    onClick={() => {
                      this.setState({
                        newExerciseFieldsVisible: true,
                      })
                    }}
                  >
                    New
                  </a>
                </div>
                {!newExerciseFieldsVisible && (
                  <FormGroup label="Exercise">
                    <ExerciseTypeSelect
                      handleChange={value =>
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_EXERCISE_TYPE.fieldName,
                          value
                        )
                      }
                      name="exerciseType"
                      value={
                        fields[
                          FORM_STATE_FIELDS.EXERCISE_EXERCISE_TYPE.fieldName
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
                            FORM_STATE_FIELDS.EXERCISE_NAME.fieldName,
                            value
                          )
                        }
                        name="exerciseName"
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.EXERCISE_NAME.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Variation">
                      <Input
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.EXERCISE_VARIATION.fieldName,
                            value
                          )
                        }
                        name="exerciseVariation"
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.EXERCISE_VARIATION.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Type">
                      <ExerciseExerciseTypeSelect
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.EXERCISE_TYPE.fieldName,
                            value
                          )
                        }
                        name="exerciseType"
                        value={
                          fields[FORM_STATE_FIELDS.EXERCISE_TYPE.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Description">
                      <Textarea
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.EXERCISE_DESCRIPTION.fieldName,
                            value
                          )
                        }
                        name="exerciseDescription"
                        value={
                          fields[
                            FORM_STATE_FIELDS.EXERCISE_DESCRIPTION.fieldName
                          ].value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Muscle Groups">
                      <MuscleGroupCheckboxes
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.EXERCISE_MUSCLE_GROUPS.fieldName,
                            value
                          )
                        }
                        value={
                          fields[
                            FORM_STATE_FIELDS.EXERCISE_MUSCLE_GROUPS.fieldName
                          ].value
                        }
                      />
                    </FormGroup>
                  </div>
                )}

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
  saveExercise: PropTypes.func.isRequired,
  saveExerciseType: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(null, {
  saveExercise,
  saveExerciseType,
})(AddExerciseModal)
