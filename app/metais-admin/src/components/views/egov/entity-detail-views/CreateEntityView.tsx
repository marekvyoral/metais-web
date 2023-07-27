import React, { useCallback } from 'react'
import { Button, ErrorBlock, Input, MultiSelect, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { FieldValues, FormProvider } from 'react-hook-form'
import { MutationFeedback } from '@isdd/metais-common'
import { useTranslation } from 'react-i18next'

import ConnectionView from '../relation-detail-views/connections/ConnectionView'
import { AddConnectionModal } from '../relation-detail-views/connections/AddConnectionModal'

import { AddAttributeProfilesModal } from './attributes/AddAttributeProfilesModal'
import styles from './createEntityView.module.scss'
import { useCreateDialogs } from './hooks/useCreateDialogs'
import { useCreateForm } from './hooks/useCreateForm'

import { ProfileTabs } from '@/components/ProfileTabs'
import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'

export const CreateEntityView = ({ data, mutate, hiddenInputs }: ICreateEntityView) => {
    const { t } = useTranslation()

    const {
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        profileAttributesDialog,
    } = useCreateDialogs()

    const { formMethods, tabsFromForm, sourcesFromForm, targetsFromForm, selectedRoles } = useCreateForm({ data, hiddenInputs })

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
                {(successedMutation || error) && <MutationFeedback success={successedMutation} error={error} />}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <>
                        {!hiddenInputs?.NAME && <Input label={t('egov.name')} {...register('name')} error={formState?.errors.name?.message} />}
                        {!hiddenInputs?.ENG_NAME && (
                            <Input label={t('egov.engName')} {...register('engName')} error={formState?.errors?.engName?.message} />
                        )}
                        {!hiddenInputs?.TECHNICAL_NAME && (
                            <Input label={t('egov.technicalName')} {...register('technicalName')} error={formState?.errors?.technicalName?.message} />
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
                                options={[{ label: t('type.custom'), value: 'custom' }]}
                                {...register('type')}
                                disabled
                            />
                        )}
                        {!hiddenInputs?.ROLE_LIST && (
                            <div>
                                <MultiSelect
                                    label={t('egov.roles')}
                                    options={roleList}
                                    values={selectedRoles ?? []}
                                    name="roleList"
                                    onChange={(newValue) => {
                                        formMethods?.setValue(
                                            'roleList',
                                            newValue?.map((v) => v?.value),
                                        )
                                    }}
                                />
                                {formState?.errors?.roleList && <ErrorBlock errorMessage={t('egov.create.requiredField')} />}
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
                        </div>
                    </>
                    {!hiddenInputs?.ATTRIBUTE_PROFILES && (
                        <div>
                            <h3 className="govuk-heading-m">{t('egov.detail.profiles')}</h3>
                            <AddAttributeProfilesModal open={profileAttributesDialog.open} onClose={() => profileAttributesDialog.setOpen(false)} />
                            <Button label={t('egov.create.addProfile')} onClick={() => profileAttributesDialog.setOpen(true)} />
                            <ProfileTabs tabList={tabsFromForm} withoutHeading />
                        </div>
                    )}
                </form>
            </FormProvider>
        </>
    )
}
