import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ApiForm from '@jrubins/react-components/lib/forms/ApiForm'
import Form from '@jrubins/react-components/lib/forms/Form'
import FormGroup from '@jrubins/react-components/lib/forms/FormGroup'
import FormSubmit from '@jrubins/react-components/lib/forms/FormSubmit'
import Input from '@jrubins/react-components/lib/forms/fields/Input'
import Modal from '@jrubins/react-components/lib/modals/Modal'

import { createWeight } from '../../../utils/api/weight'

import { UserContext } from '../../contexts'
import CheckmarkIcon from '../icons/CheckmarkIcon'

const FORM_STATE_FIELDS = {
  WEIGHT: {
    fieldName: 'weight',
  },
}

const AddWeightModal = ({ closeModal, date, isOpen }) => {
  const firstInput = useRef(null)
  const { jwt } = useContext(UserContext)

  useEffect(
    () => {
      if (isOpen) {
        firstInput.current.focus()
      }
    },
    [isOpen]
  )

  return (
    <Modal closeModal={closeModal} isOpen={isOpen}>
      <ApiForm
        apiFn={formData =>
          createWeight({
            data: {
              ...formData,
              date,
            },
            jwt,
          })
        }
        completedForm={closeModal}
        resetOnSuccess={true}
      >
        {({ isSaving, saveFormRef, submitToApi }) => (
          <Form ref={saveFormRef} formFields={FORM_STATE_FIELDS}>
            {({ fields, handleChange }) => (
              <div className="add-weight-form">
                <FormGroup label="Weight">
                  <Input
                    ref={firstInput}
                    handleChange={value =>
                      handleChange(FORM_STATE_FIELDS.WEIGHT.fieldName, value)
                    }
                    name="weight"
                    type="number"
                    value={fields[FORM_STATE_FIELDS.WEIGHT.fieldName].value}
                  />
                </FormGroup>

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
    </Modal>
  )
}

AddWeightModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default AddWeightModal
