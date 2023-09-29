import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
import { RichTextQuill } from '@isdd/metais-common/components/rich-text-quill/RichTextQuill'
interface CreateForm {
    data: any
    onSubmit(data: FieldValues): Promise<void>
}
const DraftsListCreateForm = ({ onSubmit, data }: CreateForm) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            ...data,
        },
    })
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <Input {...register('name')} label={t('DraftsList.create.name')} />
                </div>
                <div className="">
                    <RichTextQuill setValue={setValue} name={'srDescription1'} label={t('DraftsList.create.srDescription1')} />
                </div>
                <RichTextQuill setValue={setValue} name={'proposalDescription2'} label={t('DraftsList.create.proposalDescription2')} />
                <RichTextQuill setValue={setValue} name={'proposalDescription3'} label={t('DraftsList.create.proposalDescription3')} />
                <RichTextQuill setValue={setValue} name={'impactDescription1'} label={t('DraftsList.create.impactDescription1')} />
                <RichTextQuill setValue={setValue} name={'impactDescription5'} label={t('DraftsList.create.impactDescription5')} />
                <RichTextQuill setValue={setValue} name={'impactDescription7'} label={t('DraftsList.create.impactDescription7')} />
            </form>
        </div>
    )
}
export default DraftsListCreateForm
