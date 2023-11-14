import React from 'react'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IconLabel } from '@isdd/metais-common/index'
import { ImportDeleteIcon } from '@isdd/metais-common/assets/images'
import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from '@/components/entities/draftslist/draftsListCreateForm.module.scss'

interface IDraftsListAttachmentCard {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
    errors: FieldErrors<{
        attachments: ApiAttachment[] | undefined
        links:
            | {
                  name?: string | undefined
                  id?: number | undefined
                  type?: string | undefined
                  linkType?: string | undefined
                  linkSize?: string | undefined
                  url: string
                  linkDescription: string
              }[]
            | undefined
    }>
    index: number
    onDelete: (index: number) => void
}

export const DraftsListAttachmentCard = ({ register, index, onDelete, errors }: IDraftsListAttachmentCard) => {
    const { t } = useTranslation()

    return (
        <div className={styles.attachementCardWrapper}>
            <div className={styles.inputs}>
                <div className={styles.attachementsCard}>
                    <Input
                        {...register(`links.[${index}].linkDescription`)}
                        className={styles.attachmentDescription}
                        label={t('DraftsList.createForm.links.linkDescription')}
                        error={errors?.links?.[index]?.linkDescription?.message?.toString()}
                    />
                    <Input
                        {...register(`links.[${index}].linkType`)}
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.links.linkType')}
                        error={errors?.links?.[index]?.linkType?.message?.toString()}
                    />
                </div>
                <div className={styles.attachementsCard}>
                    <Input
                        {...register(`links.[${index}].url`)}
                        label={t('DraftsList.createForm.links.url')}
                        className={styles.attachmentDescription}
                        error={errors?.links?.[index]?.url?.message?.toString()}
                    />
                    <Input
                        {...register(`links.[${index}].linkSize`)}
                        type="number"
                        className={styles.attachmentType}
                        label={t('DraftsList.createForm.links.linkSize')}
                        error={errors?.links?.[index]?.linkSize?.message?.toString()}
                    />
                </div>
            </div>
            <div className={styles.attachementsCard}>
                <Button
                    onClick={() => onDelete(index)}
                    variant="secondary"
                    label={<IconLabel icon={ImportDeleteIcon} alt={t('DraftsList.createForm.links.delete')} />}
                />
            </div>
        </div>
    )
}
