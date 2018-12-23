import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Button from '@jrubins/react-components/lib/forms/fields/Button'
import Modal from '@jrubins/react-components/lib/modals/Modal'

import { deleteExercise } from '../../../utils/api/exercises'

import { UserContext } from '../../contexts'
import { useApiRequest } from '../../hooks'

const DeleteExerciseModal = ({ closeModal, exerciseId, isOpen }) => {
  const { jwt } = useContext(UserContext)
  const { isLoading, makeApiRequest } = useApiRequest({
    apiFn: async () => {
      await deleteExercise({ id: exerciseId, jwt })
      closeModal({ exerciseDeleted: true })
    },
  })

  return (
    <div className="delete-exercise-modal">
      <Modal closeModal={closeModal} isOpen={isOpen}>
        <p>
          Are you sure you'd like to <br />
          delete this exercise?
        </p>
        <div className="delete-exercise-modal-submit">
          <Button
            handleClick={makeApiRequest}
            isDisabled={isLoading}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

DeleteExerciseModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  exerciseId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default DeleteExerciseModal
