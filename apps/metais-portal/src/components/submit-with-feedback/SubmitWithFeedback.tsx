import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './submitWithFeedback.module.scss'

import { Button } from '@metais-web/idsk-ui-kit'
import { SubmitIndicator } from '@portal/components/submit-indicator/SubmitIndicator'
import { ButtonGroupRow } from '@portal/components/layouts/button-group-row/ButtonGroupRow'
import { LoadingArrow } from '@portal/assets/images'

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
            {loading && <SubmitIndicator loadingLabel={t('form.waitSending')} icon={LoadingArrow} loadingLabelClassName={styles.loadingText} />}
        </ButtonGroupRow>
    )
}
