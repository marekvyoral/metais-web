import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ErrorBlock } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUiAttributes, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeProfile, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { metaisEmail } from '@isdd/metais-common/constants'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { Gen_Profil, MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useMemo, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { filterFormValuesBasedOnCurrentRole, formatForFormDefaultValues } from '@/componentHelpers/ci'
import { CI_TYPE_DATA_TRAINING_BLACK_LIST, getModifiedCiTypeData } from '@/componentHelpers/ci/ciTypeBlackList'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { CreateEntitySection } from '@/components/create-entity/CreateEntitySection'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import {
    getFilteredAttributeProfilesBasedOnRole,
    getValidAndVisibleAttributes,
    useCiCreateEditOnStatusSuccess,
    useCiCreateUpdateOnSubmit,
} from '@/components/create-entity/createEntityHelpers'
import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'

interface AttributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
}

interface CreateEntityData {
    attributesData: AttributesData
    generatedEntityId: CiCode | undefined
    ownerId?: string
}

interface ICreateTrainingEntity {
    entityName: string
    data: CreateEntityData
    roleState?: RoleState
    publicAuthorityState?: PublicAuthorityState
    updateCiItemId?: string
    defaultItemAttributeValues?: ConfigurationItemUiAttributes
}

export const CreateTrainingEntity: React.FC<ICreateTrainingEntity> = ({
    data,
    entityName,
    updateCiItemId,
    defaultItemAttributeValues,
    roleState,
    publicAuthorityState,
}) => {
    const isUpdate = !!updateCiItemId
    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    const onStatusSuccess = useCiCreateEditOnStatusSuccess()

    const [hasReset, setHasReset] = useState(false)

    const { isError: isRedirectError, isLoading: isRedirectLoading, isProcessedError, getRequestStatus, isTooManyFetchesError } = useGetStatus()
    const { onSubmit, uploadError, setUploadError, configurationItemId } = useCiCreateUpdateOnSubmit(entityName)

    const storeConfigurationItem = useStoreConfigurationItem({
        mutation: {
            onError() {
                setUploadError(true)
            },
            async onSuccess(successData) {
                if (successData.requestId != null) {
                    await getRequestStatus(successData.requestId, () => onStatusSuccess({ configurationItemId, isUpdate, entityName }))
                } else {
                    setUploadError(true)
                }
            },
        },
    })

    useEffect(() => {
        if (!(isRedirectError || isProcessedError || isRedirectLoading) || isTooManyFetchesError || uploadError) {
            scrollToMutationFeedback()
        }
    }, [isProcessedError, isRedirectError, isRedirectLoading, isTooManyFetchesError, uploadError, scrollToMutationFeedback])

    const modifiedCiTypeData = useMemo(() => {
        return getModifiedCiTypeData(ciTypeData, CI_TYPE_DATA_TRAINING_BLACK_LIST)
    }, [ciTypeData])

    const attributes = useMemo(() => getValidAndVisibleAttributes(modifiedCiTypeData), [modifiedCiTypeData])

    const defaultValuesFromSchema = useMemo(() => {
        return attributes.reduce((acc, att) => {
            if (att?.defaultValue) {
                return { ...acc, [att?.technicalName?.toString() ?? '']: att?.defaultValue }
            }
            return acc
        }, {})
    }, [attributes])

    const formDefaultValues = useMemo(
        () => formatForFormDefaultValues(isUpdate ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes),
        [isUpdate, attributes, defaultItemAttributeValues, defaultValuesFromSchema],
    )

    const combinedProfiles = useMemo(
        () => [modifiedCiTypeData as AttributeProfile, ...(modifiedCiTypeData?.attributeProfiles ?? [])],
        [modifiedCiTypeData],
    )

    const formSchema = useMemo(() => {
        return generateFormSchema(
            isUpdate ? combinedProfiles : getFilteredAttributeProfilesBasedOnRole(combinedProfiles, roleState?.selectedRole?.roleName ?? ''),
            t,
            i18n.language,
            null,
            ciTypeData?.technicalName,
            formDefaultValues,
        )
    }, [isUpdate, combinedProfiles, roleState?.selectedRole?.roleName, t, i18n.language, ciTypeData?.technicalName, formDefaultValues])

    const methods = useForm({
        defaultValues: formDefaultValues,
        mode: 'onChange',
        resolver: yupResolver(formSchema),
    })
    const { handleSubmit, reset, formState, getValues, setValue } = methods

    useEffect(() => {
        if (!isUpdate) {
            const currentValues = getValues()
            const currentRole = roleState?.selectedRole
            const validAttributes = getValidAndVisibleAttributes(modifiedCiTypeData)

            const filteredFormValuesWithoutPermission = filterFormValuesBasedOnCurrentRole(
                combinedProfiles,
                currentRole?.roleName ?? '',
                currentValues,
            )

            reset(formatForFormDefaultValues(filteredFormValuesWithoutPermission, validAttributes))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleState?.selectedRole])

    useEffect(() => {
        const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
        const metaIsCodeValue = generatedEntityId?.cicode
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
        Object.entries(formDefaultValues).forEach((item) => {
            const element = formState.defaultValues?.[item[0]]
            if (element == '' || element == undefined) {
                setValue(item[0], item[1])
            }
        })
    }, [formState.defaultValues, formDefaultValues, setValue, generatedEntityId?.ciurl, generatedEntityId?.cicode])

    const handleFormSubmit = (formData: FieldValues) =>
        onSubmit({
            formData,
            updateCiItemId,
            storeCiItem: storeConfigurationItem.mutateAsync,
            ownerId: data.ownerId,
            generatedEntityId,
        })

    return (
        <>
            <MutationFeedback error={storeConfigurationItem.isError} />

            <QueryFeedback
                loading={isRedirectLoading}
                error={isRedirectError || isProcessedError || isTooManyFetchesError}
                indicatorProps={{
                    label: isUpdate ? t('createEntity.redirectLoadingEdit') : t('createEntity.redirectLoading'),
                }}
                errorProps={{
                    errorMessage: isTooManyFetchesError
                        ? t('createEntity.tooManyFetchesError')
                        : isUpdate
                        ? t('createEntity.redirectErrorEdit')
                        : t('createEntity.redirectError'),
                }}
                withChildren
            >
                <div ref={wrapperRef} />
                {!isUpdate && publicAuthorityState && roleState && (
                    <SelectPublicAuthorityAndRole
                        publicAuthorityLabel={t('trainings.trainingGestor')}
                        selectedRole={roleState.selectedRole ?? {}}
                        onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                        onChangeRole={roleState.setSelectedRole}
                        selectedOrg={publicAuthorityState.selectedPublicAuthority}
                        hideRoleSelect
                        ciRoles={modifiedCiTypeData?.roleList ?? []}
                    />
                )}

                <>
                    {uploadError && (
                        <div ref={wrapperRef}>
                            <ErrorBlock
                                errorTitle={t('createEntity.errorTitle')}
                                errorMessage={
                                    <>
                                        {t('createEntity.errorMessage')}
                                        <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                            {metaisEmail}
                                        </Link>
                                    </>
                                }
                            />
                        </div>
                    )}

                    {formState.isSubmitted && !formState.isValid && <ErrorBlock errorTitle={t('formErrors')} hidden />}

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                            <CreateEntitySection
                                hideErrorBlock
                                sectionId={Gen_Profil}
                                attributes={attributes}
                                constraintsData={constraintsData}
                                unitsData={unitsData}
                                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                                defaultItemAttributeValues={defaultItemAttributeValues}
                                hasResetState={{ hasReset, setHasReset }}
                                updateCiItemId={updateCiItemId}
                                sectionRoles={modifiedCiTypeData?.roleList ?? []}
                                selectedRole={roleState?.selectedRole}
                            />
                            <SubmitWithFeedback
                                additionalButtons={[
                                    <Button
                                        key={1}
                                        label={t('button.cancel')}
                                        type="reset"
                                        variant="secondary"
                                        onClick={() => {
                                            reset()
                                            setHasReset(true)
                                            navigate(-1)
                                        }}
                                    />,
                                ]}
                                submitButtonLabel={t('button.saveChanges')}
                                loading={storeConfigurationItem.isLoading || formState.isValidating || formState.isSubmitting}
                                // disabled={isSubmitDisabled}
                            />
                        </form>
                    </FormProvider>
                </>
            </QueryFeedback>
        </>
    )
}
