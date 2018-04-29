import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

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
  const noSets = exercise.sets.length === 0
  const hasDistance = _.findKey(exercise.sets, 'distance')

  return (
    <ApiForm
      apiFn={formData => {
        const timeValue = formData[FORM_STATE_FIELDS.TIME.fieldName]
        let timeMin = null

        if (timeValue) {
          const timeValueArr = timeValue.split('.')
          const sec = timeValueArr[1]
          const secMin = sec / 60
          timeMin = Number.parseInt(timeValueArr[0], 10) + secMin
        }

        saveExerciseSet(exerciseId, {
          [FORM_STATE_FIELDS.TIME.fieldName]: timeMin,
          ...formData,
        })
      }}
      completedForm={completedForm}
    >
      {({ isSaving, saveFormRef, submitToApi }) => (
        <Form
          ref={saveFormRef}
          defaults={{
            [FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]: hasDistance
              ? exercise.sets[0].distanceUnit
              : null,
            [FORM_STATE_FIELDS.TIME_UNIT.fieldName]: hasDistance
              ? exercise.sets[0].timeUnit
              : null,
          }}
          formFields={FORM_STATE_FIELDS}
        >
          {({ fields, handleChange }) => {
            return (
              <div>
                {(hasDistance || noSets) && (
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
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]
                            .value
                        }
                      />
                    </FormGroup>
                    <FormGroup label="Time">
                      <Input
                        handleChange={value =>
                          handleChange(FORM_STATE_FIELDS.TIME.fieldName, value)
                        }
                        name="time"
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
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.TIME_UNIT.fieldName].value
                        }
                      />
                    </FormGroup>
                  </Fragment>
                )}

                {(!hasDistance || noSets) && (
                  <Fragment>
                    <FormGroup label="Reps">
                      <Input
                        handleChange={value =>
                          handleChange(FORM_STATE_FIELDS.REPS.fieldName, value)
                        }
                        name="reps"
                        type="number"
                        value={fields[FORM_STATE_FIELDS.REPS.fieldName].value}
                      />
                    </FormGroup>
                    <FormGroup label="Weight">
                      <Input
                        handleChange={value =>
                          handleChange(
                            FORM_STATE_FIELDS.WEIGHT.fieldName,
                            value
                          )
                        }
                        name="weight"
                        type="number"
                        value={fields[FORM_STATE_FIELDS.WEIGHT.fieldName].value}
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
                        type="text"
                        value={
                          fields[FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName].value
                        }
                      />
                    </FormGroup>
                  </Fragment>
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
