import React from 'react'
import { useTranslation } from 'react-i18next'

import { IconWithText } from '../icon-with-text/IconWithText'
import { ErrorBlock } from '../error-block/ErrorBlock'

import styles from './mutationFeedback.module.scss'

import { RoundCheckGreenIcon } from '@/assets/images'

interface MutationFeedbackProps {
    success: boolean
    error: { errorTitle: string; errorMessage: string; buttons?: { label: string; onClick: () => void }[] }
}

export const MutationFeedback: React.FC<MutationFeedbackProps> = ({ success, error }) => {
    const { t } = useTranslation()
    return (
        <>
            {success && (
                <IconWithText icon={RoundCheckGreenIcon}>
                    <div className={styles.successText}>{t('mutationFeedback.successfulUpdated')}</div>
                </IconWithText>
            )}
            {error && <ErrorBlock errorTitle={error.errorTitle} errorMessage={error.errorMessage} buttons={error.buttons} />}
        </>
    )
}
