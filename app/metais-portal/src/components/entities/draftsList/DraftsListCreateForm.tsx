import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
import { Button, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useNavigate } from 'react-router-dom'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { API_STANDARD_REQUEST_ATTRIBUTES, Attribute, MutationFeedback } from '@isdd/metais-common/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiLink, ApiStandardRequest } from '@isdd/metais-common/api/generated/standards-swagger'
import { getInfoGuiProfilStandardRequest } from '@isdd/metais-common/api/hooks/containers/containerHelpers'

import styles from './draftsListCreateForm.module.scss'

import { generateSchemaForCreateDraft } from '@/components/entities/draftsList/schema/createDraftSchema'
import { DraftsListAttachmentsZone } from '@/components/entities/draftsList/DraftsListAttachmentsZone'

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
    const { register, handleSubmit, setValue, watch, getValues } = useForm({
        defaultValues: {
            ...data?.defaultData,
        },
        resolver: yupResolver(generateSchemaForCreateDraft(t)),
    })
    const links = watch('links') ?? []

    const addNewLink = () => {
        setValue('links', [...(links ?? []), {} as ApiLink])
    }

    const removeLink = (removeIndex: number) => {
        const newAttachments = links?.filter((_: ApiLink, index: number) => index !== removeIndex)
        setValue('links', newAttachments)
    }

    return (
        <div>
            <MutationFeedback error={isError} success={isSuccess} />
            <TextHeading size="L">{t('DraftsList.createForm.heading')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register(API_STANDARD_REQUEST_ATTRIBUTES.srName)}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srName, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srName, data?.guiAttributes)}
                    required
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.srDescription1}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.srDescription1}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.srDescription1)}
                    isRequired
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription2)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.proposalDescription3)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription1)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription5)}
                />
                <RichTextQuill
                    id={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    setValue={setValue}
                    name={API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7}
                    label={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    info={getInfoGuiProfilStandardRequest(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7, data?.guiAttributes)}
                    value={getValues(API_STANDARD_REQUEST_ATTRIBUTES.impactDescription7)}
                />
                <DraftsListAttachmentsZone attachements={[]} links={links} register={register} addNewLink={addNewLink} onDelete={removeLink} />
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
