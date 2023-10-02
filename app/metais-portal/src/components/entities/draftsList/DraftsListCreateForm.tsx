import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAttachment } from '@isdd/metais-common/api/generated/standards-swagger'

import styles from './draftsListCreateForm.module.scss'
import { generateSchemaForCreateDraft } from './schema/createDraftSchema'
import { DraftsListAttachmentsZone } from './DraftsListAttachmentsZone'

interface CreateForm {
    data: any
    onSubmit(data: FieldValues): Promise<void>
    isSuccess: boolean
    isError: boolean
}
const DraftsListCreateForm = ({ onSubmit, data, isSuccess, isError }: CreateForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            ...data,
        },
        resolver: yupResolver(generateSchemaForCreateDraft(t)),
    })
    const attachements = watch('attachments') ?? []

    const addNewAttachment = () => {
        setValue('attachments', [...(attachements ?? []), {} as ApiAttachment])
    }

    const removeParameter = (removeIndex: number) => {
        const newAttachments = attachements?.filter((_: ApiAttachment, index: number) => index !== removeIndex)
        setValue('attachments', newAttachments)
    }

    return (
        <div>
            <MutationFeedback error={isError} success={isSuccess} />
            <TextHeading size="L">{t('DraftsList.createForm.heading')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input {...register('srName')} label={t('DraftsList.createForm.name')} />
                <RichTextQuill id="srDescription1" setValue={setValue} name={'srDescription1'} label={t('DraftsList.createForm.srDescription1')} />
                <RichTextQuill
                    id="proposalDescription2"
                    setValue={setValue}
                    name={'proposalDescription2'}
                    label={t('DraftsList.createForm.proposalDescription2')}
                />
                <RichTextQuill setValue={setValue} name={'proposalDescription3'} label={t('DraftsList.createForm.proposalDescription3')} />
                <RichTextQuill setValue={setValue} name={'impactDescription1'} label={t('DraftsList.createForm.impactDescription1')} />
                <RichTextQuill setValue={setValue} name={'impactDescription5'} label={t('DraftsList.createForm.impactDescription5')} />
                <RichTextQuill setValue={setValue} name={'impactDescription7'} label={t('DraftsList.createForm.impactDescription7')} />
                <DraftsListAttachmentsZone
                    attachements={attachements}
                    register={register}
                    addNewAttachement={addNewAttachment}
                    onDelete={removeParameter}
                />
                <div className={styles.buttonGroup}>
                    <Button
                        label={t('DraftsList.createForm.cancel')}
                        variant="secondary"
                        onClick={() => navigate(NavigationSubRoutes.ZOZNAM_NAVRHOV)}
                    />
                    <Button label={t('DraftsList.createForm.submit')} type="submit" />
                </div>
            </form>
        </div>
    )
}
export default DraftsListCreateForm
