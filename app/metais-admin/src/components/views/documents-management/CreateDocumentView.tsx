import { yupResolver } from '@hookform/resolvers/yup'
import { Button, CheckBox, Input, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useEffect, useState } from 'react'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { IView } from '@/components/containers/documents-management/CreateDocumentContainer'

const DOCUMENT_FIELDS = {
    ID: 'docId',
    NAME: 'name',
    NAME_ENG: 'nameEng',
    DESCRIPTION: 'description',
    DESCRIPTION_ENG: 'descriptionEng',
    CONFLUENCE: 'confluence',
    REQUIRED: 'required',
}

const docSchema = (t: TFunction<'translation', undefined, 'translation'>) =>
    yup
        .object({
            [DOCUMENT_FIELDS.ID]: yup.string().trim().required(t('validation.required')),
            [DOCUMENT_FIELDS.NAME]: yup.string().trim().required(t('validation.required')),
        })
        .defined()

export const CreateDocumentView: React.FC<IView> = ({ infoData, saveDocument, isLoading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const [isError, setIsError] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        clearErrors,
    } = useForm({ resolver: yupResolver(docSchema(t)) })
    const onSubmit = (fieldValues: FieldValues) => {
        if (isValid) {
            saveDocument({
                documentGroup: infoData,
                type: fieldValues[DOCUMENT_FIELDS.ID],
                name: fieldValues[DOCUMENT_FIELDS.NAME],
                description: fieldValues[DOCUMENT_FIELDS.DESCRIPTION],
                nameEng: fieldValues[DOCUMENT_FIELDS.NAME_ENG],
                descriptionEng: fieldValues[DOCUMENT_FIELDS.DESCRIPTION_ENG],
                confluence: fieldValues[DOCUMENT_FIELDS.CONFLUENCE],
                required: fieldValues[DOCUMENT_FIELDS.REQUIRED],
            })
                .then(() => {
                    setIsActionSuccess({ value: true, path: '/projects/documents/' + infoData.id, additionalInfo: { type: 'create' } })
                    navigate('/projects/documents/' + infoData.id, { state: { from: location } })
                })
                .catch(() => {
                    setIsError(true)
                })
        }
    }

    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    useEffect(() => {
        if (isError) {
            scrollToMutationFeedback()
        }
    }, [isError, scrollToMutationFeedback])

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <div ref={wrapperRef} />
            <TextHeading size="L">{t('documentsManagement.addDocument')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors['docId']?.message as string}
                    label={t('documentsManagement.docId')}
                    {...register(DOCUMENT_FIELDS.ID)}
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
                <CheckBox label={t('documentsManagement.required')} id={DOCUMENT_FIELDS.REQUIRED} {...register(DOCUMENT_FIELDS.REQUIRED)} />
                <div style={{ height: '20px' }} />
                <CheckBox label={t('documentsManagement.xWiki')} id={DOCUMENT_FIELDS.CONFLUENCE} {...register(DOCUMENT_FIELDS.CONFLUENCE)} />

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
