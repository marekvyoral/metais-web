import React from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { Input } from '@isdd/idsk-ui-kit/src/input/Input'
import { useTranslation } from 'react-i18next'
interface CreateForm {
    data: any
    onSubmit(data: FieldValues): Promise<void>
}
const DraftsListCreateForm = ({ onSubmit }: CreateForm) => {
    const { t } = useTranslation()
    const { register, handleSubmit } = useForm()
    const columns = [
        <>
            <Input {...register('name')} />
        </>,
        <>
            <Input {...register('email')} />
        </>,
        <>
            <Input {...register('srName')} />
        </>,
        <>
            <Input {...register('createdAt')} />
        </>,
        <>
            <Input {...register('createdBy')} />
        </>,
        <>
            <Input {...register('standardRequestState')} />
        </>,
        <>
            <Input {...register('requestChannel')} />
        </>,
        <>
            <Input {...register('srDescription1')} />
        </>,
    ]
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>{columns}</form>
        </div>
    )
}
export default DraftsListCreateForm
