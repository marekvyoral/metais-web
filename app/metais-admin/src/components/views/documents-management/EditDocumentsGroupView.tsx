import { Button, ErrorBlock, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { DOCUMENT_FIELDS } from './CreateDocumentsGroupView'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const EditDocumentsGroupView: React.FC<IView> = ({ infoData, projectStatus, saveDocumentGroup, isLoading, refetchInfoData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()
    const [updateError, setUpdateError] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitted },
        clearErrors,
        setValue,
    } = useForm()
    const onSubmit = (fieldValues: FieldValues) => {
        if (isValid) {
            saveDocumentGroup({
                ...infoData,
                state: fieldValues[DOCUMENT_FIELDS.STATE] ?? infoData.state,
                name: fieldValues[DOCUMENT_FIELDS.NAME],
                description: fieldValues[DOCUMENT_FIELDS.DESCRIPTION],
                nameEng: fieldValues[DOCUMENT_FIELDS.NAME_ENG],
                descriptionEng: fieldValues[DOCUMENT_FIELDS.DESCRIPTION_ENG],
            })
                .then(() => {
                    setIsActionSuccess({
                        value: true,
                        path: AdminRouteNames.DOCUMENTS_MANAGEMENT + '/' + infoData.id,
                        additionalInfo: { type: 'editGroup' },
                    })
                    refetchInfoData()
                    navigate(AdminRouteNames.DOCUMENTS_MANAGEMENT + '/' + infoData.id, { state: { from: location } })
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
            <TextHeading size="L">{t('documentsManagement.groupEdit')}</TextHeading>
            {isSubmitted && !isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <SimpleSelect
                    defaultValue={projectStatus.enumItems?.find((e) => e.code == infoData.state)?.code}
                    label={t('documentsManagement.status') + ' ' + t('input.requiredField')}
                    name={DOCUMENT_FIELDS.STATE}
                    setValue={setValue}
                    error={errors[DOCUMENT_FIELDS.STATE]?.message as string}
                    options={projectStatus.enumItems?.map((e) => ({ value: e.code ?? '', label: e.value ?? '', disabled: false })) ?? []}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors[DOCUMENT_FIELDS.NAME]?.message as string}
                    label={t('documentsManagement.name')}
                    defaultValue={infoData.name}
                    {...register(DOCUMENT_FIELDS.NAME)}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.DESCRIPTION]?.message as string}
                    rows={3}
                    label={t('documentsManagement.description')}
                    {...register(DOCUMENT_FIELDS.DESCRIPTION)}
                    defaultValue={infoData.description}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.NAME_ENG]?.message as string}
                    label={t('documentsManagement.nameEng')}
                    {...register(DOCUMENT_FIELDS.NAME_ENG)}
                    defaultValue={infoData.nameEng}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors[DOCUMENT_FIELDS.DESCRIPTION_ENG]?.message as string}
                    rows={3}
                    label={t('documentsManagement.descriptionEng')}
                    {...register(DOCUMENT_FIELDS.DESCRIPTION_ENG)}
                    defaultValue={infoData.descriptionEng}
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
