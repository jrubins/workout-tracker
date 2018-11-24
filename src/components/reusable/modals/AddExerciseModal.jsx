import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import cn from 'classnames'

import { createExercise } from '../../../utils/api/exercises'

import { UserContext } from '../../contexts'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ExerciseTypeSelect from '../forms/selects/exerciseTypes/ExerciseTypeSelect'
import SaveExerciseTypeForm from '../forms/exerciseTypes/SaveExerciseTypeForm'

const FORM_STATE_FIELDS = {
  EXERCISE_TYPE: {
    fieldName: 'exerciseType',
  },
}

const AddExerciseModal = ({ completedForm, date }) => {
  const [newExerciseFieldsVisible, setNewExerciseFieldsVisible] = useState(
    false
  )

  return (
    <UserContext.Consumer>
      {({ jwt }) => (
        <ApiForm
          apiFn={async data =>
            createExercise({
              data,
              date,
              jwt,
            })
          }
          completedForm={completedForm}
        >
          {({ isSaving, saveFormRef, submitToApi }) => (
            <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
              {({ fields, handleChange }) => (
                <div className="add-exercise-form">
                  <div className="add-exercise-form-tabs">
                    <a
                      className={cn('add-exercise-form-tab', {
                        'add-exercise-form-tab-active': !newExerciseFieldsVisible,
                      })}
                      onClick={() => {
                        setNewExerciseFieldsVisible(false)
                      }}
                    >
                      Existing
                    </a>
                    <a
                      className={cn('add-exercise-form-tab', {
                        'add-exercise-form-tab-active': newExerciseFieldsVisible,
                      })}
                      onClick={() => {
                        setNewExerciseFieldsVisible(true)
                      }}
                    >
                      New
                    </a>
                  </div>
                  {!newExerciseFieldsVisible && (
                    <>
                      <FormGroup label="Exercise">
                        <ExerciseTypeSelect
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

                      <FormSubmit
                        handleSubmit={submitToApi}
                        hasInlineLoader={false}
                        isLoading={isSaving}
                      >
                        {!isSaving && <CheckmarkIcon />}
                      </FormSubmit>
                    </>
                  )}

                  {newExerciseFieldsVisible && (
                    <SaveExerciseTypeForm
                      completedForm={data => {
                        handleChange(
                          FORM_STATE_FIELDS.EXERCISE_TYPE.fieldName,
                          data.id
                        )

                        return submitToApi()
                      }}
                      isLoading={isSaving}
                      isNested={true}
                    />
                  )}
                </div>
              )}
            </Form>
          )}
        </ApiForm>
      )}
    </UserContext.Consumer>
  )
}

AddExerciseModal.propTypes = {
  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default AddExerciseModal
