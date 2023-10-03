import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { Attribute, MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiAttachment, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { getInfo } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

import styles from './draftsListCreateForm.module.scss'
import { generateSchemaForCreateDraft } from './schema/createDraftSchema'
import { DraftsListAttachmentsZone } from './DraftsListAttachmentsZone'

interface CreateForm {
    data: {
        guiAttributes: Attribute[]
        defaultData: ApiStandardRequest | undefined
    }
    onSubmit(data: FieldValues): Promise<void>
    isSuccess: boolean
    isError: boolean
}
const DraftsListCreateForm = ({ onSubmit, data, isSuccess, isError }: CreateForm) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            ...data?.defaultData,
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
                <Input
                    {...register('srName')}
                    label={getInfo('srName', data?.guiAttributes)}
                    info={getInfo('srName', data?.guiAttributes)}
                    required
                />
                <RichTextQuill
                    id="srDescription1"
                    setValue={setValue}
                    name={'srDescription1'}
                    label={getInfo('srDescription1', data?.guiAttributes)}
                    info={getInfo('srDescription1', data?.guiAttributes)}
                    isRequired
                />
                <RichTextQuill
                    id="proposalDescription2"
                    setValue={setValue}
                    name={'proposalDescription2'}
                    label={getInfo('proposalDescription2', data?.guiAttributes)}
                    info={getInfo('proposalDescription2', data?.guiAttributes)}
                />
                <RichTextQuill
                    setValue={setValue}
                    name={'proposalDescription3'}
                    label={getInfo('proposalDescription3', data?.guiAttributes)}
                    info={getInfo('proposalDescription3', data?.guiAttributes)}
                />
                <RichTextQuill
                    setValue={setValue}
                    name={'impactDescription1'}
                    label={getInfo('impactDescription1', data?.guiAttributes)}
                    info={getInfo('impactDescription1', data?.guiAttributes)}
                />
                <RichTextQuill
                    setValue={setValue}
                    name={'impactDescription5'}
                    label={getInfo('impactDescription5', data?.guiAttributes)}
                    info={getInfo('impactDescription5', data?.guiAttributes)}
                />
                <RichTextQuill
                    setValue={setValue}
                    name={'impactDescription7'}
                    label={getInfo('impactDescription7', data?.guiAttributes)}
                    info={getInfo('impactDescription7', data?.guiAttributes)}
                />
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
