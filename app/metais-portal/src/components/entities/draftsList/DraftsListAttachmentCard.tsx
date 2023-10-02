import React from 'react'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IconLabel } from '@isdd/metais-common/index'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'

import styles from './draftsListCreateForm.module.scss'

interface IDraftsListAttachmentCard {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    index: number
    onDelete: (index: number) => void
    isPlaceholder?: boolean
}

export const DraftsListAttachmentCard = ({ register, index, onDelete, isPlaceholder }: IDraftsListAttachmentCard) => {
    const { t } = useTranslation()
    return (
        <div className={styles.attachementCardWrapper}>
            <div className={styles.inputs}>
                <div className={styles.attachementsCard}>
                    <Input
                        {...register(`attachments.[${index}].attachmentDescription`)}
                        className={styles.attachmentDescription}
                        label={t('DraftsList.createForm.attachments.attachmentDescription')}
                    />
                    <Input
                        {...register(`attachments.[${index}].attachmentType`)}
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.attachments.attachmentType')}
                    />
                </div>
                <div className={styles.attachementsCard}>
                    <Input
                        {...register(`attachments.[${index}].attachmentId`)}
                        label={t('DraftsList.createForm.attachments.attachmentId')}
                        className={styles.attachmentDescription}
                    />
                    <Input
                        {...register(`attachments.[${index}].attachmentSize`)}
                        type="number"
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.attachments.attachmentSize')}
                    />
                </div>
            </div>
            {!isPlaceholder && (
                <div className={styles.attachementsCard}>
                    <Button
                        onClick={() => onDelete(index)}
                        variant="secondary"
                        label={<IconLabel icon={ImportDeleteIcon} alt={t('DraftsList.createForm.attachments.delete')} />}
                    />
                </div>
            )}
        </div>
    )
}
