import { LoadingArrowIcon } from '@isdd/idsk-ui-kit/assets/images'
import { ButtonGroupRow } from '@isdd/idsk-ui-kit/button-group-row/ButtonGroupRow'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { IconWithText } from '@isdd/idsk-ui-kit/icon-with-text/IconWithText'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './submitWithFeedback.module.scss'

interface ISubmitWithFeedbackProps {
    additionalButtons?: React.ReactNode[]
    submitButtonLabel: string
    disabled?: boolean
    loading: boolean
    className?: string
    variant?: 'secondary' | 'warning'
}
export const SubmitWithFeedback: React.FC<ISubmitWithFeedbackProps> = ({
    submitButtonLabel,
    className,
    loading,
    disabled,
    additionalButtons,
    variant,
}) => {
    const { t } = useTranslation()
    return (
        <ButtonGroupRow className={className}>
            {additionalButtons}
            <Button variant={variant} label={submitButtonLabel} disabled={loading || disabled} type="submit" />
            {loading && (
                <IconWithText icon={LoadingArrowIcon}>
                    <div className={styles.loadingText}>{t('form.waitSending')}</div>
                </IconWithText>
            )}
        </ButtonGroupRow>
    )
}
