import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getExerciseById } from '../../../reducers'
import { saveExerciseSet } from '../../../actions/exercises'

import ApiForm from '../forms/ApiForm'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'

const FORM_STATE_FIELDS = {
  DISTANCE: {
    fieldName: 'distance',
  },
  DISTANCE_UNIT: {
    fieldName: 'distanceUnit',
  },
  REPS: {
    fieldName: 'reps',
  },
  TIME: {
    fieldName: 'time',
  },
  TIME_UNIT: {
    fieldName: 'timeUnit',
  },
  WEIGHT: {
    fieldName: 'weight',
  },
  WEIGHT_UNIT: {
    fieldName: 'weightUnit',
  },
}

const AddSetModal = ({
  completedForm,
  exercise,
  exerciseId,
  saveExerciseSet,
}) => {
  const isDistanceExercise = exercise.type === 'Distance'
  const isRepsExercise = exercise.type === 'Reps'
  const isTimeExercise = exercise.type === 'Time'
  const isWeightExercise = exercise.type === 'Weight'
  const defaultDistanceUnit =
    exercise.sets.length > 0 ? exercise.sets[0].distanceUnit : 'mile'
  const defaultTimeUnit =
    exercise.sets.length > 0 ? exercise.sets[0].timeUnit : 'min'
  const defaultWeightUnit =
    exercise.sets.length > 0 ? exercise.sets[0].weightUnit : 'lb'

  return (
    <ApiForm
      apiFn={formData => {
        const timeValue = formData[FORM_STATE_FIELDS.TIME.fieldName]
        let timeMin = null

        if (timeValue) {
          const timeValueArr = timeValue.split('.')
          const sec = timeValueArr[1]
          const secMin = sec ? sec / 60 : 0
          timeMin = Number.parseInt(timeValueArr[0], 10) + secMin
        }

        saveExerciseSet(exerciseId, {
          ...formData,
          [FORM_STATE_FIELDS.TIME.fieldName]: timeMin,
        })
      }}
      completedForm={completedForm}
    >
      {({ isSaving, saveFormRef, submitToApi }) => (
        <Form
          ref={saveFormRef}
          defaults={{
            [FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]: defaultDistanceUnit,
            [FORM_STATE_FIELDS.TIME_UNIT.fieldName]: defaultTimeUnit,
            [FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName]: defaultWeightUnit,
          }}
          formFields={FORM_STATE_FIELDS}
        >
          {({ fields, handleChange }) => {
            return (
              <div className="add-set-form">
                {(isDistanceExercise || isTimeExercise) && (
                  <div className="add-set-form-distance-time">
                    {isDistanceExercise && (
                      <Fragment>
                        <FormGroup label="Distance">
                          <Input
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.DISTANCE.fieldName,
                                value
                              )
                            }
                            name="distance"
                            tabindex="1"
                            type="number"
                            value={
                              fields[FORM_STATE_FIELDS.DISTANCE.fieldName].value
                            }
                          />
                        </FormGroup>
                        <FormGroup label="Distance Unit">
                          <Input
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName,
                                value
                              )
                            }
                            name="distanceUnit"
                            tabindex="3"
                            type="text"
                            value={
                              fields[FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]
                                .value
                            }
                          />
                        </FormGroup>
                      </Fragment>
                    )}
                    <FormGroup hint="Enter min.seconds" label="Time">
                      <Input
                        handleChange={value =>
                          handleChange(FORM_STATE_FIELDS.TIME.fieldName, value)
                        }
                        name="time"
                        tabindex="2"
                        type="number"
                        value={fields[FORM_STATE_FIELDS.TIME.fieldName].value}
                      />
                    </FormGroup>
                    <FormGroup label="Time Unit">
                      <Input
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.TIME_UNIT.fieldName,
                            value
                          )
                        }
                        name="timeUnit"
                        tabindex="4"
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.TIME_UNIT.fieldName].value
                        }
                      />
                    </FormGroup>
                  </div>
                )}

                {(isRepsExercise || isWeightExercise) && (
                  <div className="add-set-form-weight">
                    {isWeightExercise && (
                      <Fragment>
                        <FormGroup label="Weight">
                          <Input
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.WEIGHT.fieldName,
                                value
                              )
                            }
                            name="weight"
                            tabindex="1"
                            type="number"
                            value={
                              fields[FORM_STATE_FIELDS.WEIGHT.fieldName].value
                            }
                          />
                        </FormGroup>
                        <FormGroup label="Weight Unit">
                          <Input
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName,
                                value
                              )
                            }
                            name="weightUnit"
                            tabindex="3"
                            type="text"
                            value={
                              fields[FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName]
                                .value
                            }
                          />
                        </FormGroup>
                      </Fragment>
                    )}
                    <FormGroup label="Reps">
                      <Input
                        handleChange={value =>
                          handleChange(FORM_STATE_FIELDS.REPS.fieldName, value)
                        }
                        name="reps"
                        tabindex="2"
                        type="number"
                        value={fields[FORM_STATE_FIELDS.REPS.fieldName].value}
                      />
                    </FormGroup>
                  </div>
                )}

                <FormSubmit handleSubmit={submitToApi} isLoading={isSaving}>
                  Save
                </FormSubmit>
              </div>
            )
          }}
        </Form>
      )}
    </ApiForm>
  )
}

AddSetModal.propTypes = {
  exercise: PropTypes.shape({
    sets: PropTypes.arrayOf(
      PropTypes.shape({
        distance: PropTypes.number,
        distanceUnit: PropTypes.string,
        timeUnit: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  saveExerciseSet: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  exerciseId: PropTypes.string.isRequired,
}

export default connect(
  (state, { exerciseId }) => ({
    exercise: getExerciseById(state, exerciseId),
  }),
  {
    saveExerciseSet,
  }
)(AddSetModal)
