import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { LoadingArrowIcon } from '@isdd/idsk-ui-kit/assets/images'

import styles from './submitWithFeedback.module.scss'

import { IconWithText } from '@isdd/metais-common/icon-with-text/IconWithText'
import { ButtonGroupRow } from '@isdd/metais-common/layouts/button-group-row/ButtonGroupRow'

interface ISubmitWithFeedbackProps {
    additionalButtons?: React.ReactNode[]
    submitButtonLabel: string
    loading: boolean
}
export const SubmitWithFeedback: React.FC<ISubmitWithFeedbackProps> = ({ submitButtonLabel, loading, additionalButtons }) => {
    const { t } = useTranslation()
    return (
        <ButtonGroupRow>
            {additionalButtons}
            <Button label={submitButtonLabel} disabled={loading} type="submit" />
            {loading && (
                <IconWithText icon={LoadingArrowIcon}>
                    <div className={styles.loadingText}>{t('form.waitSending')}</div>
                </IconWithText>
            )}
        </ButtonGroupRow>
    )
}
