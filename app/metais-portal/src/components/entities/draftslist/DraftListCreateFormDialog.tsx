import React from 'react'
import { BaseModal, Button, Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import styles from '@isdd/metais-common/components/export-items-or-relations/exportItemsOrRelations.module.scss'
import { useTranslation } from 'react-i18next'
import { UseFormRegister } from 'react-hook-form'

interface iDraftListCreateFormDialog {
    openCreateFormDialog: boolean
    closeCreateFormDialog: () => void
    handleSubmit: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
}

export const DraftListCreateFormDialog = ({ openCreateFormDialog, closeCreateFormDialog, register, handleSubmit }: iDraftListCreateFormDialog) => {
    const { t } = useTranslation()
    return (
        <BaseModal isOpen={openCreateFormDialog} close={closeCreateFormDialog}>
            <div className={styles.modalContainer}>
                <div className={styles.content}>
                    <TextHeading size={'L'} className={styles.heading}>
                        {t(`DraftsList.createForm.userHeading`)}
                    </TextHeading>

                    <Input {...register('name')} label={t('DraftsList.createForm.name')} />
                    <Input {...register('email')} label={t('DraftsList.createForm.email')} />

                    {/* 
                        // eslint-disable-next-line no-warning-comments
                        TODO: Captcha 
                    */}
                    <div className={styles.confirmButton}>
                        <Button label={t('DraftsList.header.changeState.submit')} onClick={handleSubmit} />
                    </div>
                </div>
            </div>
        </BaseModal>
    )
}
