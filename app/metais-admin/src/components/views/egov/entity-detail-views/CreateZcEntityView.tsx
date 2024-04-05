import { Button, ErrorBlock, Input, MultiSelect, SelectLazyLoading, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { MutationFeedback, MutationFeedbackError, QueryFeedback } from '@isdd/metais-common'
import { Role } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistPreview, useGetCodelistHeadersHook } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { AsyncUriSelect } from '@isdd/metais-common/components/async-uri-select/AsyncUriSelect'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useState } from 'react'
import { FieldValues, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MultiValue } from 'react-select'

import { colorOption } from './CreateEntityView'
import styles from './createEntityView.module.scss'
import { useCreateForm } from './hooks/useCreateForm'

type CreateZcEntityViewPropsType = {
    roles?: Role[]
    isLoading: boolean
    isError: boolean
    error: MutationFeedbackError | undefined
    successMutation: boolean
    clearError: () => void
    onSubmit: (formData: CiType, codelist: ApiCodelistPreview) => void
}

export const CreateZcEntityView = ({ roles, isError, isLoading, error, successMutation, clearError, onSubmit }: CreateZcEntityViewPropsType) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const ciOptionsHook = useGetCodelistHeadersHook()

    const [selectedItems, setSelectedItems] = useState<ApiCodelistPreview | null>(null)
    const [codelistMessage, setCodelistMessage] = useState<string | undefined>()

    const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
        const page = !additional?.page ? 1 : (additional?.page || 0) + 1

        const response = await ciOptionsHook({
            language: 'sk',
            ciTypeTN: '',
            pageNumber: page,
            perPage: 20,
            nameFilter: searchQuery,
        })

        const options = response.codelists

        return {
            options: options || [],
            hasMore: options?.length ? true : false,
            additional: {
                page: page,
            },
        }
    }

    const { formMethods } = useCreateForm({ data: { roles }, hiddenInputs: { SOURCES: true, TARGETS: true, ENG_DESCRIPTION: true } })

    const roleList =
        roles?.map?.((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []
    const { handleSubmit, formState, register, watch, control } = formMethods

    const onFormSubmit = async (formData: FieldValues) => {
        if (selectedItems) {
            onSubmit(formData, selectedItems)
        } else {
            setCodelistMessage(t('validation.required'))
        }
    }

    return (
        <>
            <FormProvider {...formMethods}>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t(`egov.entity.createFromZcHeader`)}</TextHeading>
                        <QueryFeedback error={isError} loading={false} />
                        <MutationFeedback
                            success={successMutation}
                            errorMessage={error?.errorMessage}
                            error={!!error}
                            onMessageClose={() => {
                                clearError()
                            }}
                        />
                    </FlexColumnReverseWrapper>

                    {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                    <form onSubmit={handleSubmit(onFormSubmit)} noValidate>
                        <>
                            <SelectLazyLoading<ApiCodelistPreview>
                                getOptionLabel={(item) => item.codelistNames?.[0].value ?? ''}
                                getOptionValue={(item) => item.graphUuid ?? ''}
                                loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                                label={t('egov.addNew.codelist')}
                                required
                                name="select-configuration-item"
                                onChange={(val: ApiCodelistPreview | MultiValue<ApiCodelistPreview> | null) => {
                                    setCodelistMessage(undefined)
                                    setSelectedItems(val as ApiCodelistPreview)
                                }}
                                error={codelistMessage}
                                value={selectedItems}
                            />
                            <Input
                                label={t('egov.name') + ' ' + t('input.requiredField')}
                                {...register('name')}
                                error={formState?.errors.name?.message}
                            />
                            <Input
                                label={t('egov.engName') + ' ' + t('input.requiredField')}
                                {...register('engName')}
                                error={formState?.errors?.engName?.message}
                            />
                            <Input
                                label={t('egov.technicalName') + ' ' + t('input.requiredField')}
                                {...register('technicalName')}
                                error={formState?.errors?.technicalName?.message}
                            />
                            <Input
                                label={t('egov.codePrefix') + ' ' + t('input.requiredField')}
                                {...register('codePrefix')}
                                error={formState?.errors?.codePrefix?.message}
                            />
                            <AsyncUriSelect
                                control={control}
                                label={t('egov.uriPrefix') + ' ' + t('input.requiredField')}
                                name="uriPrefix"
                                error={formState?.errors?.uriPrefix?.message}
                                hint={t('refIden.hint')}
                            />
                            <TextArea
                                label={t('egov.description')}
                                rows={3}
                                {...register('description')}
                                error={formState?.errors?.description?.message}
                            />
                            <TextArea
                                label={t('egov.engDescription')}
                                rows={3}
                                {...register('engDescription')}
                                error={formState?.errors?.engDescription?.message}
                            />
                            <SimpleSelect
                                label={t('egov.type')}
                                options={[
                                    { value: 'application', label: t('tooltips.type.application') },
                                    { value: 'system', label: t('tooltips.type.system') },
                                ]}
                                name="type"
                                defaultValue={'application'}
                                setValue={formMethods.setValue}
                                disabled
                            />
                            <div>
                                <MultiSelect
                                    label={t('egov.roles') + ' ' + t('input.requiredField')}
                                    options={roleList}
                                    name="roleList"
                                    setValue={formMethods.setValue}
                                    value={watch().roleList?.map((role) => role ?? '')}
                                    error={formState?.errors?.roleList?.message}
                                />
                            </div>
                            <SimpleSelect label={t('egov.color')} name={'color'} options={colorOption(t)} setValue={formMethods.setValue} />

                            <div className={styles.submitButton}>
                                <Button type="submit" label={t('form.submit')} />
                                <Button
                                    label={t('form.back')}
                                    onClick={() => {
                                        navigate(-1)
                                    }}
                                    variant="secondary"
                                />
                            </div>
                        </>
                    </form>
                </QueryFeedback>
            </FormProvider>
        </>
    )
}
