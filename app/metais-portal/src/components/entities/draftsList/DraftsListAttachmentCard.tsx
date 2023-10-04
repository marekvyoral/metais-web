import React from 'react'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IconLabel } from '@isdd/metais-common/index'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'

import styles from '@/components/entities/draftsList/draftsListCreateForm.module.scss'

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
                        {...register(`links.[${index}].linkDescription`)}
                        className={styles.attachmentDescription}
                        label={t('DraftsList.createForm.links.linkDescription')}
                    />
                    <Input
                        {...register(`links.[${index}].linkType`)}
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.links.linkType')}
                    />
                </div>
                <div className={styles.attachementsCard}>
                    <Input
                        {...register(`links.[${index}].url`)}
                        label={t('DraftsList.createForm.links.url')}
                        className={styles.attachmentDescription}
                    />
                    <Input
                        {...register(`links.[${index}].linkSize`)}
                        type="number"
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.links.linkSize')}
                    />
                </div>
            </div>
            {!isPlaceholder && (
                <div className={styles.attachementsCard}>
                    <Button
                        onClick={() => onDelete(index)}
                        variant="secondary"
                        label={<IconLabel icon={ImportDeleteIcon} alt={t('DraftsList.createForm.links.delete')} />}
                    />
                </div>
            )}
        </div>
    )
}
