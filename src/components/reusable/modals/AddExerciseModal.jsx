import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import { saveExercise } from '../../../actions/exercises'

import ApiForm from '../forms/ApiForm'
import CheckmarkIcon from '../icons/CheckmarkIcon'
import ExerciseTypeSelect from '../forms/selects/exerciseTypes/ExerciseTypeSelect'
import Form from '../forms/Form'
import FormGroup from '../forms/FormGroup'
import FormSubmit from '../forms/FormSubmit'
import SaveExerciseTypeForm from '../forms/exerciseTypes/SaveExerciseTypeForm'

const FORM_STATE_FIELDS = {
  EXERCISE_TYPE: {
    fieldName: 'exerciseType',
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
    const { completedForm, date, saveExercise } = this.props
    const { newExerciseFieldsVisible } = this.state

    return (
      <ApiForm
        apiFn={async formData =>
          saveExercise({
            ...formData,
            date,
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
                  <Fragment>
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
                  </Fragment>
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
    )
  }
}

AddExerciseModal.propTypes = {
  saveExercise: PropTypes.func.isRequired,

  completedForm: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
}

export default connect(null, {
  saveExercise,
})(AddExerciseModal)
