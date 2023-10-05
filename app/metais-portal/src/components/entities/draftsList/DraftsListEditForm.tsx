import React, { useCallback } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { ApiLink, ApiStandardRequest, useUpdateStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { Button, LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { MutationFeedback } from '@isdd/metais-common/index'

import { DraftsListAttachmentsZone } from '@/components/entities/draftsList/DraftsListAttachmentsZone'
import styles from '@/components/entities/draftsList/draftsListCreateForm.module.scss'

interface IDraftsListEditForm {
    defaultData?: ApiStandardRequest
}

export const DraftsListEditForm = ({ defaultData }: IDraftsListEditForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { register, setValue, watch, handleSubmit } = useForm({
        defaultValues: {
            ...defaultData,
        },
    })
    const { mutateAsync: updateDraft, isSuccess, isError, isLoading } = useUpdateStandardRequest()
    const links = watch('links') ?? []

    const addNewLink = () => {
        setValue('links', [...(links ?? []), {} as ApiLink])
    }

    const removeLink = (removeIndex: number) => {
        const newAttachments = links?.filter((_: ApiLink, index: number) => index !== removeIndex)
        setValue('links', newAttachments)
    }

    const onSubmit = useCallback(
        async (values: FieldValues) => {
            await updateDraft({
                standardRequestId: defaultData?.id ?? 0,
                data: {
                    ...values,
                },
            })
        },
        [defaultData, updateDraft],
    )

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            <MutationFeedback error={isError} success={isSuccess} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <DraftsListAttachmentsZone links={links} register={register} addNewLink={addNewLink} onDelete={removeLink} attachements={[]} />
                <div className={styles.buttonGroup}>
                    <Button
                        label={t('DraftsList.createForm.cancel')}
                        variant="secondary"
                        onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_NAVRHOV}/${defaultData?.id}`)}
                    />
                    <Button label={t('button.saveChanges')} type="submit" />
                </div>
            </form>
        </>
    )
}
