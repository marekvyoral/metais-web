import React, { PropsWithChildren } from 'react'
import Modal from 'react-modal'

import styles from './baseModal.module.scss'

import { NavigationCloseIcon } from '@isdd/idsk-ui-kit/assets/images'

interface IBaseModalProps extends PropsWithChildren {
    isOpen: boolean
    close: () => void
    widthInPx?: number
}

export const BaseModal: React.FC<IBaseModalProps> = ({ isOpen, close, children, widthInPx }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={close}
            className={styles.modalContent}
            overlayClassName={styles.customModalOverlay}
            ariaHideApp={false}
            style={{ content: { width: widthInPx } }}
        >
            <button className={styles.closeButton} onClick={close}>
                <img src={NavigationCloseIcon} alt="navigation-close" />
            </button>
            {children}
        </Modal>
    )
}
