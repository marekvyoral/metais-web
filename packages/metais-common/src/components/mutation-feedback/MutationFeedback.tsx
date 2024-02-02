import { RoundCheckGreenIcon } from '@isdd/idsk-ui-kit/assets/images'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import styles from './mutationFeedback.module.scss'

import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { CloseIcon } from '@isdd/metais-common/assets/images'

export interface MutationFeedbackError {
    errorTitle: string
    errorMessage: string
    buttons?: { label: string; onClick: () => void }[]
}

interface MutationFeedbackProps {
    success: boolean
    successMessage?: string
    error: React.ReactNode
    onMessageClose?: () => void
}

export const MutationFeedback: React.FC<MutationFeedbackProps> = ({ success, error, successMessage, onMessageClose }) => {
    const { t } = useTranslation()
    const { clearAction } = useActionSuccess()
    const [show, setShow] = useState(true)
    const closeMessage = () => {
        onMessageClose?.()
        clearAction()
        setShow(false)
    }

    useEffect(() => {
        setShow(true)
    }, [success, error, successMessage])

    return show ? (
        <>
            <div className={styles.inline}>
                {success && (
                    <IconWithText icon={RoundCheckGreenIcon}>
                        <div className={styles.successText}>{successMessage || t('mutationFeedback.successfulUpdated')}</div>
                    </IconWithText>
                )}
                {error && <TextWarning>{error}</TextWarning>}
                <Spacer horizontal />
                {(success || error) && (
                    <div onClick={closeMessage} className={classNames(styles.closeIconWrapper, 'govuk-body')}>
                        <img src={CloseIcon} />
                    </div>
                )}
            </div>
        </>
    ) : (
        <></>
    )
}
