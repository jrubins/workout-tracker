import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import cn from 'classnames'

import { KEYCODES } from '../../../utils/keyboard'
import { MODAL_TYPES } from '../../../utils/modals'
import { warn } from '../../../utils/logs'

import { getModalOpts, isModalOpen } from '../../../reducers'
import { closeModal } from '../../../actions/modal'

import AddExerciseModal from './AddExerciseModal'
import AddSetModal from './AddSetModal'
import AddWeightModal from './AddWeightModal'
import Overlay from '../overlays/Overlay'
import OverlayClose from '../overlays/OverlayClose'

class Modal extends Component {
  constructor(props) {
    super(props)

    this.previousScrollYPosition = 0

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentDidUpdate(prevProps) {
    const { isOpen: prevIsOpen } = prevProps
    const { isOpen: newIsOpen } = this.props

    if (!prevIsOpen && newIsOpen) {
      this.previousScrollYPosition = window.pageYOffset
      window.scrollTo(0, 0)
    } else if (prevIsOpen && !newIsOpen) {
      window.scrollTo(0, this.previousScrollYPosition)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Handles a keydown event.
   *
   * @param {SyntheticEvent} event
   */
  handleKeyDown(event) {
    // Close our modal if the user pressed the Escape key. We don't want to close it if they pressed
    // that key on an input though because they were probably canceling something.
    if (
      event.target &&
      event.target.tagName !== 'INPUT' &&
      event.keyCode === KEYCODES.ESCAPE
    ) {
      this.closeModal()
    }
  }

  /**
   * Renders modal content.
   *
   * @returns {React.Element}
   */
  renderModalContent() {
    const { isOpen, modalOpts } = this.props

    // If by any chance the MODAL_TYPES.WHATEVER constant below is undefined, we don't want to return that
    // block - e.g. if MODAL_TYPES.DELETE_CUSTOMER_ADDRESS value was undefined and modalOpts.type was undefined,
    // we'd always return DeleteCustomerAddressModal, which is wrong. If the modal is supposed to be open, we'll
    // output a warning as well to let the user know what's going on.
    if (!modalOpts.type) {
      if (isOpen) {
        warn(
          'It appears as if you are trying to open a modal without a corresponding MODAL_TYPE. Check utils.modals to make sure you defined the MODAL_TYPE.'
        )
      }

      return null
    }

    switch (modalOpts.type) {
      case MODAL_TYPES.ADD_EXERCISE:
        return (
          <AddExerciseModal
            {..._.pick(modalOpts, ['date'])}
            completedForm={() => this.closeModal()}
          />
        )

      case MODAL_TYPES.ADD_SET:
        return (
          <AddSetModal
            {..._.pick(modalOpts, ['exerciseId'])}
            completedForm={() => this.closeModal()}
          />
        )

      case MODAL_TYPES.ADD_WEIGHT:
        return (
          <AddWeightModal
            {..._.pick(modalOpts, ['date'])}
            completedForm={() => this.closeModal()}
          />
        )

      default:
        return null
    }
  }

  /**
   * Returns whether or not the modal should be forced to stay open.
   *
   * @returns {Boolean}
   */
  isModalForcedOpen() {
    const { modalOpts } = this.props
    const forceOpen = _.get(modalOpts, 'forceOpen', false)

    return forceOpen
  }

  /**
   * Closes the modal if it can be closed.
   *
   * @param {String} forceCloseContent
   */
  closeModal(forceCloseContent = null) {
    const { closeModal, modalOpts } = this.props

    if (
      // Modal is forced open and there's no force close provided.
      (this.isModalForcedOpen() && !forceCloseContent) ||
      // Force close was provided, but it doesn't equal the current modal content.
      (forceCloseContent && forceCloseContent !== modalOpts.type)
    ) {
      return
    }

    closeModal()
  }

  render() {
    const { isOpen, modalOpts } = this.props
    const isClearModal = _.get(modalOpts, 'clearModal', false)
    const isFluidModal = _.get(modalOpts, 'fluidModal', false)
    const noOverlayClose = _.get(modalOpts, 'noOverlayClose', false)

    return (
      <div
        className={cn({
          'modal-clear': isClearModal,
          'modal-fluid': isFluidModal,
          'modal-open': isOpen || this.isModalForcedOpen(),
        })}
      >
        <Overlay
          handleClick={() => {
            // We may not allow clicks on the overlay to cause the modal to close.
            if (!noOverlayClose) {
              this.closeModal()
            }
          }}
        />
        <div className="modal" onKeyPress={this.handleKeyUp}>
          {!this.isModalForcedOpen() && (
            <OverlayClose handleClick={() => this.closeModal()} />
          )}
          <div className="modal-content">{this.renderModalContent()}</div>
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalOpts: PropTypes.object,
}

export default connect(
  state => ({
    isOpen: isModalOpen(state),
    modalOpts: getModalOpts(state),
  }),
  {
    closeModal,
  }
)(Modal)
