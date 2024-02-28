import { Button, ErrorBlock, IOption, Input, MultiSelect, SimpleSelect, Tab, TextArea, TextHeading } from '@isdd/idsk-ui-kit'
import { EntityColorEnum, EntityColorEnumTranslateKeys, MutationFeedback, QueryFeedback } from '@isdd/metais-common'
import { FieldValues, FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'
import { AttributeProfileType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useMemo } from 'react'

import { AddAttributeProfilesModal } from './attributes/AddAttributeProfilesModal'
import styles from './createEntityView.module.scss'
import { useCreateDialogs } from './hooks/useCreateDialogs'
import { useCreateForm } from './hooks/useCreateForm'
import { EntityDetailViewAttributes } from './attributes/EntityDetailViewAttributes'

import { ColorRow } from '@/components/views/egov/ColorRow'
import { ProfileTabs } from '@/components/ProfileTabs'
import { ICreateEntityView } from '@/components/containers/Egov/Entity/CreateEntityContainer'
import { AddConnectionModal } from '@/components/views/egov/relation-detail-views/connections/AddConnectionModal'
import ConnectionView from '@/components/views/egov/relation-detail-views/connections/ConnectionView'

export enum EntityType {
    ENTITY = 'entity',
    PROFILE = 'profile',
    RELATION = 'relation',
    ROLES = 'roles',
}

export const CreateEntityView = ({
    data,
    mutate,
    hiddenInputs,
    isError,
    isLoading,
    isEdit,
    type,
    refetch,
    disabledInputs,
    resetExistingAttribute,
    saveExistingAttribute,
    attributesOverridesData,
}: ICreateEntityView) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { setIsActionSuccess } = useActionSuccess()
    const location = useLocation()
    const {
        mutationSuccessResponse: { successedMutation, setSuccessedMutation },
        mutationErrorResponse: { error, setError },
        connectionsDialog: { connectionsOpen, setConnectionsOpen },
        profileAttributesDialog,
    } = useCreateDialogs()

    const colorOption: IOption<string>[] = [
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.customEntity}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.customEntity]}`)}
                />
            ),
            value: EntityColorEnum.customEntity,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.systemEntity}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.systemEntity]}`)}
                />
            ),
            value: EntityColorEnum.systemEntity,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.businessLayer}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.businessLayer]}`)}
                />
            ),
            value: EntityColorEnum.businessLayer,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.appAndDataLayer}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.appAndDataLayer]}`)}
                />
            ),
            value: EntityColorEnum.appAndDataLayer,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.technologicalLayer}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.technologicalLayer]}`)}
                />
            ),
            value: EntityColorEnum.technologicalLayer,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.implementationAndMigration}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.implementationAndMigration]}`)}
                />
            ),
            value: EntityColorEnum.implementationAndMigration,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.implementationAndMigration2}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.implementationAndMigration2]}`)}
                />
            ),
            value: EntityColorEnum.implementationAndMigration2,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.motivationalEntity}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.motivationalEntity]}`)}
                />
            ),
            value: EntityColorEnum.motivationalEntity,
        },
        {
            label: (
                <ColorRow
                    color={EntityColorEnum.motivationalEntity2}
                    label={t(`egov.colorSelect.${EntityColorEnumTranslateKeys[EntityColorEnum.motivationalEntity2]}`)}
                />
            ),
            value: EntityColorEnum.motivationalEntity2,
        },
    ]

    const entityType = type === EntityType.ENTITY
    const customTypeData = data?.existingEntityData?.type === AttributeProfileType.custom
    const disabledInputsTypes = useMemo(() => {
        if (type === EntityType.ENTITY) {
            return customTypeData || !isEdit ? { ...disabledInputs } : { ...disabledInputs, URI_PREFIX: true, DESCRIPTION: true, ROLE_LIST: true }
        }
        if (type === EntityType.PROFILE) {
            return { ...disabledInputs }
        }
        if (type === EntityType.RELATION) {
            return customTypeData || !isEdit
                ? { ...disabledInputs }
                : { ...disabledInputs, DESCRIPTION: true, ENG_DESCRIPTION: true, ENG_NAME: true, NAME: true }
        } else return { ...disabledInputs }
    }, [customTypeData, disabledInputs, isEdit, type])

    const { formMethods, tabsFromForm, sourcesFromForm, targetsFromForm } = useCreateForm({ data, hiddenInputs, disabledInputsTypes })

    const roleList =
        data?.roles?.map?.((role) => {
            return {
                value: role?.name ?? '',
                label: role?.description ?? '',
            }
        }) ?? []
    const { handleSubmit, formState, register, watch } = formMethods

    const onSubmit = async (formData: FieldValues) => {
        await mutate(formData)
            .then(() => {
                let route = ''
                if (type === EntityType.ENTITY) {
                    route = AdminRouteNames.EGOV_ENTITY
                } else if (type === EntityType.PROFILE) {
                    route = AdminRouteNames.EGOV_PROFILE
                } else if (type === EntityType.RELATION) {
                    route = AdminRouteNames.EGOV_RELATION
                }
                setSuccessedMutation(true)
                refetch && refetch()
                setIsActionSuccess({ value: true, path: `${route}/${formData?.technicalName}`, additionalInfo: { type: isEdit ? 'edit' : 'create' } })
                navigate(`${route}/${formData?.technicalName}`, { state: { from: location } })
            })
            .catch((mutationError) => {
                const errorResponse = JSON.parse(mutationError.message)
                const message =
                    errorResponse?.type === ReponseErrorCodeEnum.NTM01 ? t('egov.entity.technicalNameAlreadyExists') : errorResponse.message
                setError({ errorTitle: mutationError?.message, errorMessage: message })
            })
    }
    const tabGeneric: Tab[] = [
        {
            id: 'genericProfile',
            title: t('egov.detail.genericProfile'),
            content: (
                <EntityDetailViewAttributes
                    roles={data?.roles}
                    data={{ ...data?.existingEntityData, name: t('egov.detail.genericProfile'), technicalName: 'Gen_Profil_Rel' }}
                    attributesOverridesData={attributesOverridesData}
                    saveExistingAttribute={saveExistingAttribute}
                    resetExistingAttribute={resetExistingAttribute}
                />
            ),
        },
        ...tabsFromForm,
    ]

    return (
        <>
            <FormProvider {...formMethods}>
                <QueryFeedback loading={isLoading} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">
                            {isEdit ? t(`egov.${type}.editHeader`) + ` - ${data.existingEntityData?.name}` : t(`egov.${type}.createHeader`)}
                        </TextHeading>
                        {isError && <QueryFeedback error loading={false} />}
                        {(successedMutation || error) && (
                            <MutationFeedback
                                success={successedMutation}
                                error={error?.errorMessage}
                                onMessageClose={() => {
                                    setError(undefined)
                                    setSuccessedMutation(false)
                                }}
                            />
                        )}
                    </FlexColumnReverseWrapper>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <>
                            {!hiddenInputs?.NAME && (
                                <Input
                                    label={t('egov.name') + ' ' + t('input.requiredField')}
                                    {...register('name')}
                                    error={formState?.errors.name?.message}
                                    disabled={disabledInputsTypes?.NAME}
                                />
                            )}
                            {!hiddenInputs?.ENG_NAME && (
                                <Input
                                    label={t('egov.engName') + ' ' + t('input.requiredField')}
                                    {...register('engName')}
                                    error={formState?.errors?.engName?.message}
                                    disabled={disabledInputsTypes?.ENG_NAME}
                                />
                            )}
                            {!hiddenInputs?.TECHNICAL_NAME && (
                                <Input
                                    label={t('egov.technicalName') + ' ' + t('input.requiredField')}
                                    {...register('technicalName')}
                                    error={formState?.errors?.technicalName?.message}
                                    disabled={disabledInputsTypes?.TECHNICAL_NAME}
                                />
                            )}
                            {!hiddenInputs?.CODE_PREFIX && (
                                <Input
                                    label={t('egov.codePrefix') + ' ' + t('input.requiredField')}
                                    {...register('codePrefix')}
                                    error={formState?.errors?.codePrefix?.message}
                                    disabled={disabledInputsTypes?.CODE_PREFIX}
                                />
                            )}
                            {!hiddenInputs?.URI_PREFIX && (
                                <Input
                                    label={t('egov.uriPrefix') + ' ' + t('input.requiredField')}
                                    {...register('uriPrefix')}
                                    error={formState?.errors?.uriPrefix?.message}
                                    disabled={disabledInputsTypes?.URI_PREFIX}
                                />
                            )}
                            {!hiddenInputs?.DESCRIPTION && (
                                <TextArea
                                    label={t('egov.description')}
                                    rows={3}
                                    {...register('description')}
                                    error={formState?.errors?.description?.message}
                                    disabled={disabledInputsTypes?.DESCRIPTION}
                                />
                            )}
                            {!hiddenInputs?.ENG_DESCRIPTION && (
                                <TextArea
                                    label={t('egov.engDescription')}
                                    rows={3}
                                    {...register('engDescription')}
                                    error={formState?.errors?.engDescription?.message}
                                    disabled={disabledInputsTypes?.ENG_DESCRIPTION}
                                />
                            )}
                            {!hiddenInputs?.TYPE && (
                                <SimpleSelect
                                    label={t('egov.type')}
                                    options={[
                                        { value: 'custom', label: t('tooltips.type.custom') },
                                        { value: 'application', label: t('tooltips.type.application') },
                                        { value: 'system', label: t('tooltips.type.system') },
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
                                        label={t('egov.roles') + ' ' + t('input.requiredField')}
                                        options={roleList}
                                        name="roleList"
                                        setValue={formMethods.setValue}
                                        value={watch().roleList?.map((role) => role ?? '')}
                                        error={formState?.errors?.roleList?.message}
                                        disabled={disabledInputsTypes?.ROLE_LIST}
                                    />
                                </div>
                            )}
                            {entityType && (
                                <SimpleSelect
                                    label={t('egov.color')}
                                    name={'color'}
                                    options={colorOption}
                                    setValue={formMethods.setValue}
                                    defaultValue={data?.existingEntityData?.color}
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
                                        <ErrorBlock errorMessage={t('egov.create.requiredOneSourceOneDestination')} />
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
                                {isEdit ? <ProfileTabs tabList={tabGeneric} withoutHeading /> : <ProfileTabs tabList={tabsFromForm} withoutHeading />}
                            </div>
                        )}
                    </form>
                </QueryFeedback>
            </FormProvider>
        </>
    )
}
