import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Button from '@jrubins/react-components/lib/forms/fields/Button'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import Input from '@jrubins/react-components/lib/forms/fields/Input'
import Modal from '@jrubins/react-components/lib/modals/Modal'

import {
  createExerciseSet,
  deleteExerciseSet,
  editExerciseSet,
} from '../../../utils/api/exercises'

import { UserContext } from '../../contexts'
import { useApiRequest } from '../../hooks'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import DistanceUnitSelect from '../forms/selects/DistanceUnitSelect'
import TrashIcon from '../icons/TrashIcon'
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

const SaveSetModal = ({
  closeModal,
  exerciseId,
  exerciseType,
  existingSet,
  isOpen,
  sets,
}) => {
  const { category } = exerciseType
  const existingId = _.get(existingSet, '_id')
  const isDistanceExercise = category === 'Distance'
  const isRepsExercise = category === 'Reps'
  const isTimeExercise = category === 'Time'
  const isWeightExercise = category === 'Weight'
  const defaultDistanceUnit = sets.length > 0 ? sets[0].distanceUnit : 'mile'
  const defaultWeightUnit = sets.length > 0 ? sets[0].weightUnit : 'lb'
  const { jwt } = useContext(UserContext)
  const { isLoading: isDeleting, makeApiRequest: deleteSet } = useApiRequest({
    apiFn: async () => {
      const deleteExerciseSetResult = await deleteExerciseSet({
        exerciseId,
        jwt,
        setId: existingId,
      })
      closeModal({ setModified: true })

      return deleteExerciseSetResult
    },
  })

  return (
    <Modal closeModal={closeModal} isOpen={isOpen}>
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

          const opts = {
            exerciseId,
            data: {
              ...formData,
              id: existingId,
              [FORM_STATE_FIELDS.TIME.fieldName]: timeMin,
              [FORM_STATE_FIELDS.TIME_UNIT.fieldName]: 'min',
            },
            jwt,
          }

          if (existingId) {
            return editExerciseSet(opts)
          }

          return createExerciseSet(opts)
        }}
        completedForm={() => closeModal({ setModified: true })}
        resetOnSuccess={true}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form
            ref={saveFormRef}
            defaults={{
              [FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName]: defaultDistanceUnit,
              [FORM_STATE_FIELDS.WEIGHT_UNIT.fieldName]: defaultWeightUnit,
            }}
            formFields={FORM_STATE_FIELDS}
            initialData={existingSet}
          >
            {({ fields, handleChange }) => {
              return (
                <div className="save-set-form">
                  {(isDistanceExercise || isTimeExercise) && (
                    <div className="save-set-form-distance-time">
                      {isDistanceExercise && (
                        <FormGroup label="Distance">
                          <div className="save-set-form-group">
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
                                fields[FORM_STATE_FIELDS.DISTANCE.fieldName]
                                  .value
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
                                fields[
                                  FORM_STATE_FIELDS.DISTANCE_UNIT.fieldName
                                ].value
                              }
                            />
                          </div>
                        </FormGroup>
                      )}
                      <FormGroup label="Time (min.sec)">
                        <Input
                          autoFocus={!isDistanceExercise}
                          handleChange={value =>
                            handleChange(
                              FORM_STATE_FIELDS.TIME.fieldName,
                              value
                            )
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
                    <div className="save-set-form-weight">
                      {isWeightExercise && (
                        <FormGroup label="Weight">
                          <div className="save-set-form-group">
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
                          autoFocus={!isWeightExercise}
                          handleChange={value =>
                            handleChange(
                              FORM_STATE_FIELDS.REPS.fieldName,
                              value
                            )
                          }
                          name="reps"
                          tabindex="2"
                          type="number"
                          value={fields[FORM_STATE_FIELDS.REPS.fieldName].value}
                        />
                      </FormGroup>
                    </div>
                  )}

                  <div className="save-set-actions">
                    {existingId && (
                      <div className="save-set-actions-delete">
                        <Button
                          handleClick={deleteSet}
                          hasInlineLoader={false}
                          isDisabled={isDeleting}
                          isLoading={isDeleting}
                        >
                          {!isDeleting && <TrashIcon />}
                        </Button>
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
                </div>
              )
            }}
          </Form>
        )}
      </ApiForm>
    </Modal>
  )
}

SaveSetModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  exerciseType: PropTypes.shape({
    category: PropTypes.string.isRequired,
  }).isRequired,
  exerciseId: PropTypes.string.isRequired,
  existingSet: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  isOpen: PropTypes.bool.isRequired,
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      distance: PropTypes.number,
      distanceUnit: PropTypes.string,
    })
  ).isRequired,
}

export default SaveSetModal
