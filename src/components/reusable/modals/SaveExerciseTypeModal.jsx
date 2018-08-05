import React from 'react'
import PropTypes from 'prop-types'

import SaveExerciseTypeForm from '../forms/exerciseTypes/SaveExerciseTypeForm'

const SaveExerciseTypeModal = ({ completedForm, exerciseType }) => (
  <SaveExerciseTypeForm
    completedForm={completedForm}
    initialData={exerciseType}
  />
)

SaveExerciseTypeModal.propTypes = {
  completedForm: PropTypes.func.isRequired,
  exerciseType: PropTypes.object,
}

export default SaveExerciseTypeModal
