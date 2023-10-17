import { Button, CheckBox, Input, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
                type: fieldValues[DOCUMENT_FIELDS.ID],
                name: fieldValues[DOCUMENT_FIELDS.NAME],
                description: fieldValues[DOCUMENT_FIELDS.DESCRIPTION],
                nameEng: fieldValues[DOCUMENT_FIELDS.NAME_ENG],
                descriptionEng: fieldValues[DOCUMENT_FIELDS.DESCRIPTION_ENG],
                confluence: fieldValues[DOCUMENT_FIELDS.CONFLUENCE],
                required: fieldValues[DOCUMENT_FIELDS.REQUIRED],
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
                    error={errors[DOCUMENT_FIELDS.ID]?.message as string}
                    label={t('documentsManagement.docId')}
                    {...register(DOCUMENT_FIELDS.ID)}
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
                <CheckBox label={t('documentsManagement.confluence')} id={DOCUMENT_FIELDS.CONFLUENCE} {...register(DOCUMENT_FIELDS.CONFLUENCE)} />

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
