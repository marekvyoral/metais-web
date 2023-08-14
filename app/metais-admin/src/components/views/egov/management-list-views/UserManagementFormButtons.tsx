import { Button } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './userView.module.scss'

interface Props {
    handleBackNavigate: () => void
    handleResetForm: () => void
    isError: boolean
}

export const UserManagementFormButtons: React.FC<Props> = ({ handleBackNavigate, handleResetForm, isError }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.formButtonsWrapper}>
            <Button label={t('managementList.save')} type="submit" disabled={isError} />
            <Button className={styles.cancelButton} variant="warning" label={t('managementList.cancel')} type="reset" onClick={handleResetForm} />
            <Button className={styles.backButton} variant="secondary" label={t('managementList.back')} onClick={handleBackNavigate} />
        </div>
    )
}
