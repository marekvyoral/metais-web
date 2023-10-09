import { Button, CheckBox, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { IView } from '@/components/containers/documents-management/CreateDocumentContainer'

export const CreateDocumentView: React.FC<IView> = ({ infoData, saveDocument, isLoading }) => {
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
            saveDocument({
                documentGroup: infoData,
                type: fieldValues['docId'],
                name: fieldValues['name'],
                description: fieldValues['description'],
                nameEng: fieldValues['nameEng'],
                descriptionEng: fieldValues['descriptionEng'],
                confluence: fieldValues['confluence'],
                required: fieldValues['required'],
            })
            navigate(-1)
        }
    }
    return (
        <QueryFeedback loading={isLoading}>
            <TextHeading size="L">{t('documentsManagement.addDocument')}</TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors['docId']?.message as string}
                    label={t('documentsManagement.docId')}
                    {...register('docId')}
                />
                <SimpleSelect
                    label={t('documentsManagement.docTemplate') + ' ' + t('input.requiredField')}
                    name="docPreset"
                    setValue={setValue}
                    error={errors['docPreset']?.message as string}
                    options={[]}
                />
                <CheckBox label={t('documentsManagement.useTemplate')} id="usePreset" {...register('usePreset')} />
                <div style={{ height: '20px' }} />
                <Input
                    placeholder={t('documentsManagement.input')}
                    required
                    error={errors['name']?.message as string}
                    label={t('documentsManagement.name')}
                    {...register('name')}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors['description']?.message as string}
                    rows={3}
                    label={t('documentsManagement.description')}
                    {...register('description')}
                />
                <Input
                    placeholder={t('documentsManagement.input')}
                    error={errors['nameEng']?.message as string}
                    label={t('documentsManagement.nameEng')}
                    {...register('nameEng')}
                />
                <TextArea
                    placeholder={t('documentsManagement.input')}
                    error={errors['descriptionEng']?.message as string}
                    rows={3}
                    label={t('documentsManagement.descriptionEng')}
                    {...register('descriptionEng')}
                />
                <CheckBox label={t('documentsManagement.required')} id="required" {...register('required')} />
                <div style={{ height: '20px' }} />
                <CheckBox label={t('documentsManagement.confluence')} id="confluence" {...register('confluence')} />

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
