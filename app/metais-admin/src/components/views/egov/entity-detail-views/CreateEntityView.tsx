import React, { useCallback } from 'react'
import { Button, ErrorBlock, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { FieldName, FieldValues, FormProvider, RegisterOptions } from 'react-hook-form'
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
        profileAttributesDialog,
    } = useCreateView({ data, hiddenInputs })

    const { handleSubmit, formState } = formMethods

    // Need todo typesafe, probably override useForm hook with custom register typesafe...
    const register = (inputName: string, options?: RegisterOptions<FieldValues, FieldName<FieldValues>>) => {
        return {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            ...formMethods?.register(inputName, options),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            error: formMethods?.formState?.errors?.[inputName],
        }
    }

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
                        {!hiddenInputs?.NAME && <Input label={t('egov.name')} {...register('name')} />}
                        {!hiddenInputs?.ENG_NAME && <Input label={t('egov.engName')} {...register('engName')} />}
                        {!hiddenInputs?.TECHNICAL_NAME && <Input label={t('egov.technicalName')} {...register('technicalName')} />}
                        {!hiddenInputs?.CODE_PREFIX && <Input label={t('egov.codePrefix')} {...register('codePrefix')} />}
                        {!hiddenInputs?.URI_PREFIX && <Input label={t('egov.uriPrefix')} {...register('uriPrefix')} />}
                        {!hiddenInputs?.DESCRIPTION && <TextArea label={t('egov.description')} rows={3} {...register('description')} />}
                        {!hiddenInputs?.ENG_DESCRIPTION && <TextArea label={t('egov.engDescription')} rows={3} {...register('engDescription')} />}
                        {!hiddenInputs?.TYPE && (
                            <SimpleSelect
                                label={t('egov.type')}
                                options={[{ label: t('type.custom'), value: 'custom' }]}
                                {...register('type')}
                                disabled
                            />
                        )}
                        {!hiddenInputs?.ROLE_LIST && (
                            <SimpleSelect
                                label={t('egov.roles')}
                                options={[{ label: t('egov.detail.selectOption'), value: '', disabled: true }, ...rolesToSelect]}
                                defaultValue={''}
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
