import { Button } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './userView.module.scss'

interface Props {
    handleBackNavigate: () => void
    handleResetForm: () => void
    isError: boolean
    hideCancelButton?: boolean
    saveButtonLabel?: string
}

export const UserManagementFormButtons: React.FC<Props> = ({ handleBackNavigate, handleResetForm, isError, hideCancelButton, saveButtonLabel }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.formButtonsWrapper}>
            <Button label={saveButtonLabel ?? t('managementList.save')} type="submit" disabled={isError} />
            {!hideCancelButton && (
                <Button
                    className={styles.cancelButton}
                    variant="warning"
                    label={t('managementList.cancel')}
                    type="reset"
                    onClick={() => {
                        handleResetForm()
                        handleBackNavigate()
                    }}
                />
            )}
            <Button className={styles.backButton} variant="secondary" label={t('managementList.back')} onClick={handleBackNavigate} />
        </div>
    )
}
