import { Button, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
                state: fieldValues['status'] ?? infoData.state,
                name: fieldValues['name'],
                description: fieldValues['description'],
                nameEng: fieldValues['nameEng'],
                descriptionEng: fieldValues['descriptionEng'],
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
                    name="status"
                    setValue={setValue}
                    error={errors['status']?.message as string}
                    options={projectStatus.enumItems?.map((e) => ({ value: e.code ?? '', label: e.value ?? '', disabled: false })) ?? []}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors['name']?.message as string}
                    label={t('documentsManagement.name')}
                    defaultValue={infoData.name}
                    {...register('name')}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors['description']?.message as string}
                    rows={3}
                    label={t('documentsManagement.description')}
                    {...register('description')}
                    defaultValue={infoData.description}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    error={errors['nameEng']?.message as string}
                    label={t('documentsManagement.nameEng')}
                    {...register('nameEng')}
                    defaultValue={infoData.nameEng}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors['descriptionEng']?.message as string}
                    rows={3}
                    label={t('documentsManagement.descriptionEng')}
                    {...register('descriptionEng')}
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
