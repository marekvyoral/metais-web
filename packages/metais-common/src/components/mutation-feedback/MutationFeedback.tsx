import { RoundCheckGreenIcon } from '@isdd/idsk-ui-kit/assets/images'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { v4 as uuidV4 } from 'uuid'
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
    success: boolean
    successMessage?: string
    error: React.ReactNode
    showSupportEmail?: boolean
    onMessageClose?: () => void
    successMessageClassName?: string
}

export const MutationFeedback: React.FC<MutationFeedbackProps> = ({
    success,
    error,
    showSupportEmail,
    successMessage,
    onMessageClose,
    successMessageClassName,
}) => {
    const { t } = useTranslation()
    const labelId = `${uuidV4()}-label`
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
        <div className={styles.inline}>
            {success && (
                <IconWithText icon={RoundCheckGreenIcon}>
                    <div aria-live="assertive" className={classNames(styles.successText, successMessageClassName)}>
                        {successMessage || t('mutationFeedback.successfulUpdated')}
                    </div>
                </IconWithText>
            )}
            {error && (
                <TextWarning aria-live="assertive">
                    <div className={styles.column}>
                        {error}
                        {showSupportEmail && <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>}
                    </div>
                </TextWarning>
            )}
            <Spacer horizontal />
            {(success || error) && (
                <div className={classNames(styles.closeIconWrapper, 'govuk-body')}>
                    <TransparentButtonWrapper onClick={closeMessage} aria-labelledby={labelId}>
                        <span id={labelId} className="govuk-visually-hidden">
                            {success ? successMessage || t('mutationFeedback.successfulUpdated') : error}
                        </span>
                        <img src={CloseIcon} className={styles.closeIcon} alt={t('closeFeedback')} lang="sk" />
                    </TransparentButtonWrapper>
                </div>
            )}
        </div>
    ) : (
        <></>
    )
}
