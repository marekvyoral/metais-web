import { Button, ErrorBlock, Input, MultiSelect, SimpleSelect, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { useCallback } from 'react'
import { FieldValues, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'

import { AddAttributeProfilesModal } from './attributes/AddAttributeProfilesModal'
import styles from './createEntityView.module.scss'
import { useCreateDialogs } from './hooks/useCreateDialogs'
import { useCreateForm } from './hooks/useCreateForm'

import { ProfileTabs } from '@/components/ProfileTabs'
import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { AddConnectionModal } from '@/components/views/egov/relation-detail-views/connections/AddConnectionModal'
import ConnectionView from '@/components/views/egov/relation-detail-views/connections/ConnectionView'

export const CreateEntityView = ({ data, mutate, hiddenInputs, isError, isLoading, isEdit, type }: ICreateEntityView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const {
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        profileAttributesDialog,
    } = useCreateDialogs()

    const { formMethods, tabsFromForm, sourcesFromForm, targetsFromForm } = useCreateForm({ data, hiddenInputs })

    const roleList =
        data?.roles?.map?.((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []

    const { handleSubmit, formState, register } = formMethods

    const onSubmit = useCallback(
        async (formData: FieldValues) => {
            await mutate(formData)
                .then(() => {
                    setSuccessedMutation(true)
                })
                .catch((mutationError) => {
                    setError({ errorTitle: mutationError?.message, errorMessage: mutationError?.message })
                })
        },
        [mutate, setError, setSuccessedMutation],
    )

    return (
        <>
            <FormProvider {...formMethods}>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">
                            {isEdit ? t(`egov.${type}.editHeader`) + ` - ${data.existingEntityData?.name}` : t(`egov.${type}.createHeader`)}
                        </TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                        {(successedMutation || error) && <MutationFeedback success={successedMutation} error={error?.errorMessage} />}
                    </FlexColumnReverseWrapper>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <>
                            {!hiddenInputs?.NAME && <Input label={t('egov.name')} {...register('name')} error={formState?.errors.name?.message} />}
                            {!hiddenInputs?.ENG_NAME && (
                                <Input label={t('egov.engName')} {...register('engName')} error={formState?.errors?.engName?.message} />
                            )}
                            {!hiddenInputs?.TECHNICAL_NAME && (
                                <Input
                                    label={t('egov.technicalName')}
                                    {...register('technicalName')}
                                    error={formState?.errors?.technicalName?.message}
                                />
                            )}
                            {!hiddenInputs?.CODE_PREFIX && (
                                <Input label={t('egov.codePrefix')} {...register('codePrefix')} error={formState?.errors?.codePrefix?.message} />
                            )}
                            {!hiddenInputs?.URI_PREFIX && (
                                <Input label={t('egov.uriPrefix')} {...register('uriPrefix')} error={formState?.errors?.uriPrefix?.message} />
                            )}
                            {!hiddenInputs?.DESCRIPTION && (
                                <TextArea
                                    label={t('egov.description')}
                                    rows={3}
                                    {...register('description')}
                                    error={formState?.errors?.description?.message}
                                />
                            )}
                            {!hiddenInputs?.ENG_DESCRIPTION && (
                                <TextArea
                                    label={t('egov.engDescription')}
                                    rows={3}
                                    {...register('engDescription')}
                                    error={formState?.errors?.engDescription?.message}
                                />
                            )}
                            {!hiddenInputs?.TYPE && (
                                <SimpleSelect
                                    label={t('egov.type')}
                                    options={[
                                        { label: t('type.custom'), value: 'custom' },
                                        { value: 'application', label: t('type.application') },
                                        { value: 'system', label: t('type.system') },
                                    ]}
                                    name="type"
                                    defaultValue={data?.existingEntityData?.type || 'custom'}
                                    setValue={formMethods.setValue}
                                    disabled
                                />
                            )}
                            {!hiddenInputs?.ROLE_LIST && (
                                <div>
                                    <MultiSelect
                                        label={t('egov.roles')}
                                        options={roleList}
                                        name="roleList"
                                        setValue={formMethods.setValue}
                                        defaultValue={data?.existingEntityData?.roleList}
                                        error={formState?.errors?.roleList?.message}
                                    />
                                </div>
                            )}
                            {!hiddenInputs?.SOURCES && !hiddenInputs?.TARGETS && (
                                <div>
                                    <h3 className="govuk-heading-m">{t('egov.detail.connections')}</h3>
                                    <Button
                                        label={t('egov.create.addConnection')}
                                        onClick={() => setConnectionsOpen(true)}
                                        className={styles.addConnection}
                                    />
                                    <AddConnectionModal open={connectionsOpen} onClose={() => setConnectionsOpen(false)} />
                                    <ConnectionView sources={sourcesFromForm ?? []} targets={targetsFromForm ?? []} />
                                    {(formState?.errors?.sources || formState?.errors?.targets) && (
                                        <ErrorBlock errorMessage={t('egov.create.requiredField')} />
                                    )}
                                </div>
                            )}
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
                        {!hiddenInputs?.ATTRIBUTE_PROFILES && (
                            <div>
                                <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>
                                <AddAttributeProfilesModal
                                    open={profileAttributesDialog.open}
                                    onClose={() => profileAttributesDialog.setOpen(false)}
                                />
                                <Button label={t('egov.create.addProfile')} onClick={() => profileAttributesDialog.setOpen(true)} />
                                <ProfileTabs tabList={tabsFromForm} withoutHeading />
                            </div>
                        )}
                    </form>
                </QueryFeedback>
            </FormProvider>
        </>
    )
}
