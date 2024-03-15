import { RoundCheckGreenIcon } from '@isdd/idsk-ui-kit/assets/images'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { TransparentButtonWrapper } from '@isdd/idsk-ui-kit'
import { Link } from 'react-router-dom'

import styles from './mutationFeedback.module.scss'

import { metaisEmail } from '@isdd/metais-common/constants'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { CloseIcon } from '@isdd/metais-common/assets/images'

export interface MutationFeedbackError {
    errorTitle: string
    errorMessage: string
    buttons?: { label: string; onClick: () => void }[]
}

interface MutationFeedbackProps {
    success?: boolean
    successMessage?: string
    error?: boolean
    errorMessage?: string
    onMessageClose?: () => void
    successMessageClassName?: string
}

export const MutationFeedback: React.FC<MutationFeedbackProps> = ({
    success,
    error,
    errorMessage,
    successMessage,
    onMessageClose,
    successMessageClassName,
}) => {
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
        <div className={styles.inline} role="alert">
            {success && (
                <IconWithText icon={RoundCheckGreenIcon}>
                    <div className={classNames(styles.successText, successMessageClassName)}>
                        {successMessage || t('mutationFeedback.successfulUpdated')}
                    </div>
                </IconWithText>
            )}
            {error && (
                <TextWarning>
                    <div className={styles.column}>
                        {errorMessage ?? (
                            <>
                                {t('feedback.mutationErrorMessage')}
                                <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>
                            </>
                        )}
                    </div>
                </TextWarning>
            )}
            <Spacer horizontal />
            {(success || error) && (
                <div className={classNames(styles.closeIconWrapper, 'govuk-body')}>
                    <TransparentButtonWrapper onClick={closeMessage} aria-label={t('closeFeedback')}>
                        <img src={CloseIcon} className={styles.closeIcon} alt="" />
                    </TransparentButtonWrapper>
                </div>
            )}
        </div>
    ) : (
        <></>
    )
}
