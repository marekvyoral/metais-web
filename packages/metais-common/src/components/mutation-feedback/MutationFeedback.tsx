import React from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { RoundCheckGreenIcon } from '@isdd/idsk-ui-kit/assets/images'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'

import styles from './mutationFeedback.module.scss'

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
