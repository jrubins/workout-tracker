import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@jrubins/react-components/lib/modals/Modal'

import SaveExerciseTypeForm from '../forms/exerciseTypes/SaveExerciseTypeForm'

const SaveExerciseTypeModal = ({ closeModal, exerciseType, isOpen }) => (
  <Modal closeModal={closeModal} isOpen={isOpen}>
    <SaveExerciseTypeForm
      completedForm={() => closeModal({ exerciseModified: true })}
      initialData={exerciseType}
    />
  </Modal>
)

SaveExerciseTypeModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  exerciseType: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
}

export default SaveExerciseTypeModal
