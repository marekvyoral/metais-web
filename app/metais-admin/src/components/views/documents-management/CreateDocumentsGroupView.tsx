import { Filter } from '@isdd/idsk-ui-kit/filter'
import { Button, ButtonGroupRow, ButtonPopup, Input, SimpleSelect, Tab, Table, Tabs, TextArea, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Document } from '@isdd/metais-common/api/generated/kris-swagger'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ActionsOverTable, BulkPopup, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { FieldValues, useForm } from 'react-hook-form'

import { IView } from '@/components/containers/documents-management/CreateDocumentsGroupContainer'

export const CreateDocumentsGroupView: React.FC<IView> = ({ projectStatus, saveDocument, isLoading }) => {
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
                state: fieldValues['status'],
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
