import React from 'react'
import { Button, ButtonGroupRow, IconWithText, LoadingArrowIcon } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'

import styles from './modalButtons.module.scss'

interface IModalButtons {
    submitButtonLabel?: string
    submitButtonVariant?: 'secondary' | 'warning'
    closeButtonLabel?: string
    isLoading?: boolean
    disabled?: boolean
    additionalButtons?: React.ReactNode[]
    onClose?: () => void
    onSubmit?: () => void
}
export const ModalButtons: React.FC<IModalButtons> = ({
    onClose,
    onSubmit,
    isLoading,
    submitButtonLabel,
    closeButtonLabel,
    additionalButtons,
    disabled,
    submitButtonVariant,
}) => {
    const { t } = useTranslation()
    return (
        <>
            <ButtonGroupRow className={styles.contentRight}>
                {additionalButtons}
                {onClose && (
                    <div className={styles.contentRight}>
                        <Button onClick={onClose} variant="secondary" label={closeButtonLabel ?? t('form.back')} />
                    </div>
                )}
                {submitButtonLabel && (
                    <Button
                        variant={submitButtonVariant}
                        label={submitButtonLabel}
                        disabled={!!isLoading || disabled}
                        type="submit"
                        onClick={onSubmit}
                    />
                )}
                {isLoading && (
                    <IconWithText icon={LoadingArrowIcon}>
                        <div className={styles.loadingText}>{t('form.waitSending')}</div>
                    </IconWithText>
                )}
            </ButtonGroupRow>
        </>
    )
}
