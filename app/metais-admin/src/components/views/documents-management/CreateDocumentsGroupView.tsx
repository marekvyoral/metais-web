import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { IView } from '@/components/containers/documents-management/CreateDocumentsGroupContainer'

export const DOCUMENT_FIELDS = {
    STATE: 'status',
    NAME: 'name',
    DESCRIPTION: 'description',
    NAME_ENG: 'nameEng',
    DESCRIPTION_ENG: 'descriptionEng',
}
const docSchema = (t: TFunction<'translation', undefined, 'translation'>) =>
    yup
        .object({
            [DOCUMENT_FIELDS.STATE]: yup.string().trim().required(t('validation.required')),
            [DOCUMENT_FIELDS.NAME]: yup.string().trim().required(t('validation.required')),
        })
        .defined()
export const CreateDocumentsGroupView: React.FC<IView> = ({ projectStatus, saveDocumentGroup, isLoading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()

    const [updateError, setUpdateError] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        clearErrors,
        setValue,
    } = useForm({ resolver: yupResolver(docSchema(t)), mode: 'onChange' })

    const onSubmit = (fieldValues: FieldValues) => {
        if (isValid) {
            saveDocumentGroup({
                state: fieldValues[DOCUMENT_FIELDS.STATE],
                name: fieldValues[DOCUMENT_FIELDS.NAME],
                description: fieldValues[DOCUMENT_FIELDS.DESCRIPTION],
                nameEng: fieldValues[DOCUMENT_FIELDS.NAME_ENG],
                descriptionEng: fieldValues[DOCUMENT_FIELDS.DESCRIPTION_ENG],
            })
                .then(() => {
                    setIsActionSuccess({ value: true, path: '/projects/documents' })

                    navigate('/projects/documents', { state: { from: location } })
                })
                .catch(() => {
                    setUpdateError(true)
                })
        }
    }
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (updateError) {
            scrollToMutationFeedback()
        }
    }, [updateError, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading} error={updateError}>
            <div ref={wrapperRef} />
            <TextHeading size="L">{t('documentsManagement.groupCreate')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <SimpleSelect
                    label={t('documentsManagement.status') + ' ' + t('input.requiredField')}
                    name={DOCUMENT_FIELDS.STATE}
                    setValue={setValue}
                    onChange={(value) => {
                        if (value !== undefined) {
                            clearErrors(DOCUMENT_FIELDS.STATE)
                        }
                    }}
                    error={errors[DOCUMENT_FIELDS.STATE]?.message as string}
                    options={projectStatus.enumItems?.map((e) => ({ value: e.code ?? '', label: e.value ?? '', disabled: false })) ?? []}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors[DOCUMENT_FIELDS.NAME]?.message as string}
                    label={t('documentsManagement.name')}
                    {...register(DOCUMENT_FIELDS.NAME)}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.DESCRIPTION]?.message as string}
                    rows={3}
                    label={t('documentsManagement.description')}
                    {...register(DOCUMENT_FIELDS.DESCRIPTION)}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.NAME_ENG]?.message as string}
                    label={t('documentsManagement.nameEng')}
                    {...register(DOCUMENT_FIELDS.NAME_ENG)}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.DESCRIPTION_ENG]?.message as string}
                    rows={3}
                    label={t('documentsManagement.descriptionEng')}
                    {...register(DOCUMENT_FIELDS.DESCRIPTION_ENG)}
                />
                <SubmitWithFeedback
                    submitButtonLabel={t('codelists.save')}
                    loading={false}
                    additionalButtons={[
                        <Button
                            key={1}
                            variant="secondary"
                            label={t('codelists.cancel')}
                            onClick={() => {
                                clearErrors()
                                navigate(-1)
                            }}
                        />,
                    ]}
                />
            </form>
        </QueryFeedback>
    )
}
