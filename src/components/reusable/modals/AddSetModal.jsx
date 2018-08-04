import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getExerciseById } from '../../../reducers'
import { saveExerciseSet } from '../../../actions/exercises'

import ApiForm from '../forms/ApiForm'
import DistanceUnitSelect from '../forms/selects/DistanceUnitSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import Input from '../forms/fields/Input'
import WeightUnitSelect from '../forms/selects/WeightUnitSelect'

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
  const { type } = exercise.exerciseType
  const isDistanceExercise = type === 'Distance'
  const isRepsExercise = type === 'Reps'
  const isTimeExercise = type === 'Time'
  const isWeightExercise = type === 'Weight'
  const defaultDistanceUnit =
    exercise.sets.length > 0 ? exercise.sets[0].distanceUnit : 'mile'
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
          [FORM_STATE_FIELDS.TIME_UNIT.fieldName]: 'min',
        })
      }}
      completedForm={completedForm}
    >
      {({ isSaving, saveFormRef, submitToApi }) => (
        <Form
          ref={saveFormRef}
          defaults={{
            [FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]: defaultDistanceUnit,
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
                      <FormGroup label="Distance">
                        <div className="add-set-form-group">
                          <Input
                            autoFocus={true}
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

                          <DistanceUnitSelect
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName,
                                value
                              )
                            }
                            name="distanceUnit"
                            tabindex="3"
                            value={
                              fields[FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]
                                .value
                            }
                          />
                        </div>
                      </FormGroup>
                    )}
                    <FormGroup label="Time (min.sec)">
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
                  </div>
                )}

                {(isRepsExercise || isWeightExercise) && (
                  <div className="add-set-form-weight">
                    {isWeightExercise && (
                      <FormGroup label="Weight">
                        <div className="add-set-form-group">
                          <Input
                            autoFocus={true}
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

                          <WeightUnitSelect
                            handleChange={value =>
                              handleChange(
                                FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName,
                                value
                              )
                            }
                            name="weightUnit"
                            tabindex="3"
                            value={
                              fields[FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName]
                                .value
                            }
                          />
                        </div>
                      </FormGroup>
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
