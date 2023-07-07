import React, { useCallback, useState } from 'react'
import { Button, ErrorBlock, Input, SimpleSelect, TextArea } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { createTabNamesAndValuesMap } from '@isdd/metais-common/hooks/useEntityProfiles'
import { getTabsFromApi, MutationFeedback, MutationFeedbackError } from '@isdd/metais-common'
import { AttributeProfile, Cardinality, CiTypePreview } from '@isdd/metais-common/api'

import ConnectionView from '../relation-detail-views/ConnectionView'
import { AddConnectionModal } from '../relation-detail-views/AddConnectionModal'

import { AddAttributeProfilesModal } from './AddAttributeProfilesModal'
import { EntityDetailViewAttributes } from './EntityDetailViewAttributes'
import styles from './createEntityView.module.scss'

import { ProfileTabs } from '@/components/ProfileTabs'
import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'

export const CreateEntityView = ({ data, mutate, hiddenInputs }: ICreateEntityView) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)
    const [connectionsOpen, setConnectionsOpen] = useState<boolean>(false)
    const [successedMutation, setSuccessedMutation] = useState<boolean>(false)
    const [error, setError] = useState<MutationFeedbackError | undefined>(undefined)

    const schema = yup.object().shape(
        {
            name: yup.string().required(t('egov.create.requiredField')),
            engName: yup.string().required(t('egov.create.requiredField')),
            technicalName: yup
                .string()
                .required(t('egov.create.requiredField'))
                .min(2)
                .matches(/^[a-z-A-Z]+$/, t('egov.create.technicalNameRegex')),
            codePrefix: yup.string().when('codePrefix', {
                is: () => !hiddenInputs?.CODE_PREFIX,
                then: () =>
                    yup
                        .string()
                        .required(t('egov.create.requiredField'))
                        .matches(/^[a-z_\s]+$/, t('egov.create.codePrefixRegex')),
                otherwise: () => yup.string(),
            }),
            uriPrefix: yup.string().when('uriPrefix', {
                is: () => !hiddenInputs?.URI_PREFIX,
                then: () => yup.string().required(t('egov.create.requiredField')),
                otherwise: () => yup.string(),
            }),
            description: yup.string().required(t('egov.create.requiredField')),
            engDescription: yup.string().when('engDescription', {
                is: () => !hiddenInputs?.ENG_DESCRIPTION,
                then: () => yup.string().required(t('egov.create.requiredField')),
            }),
            attributeProfiles: yup.mixed<AttributeProfile[]>(),
            roleList: yup.array().of(yup.string()).required(t('egov.create.requiredField')),
            type: yup.string().required(t('egov.create.requiredField')),
            sources: yup.mixed<CiTypePreview[]>().when('sources', {
                is: () => !hiddenInputs?.SOURCES,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            sourceCardinality: yup.mixed<Cardinality>(),
            targets: yup.mixed<CiTypePreview[]>().when('targets', {
                is: () => !hiddenInputs?.TARGETS,
                then: () => yup.array().required(t('egov.create.requiredField')),
            }),
            targetCardinality: yup.mixed<Cardinality>(),
        },
        [
            ['uriPrefix', 'uriPrefix'],
            ['codePrefix', 'codePrefix'],
            ['sources', 'sources'],
            ['targets', 'targets'],
            ['engDescription', 'engDescription'],
        ],
    )

    const { register, handleSubmit, formState, watch, control, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            type: 'custom',
        },
    })

    const rolesToSelect =
        data?.roles?.map?.((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []

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
        [mutate],
    )

    const attributesProfiles = watch('attributeProfiles')
    const keysToDisplay = createTabNamesAndValuesMap(attributesProfiles)

    const removeProfileAttribute = (technicalName: string) => {
        setValue('attributeProfiles', attributesProfiles?.filter((attrProfile) => attrProfile?.technicalName !== technicalName) ?? [])
    }

    const tabsFromForm = getTabsFromApi(keysToDisplay, EntityDetailViewAttributes, removeProfileAttribute)

    const sources = watch('sources')
    const targets = watch('targets')
    return (
        <>
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
                            <AddConnectionModal
                                open={connectionsOpen}
                                onClose={() => setConnectionsOpen(false)}
                                setValue={setValue}
                                control={control}
                            />
                            <ConnectionView sources={sources as CiTypePreview[]} targets={targets as CiTypePreview[]} />
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
                        <AddAttributeProfilesModal open={open} onClose={() => setOpen(false)} control={control} setValue={setValue} />
                        <Button label={t('egov.create.addProfile')} onClick={() => setOpen(true)} />
                        <ProfileTabs tabList={tabsFromForm} withoutHeading />
                    </div>
                )}
            </form>
        </>
    )
}
