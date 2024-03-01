import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ErrorBlock } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUiAttributes, useStoreConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeProfile, CiCode, CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ATTRIBUTE_NAME, Gen_Profil, MutationFeedback, QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useMemo, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { metaisEmail } from '@isdd/metais-common/constants'

import { filterFormValuesBasedOnCurrentRole, formatForFormDefaultValues } from '@/componentHelpers/ci'
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

const ATTRIBUTE_WHITE_LIST = [ATTRIBUTE_NAME.Gen_Profil_nazov, ATTRIBUTE_NAME.Gen_Profil_popis]

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

    const isSubmitDisabled = !roleState?.selectedRole?.roleUuid && !updateCiItemId

    const attProfiles = useMemo(() => ciTypeData?.attributeProfiles?.map((profile) => profile) ?? [], [ciTypeData?.attributeProfiles])
    const attProfileTechNames = attProfiles.map((profile) => profile.technicalName)
    const mappedProfileTechNames: Record<string, boolean> = attProfileTechNames.reduce<Record<string, boolean>>((accumulator, attributeName) => {
        if (attributeName != null) {
            accumulator[attributeName] = false
        }
        return accumulator
    }, {})

    const attributes = useMemo(() => getValidAndVisibleAttributes(ciTypeData), [ciTypeData])

    const sectionErrorDefaultConfig: { [x: string]: boolean } = {
        [Gen_Profil]: false,
        ...mappedProfileTechNames,
    }
    const [, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

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

    const trainingProfileAttributes = attProfiles.find((item) => item.technicalName === ATTRIBUTE_NAME.Profil_Skolenie)?.attributes ?? []
    const filteredCiAttributes =
        ciTypeData?.attributes?.filter((item) => ATTRIBUTE_WHITE_LIST.includes((item.technicalName as unknown as ATTRIBUTE_NAME) ?? '')) ?? []

    const trainingAttributeList = [...filteredCiAttributes, ...trainingProfileAttributes]

    const combinedProfiles = useMemo(() => [ciTypeData as AttributeProfile, ...(ciTypeData?.attributeProfiles ?? [])], [ciTypeData])

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
            const validAttributes = getValidAndVisibleAttributes(ciTypeData)

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
            {!(isRedirectError || isProcessedError || isRedirectLoading) && (
                <MutationFeedback success={false} showSupportEmail error={storeConfigurationItem.isError ? t('createEntity.mutationError') : ''} />
            )}

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
                        selectedRole={roleState.selectedRole ?? {}}
                        onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                        onChangeRole={roleState.setSelectedRole}
                        selectedOrg={publicAuthorityState.selectedPublicAuthority}
                        ciRoles={ciTypeData?.roleList ?? []}
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

                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
                            <CreateEntitySection
                                sectionId={Gen_Profil}
                                attributes={trainingAttributeList}
                                setSectionError={setSectionError}
                                constraintsData={constraintsData}
                                unitsData={unitsData}
                                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                                defaultItemAttributeValues={defaultItemAttributeValues}
                                hasResetState={{ hasReset, setHasReset }}
                                updateCiItemId={updateCiItemId}
                                sectionRoles={ciTypeData?.roleList ?? []}
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
                                disabled={isSubmitDisabled}
                            />
                        </form>
                    </FormProvider>
                </>
            </QueryFeedback>
        </>
    )
}
