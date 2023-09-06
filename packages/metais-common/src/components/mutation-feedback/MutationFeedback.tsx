import React from 'react'
import { useTranslation } from 'react-i18next'
import { RoundCheckGreenIcon } from '@isdd/idsk-ui-kit/assets/images'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'
import { TextWarning } from '@isdd/idsk-ui-kit/src/typography/TextWarning'

import styles from './mutationFeedback.module.scss'

export interface MutationFeedbackError {
    errorTitle: string
    errorMessage: string
    buttons?: { label: string; onClick: () => void }[]
}

interface MutationFeedbackProps {
    success: boolean
    successMessage?: string
    error: React.ReactNode
}

export const MutationFeedback: React.FC<MutationFeedbackProps> = ({ success, error, successMessage }) => {
    const { t } = useTranslation()
    return (
        <>
            {success && (
                <IconWithText icon={RoundCheckGreenIcon}>
                    <div className={styles.successText}>{successMessage || t('mutationFeedback.successfulUpdated')}</div>
                </IconWithText>
            )}
            {error && <TextWarning>{error}</TextWarning>}
        </>
    )
}
