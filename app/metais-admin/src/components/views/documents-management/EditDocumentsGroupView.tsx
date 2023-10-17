import { Button, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DOCUMENT_FIELDS } from './CreateDocumentsGroupView'

import { IView } from '@/components/containers/documents-management/DocumentsGroupContainer'

export const EditDocumentsGroupView: React.FC<IView> = ({ infoData, projectStatus, saveDocumentGroup, isLoading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
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
            navigate(-1)
        }
    }
    return (
        <QueryFeedback loading={isLoading}>
            <TextHeading size="L">{t('documentsManagement.groupEdit')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
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
