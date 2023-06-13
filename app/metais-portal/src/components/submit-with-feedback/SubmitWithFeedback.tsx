import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@isdd/idsk-ui-kit/button/Button'

import styles from './submitWithFeedback.module.scss'

import { SubmitIndicator } from '@/components/submit-indicator/SubmitIndicator'
import { ButtonGroupRow } from '@/components/layouts/button-group-row/ButtonGroupRow'
import { LoadingArrowIcon } from '@/assets/images'

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
            {loading && <SubmitIndicator loadingLabel={t('form.waitSending')} icon={LoadingArrowIcon} loadingLabelClassName={styles.loadingText} />}
        </ButtonGroupRow>
    )
}