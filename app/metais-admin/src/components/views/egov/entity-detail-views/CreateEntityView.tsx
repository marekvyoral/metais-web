import React, { useCallback } from 'react'
import { Button, ErrorBlock, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { FieldValues, FormProvider } from 'react-hook-form'
import { MutationFeedback } from '@isdd/metais-common'

import ConnectionView from '../relation-detail-views/ConnectionView'
import { AddConnectionModal } from '../relation-detail-views/AddConnectionModal'

import { AddAttributeProfilesModal } from './AddAttributeProfilesModal'
import styles from './createEntityView.module.scss'
import useCreateView from './useCreateView'

import { ProfileTabs } from '@/components/ProfileTabs'
import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'

export const CreateEntityView = ({ data, mutate, hiddenInputs }: ICreateEntityView) => {
    const {
        formMethods,
        rolesToSelect,
        t,
        sourcesFromForm,
        targetsFromForm,
        tabsFromForm,
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        profileAttributesDialog: { open, setOpen },
    } = useCreateView({ data, hiddenInputs })

    const { register, handleSubmit, formState } = formMethods

    const onSubmit = useCallback(
        async (formData: FieldValues) => {
            await mutate({
                data: {
                    ...formData,
                },
            })
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
                        {!hiddenInputs?.NAME && <Input label={t('egov.name')} id="name" {...register('name')} error={formState?.errors?.name} />}
                        {!hiddenInputs?.ENG_NAME && (
                            <Input label={t('egov.engName')} id="engName" {...register('engName')} error={formState?.errors?.engName} />
                        )}
                        {!hiddenInputs?.TECHNICAL_NAME && (
                            <Input
                                label={t('egov.technicalName')}
                                id="technicalName"
                                {...register('technicalName')}
                                error={formState?.errors?.technicalName}
                            />
                        )}
                        {!hiddenInputs?.CODE_PREFIX && (
                            <Input label={t('egov.codePrefix')} id="codePrefix" {...register('codePrefix')} error={formState?.errors?.codePrefix} />
                        )}
                        {!hiddenInputs?.URI_PREFIX && (
                            <Input label={t('egov.uriPrefix')} id="uriPrefix" {...register('uriPrefix')} error={formState?.errors?.uriPrefix} />
                        )}
                        {!hiddenInputs?.DESCRIPTION && (
                            <TextArea
                                label={t('egov.description')}
                                id="description"
                                rows={3}
                                {...register('description')}
                                error={formState?.errors?.description}
                            />
                        )}
                        {!hiddenInputs?.ENG_DESCRIPTION && (
                            <TextArea
                                label={t('egov.engDescription')}
                                id="engDescription"
                                rows={3}
                                {...register('engDescription')}
                                error={formState?.errors?.engDescription}
                            />
                        )}
                        {!hiddenInputs?.TYPE && (
                            <SimpleSelect
                                id="type"
                                label={t('egov.type')}
                                options={[{ label: t('type.custom'), value: 'custom' }]}
                                {...register('type')}
                                disabled
                            />
                        )}
                        {!hiddenInputs?.ROLE_LIST && (
                            <SimpleSelect
                                id="roleList"
                                label={t('egov.roles')}
                                options={rolesToSelect}
                                {...register('roleList', {
                                    setValueAs: (val) => [val],
                                })}
                            />
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
                                <ConnectionView sources={sourcesFromForm} targets={targetsFromForm} />
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
                            <AddAttributeProfilesModal open={open} onClose={() => setOpen(false)} />
                            <Button label={t('egov.create.addProfile')} onClick={() => setOpen(true)} />
                            <ProfileTabs tabList={tabsFromForm} withoutHeading />
                        </div>
                    )}
                </form>
            </FormProvider>
        </>
    )
}
