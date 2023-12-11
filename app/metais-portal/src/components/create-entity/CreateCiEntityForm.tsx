import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { Stepper } from '@isdd/idsk-ui-kit/src/stepper/Stepper'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { AttributeProfile, CiCode, CiType, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { CreateEntitySection } from './CreateEntitySection'
import { generateFormSchema } from './createCiEntityFormSchema'
import styles from './createEntity.module.scss'
import { canCreateProject, getFilteredAttributeProfilesBasedOnRole } from './createEntityHelpers'

import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { RelationAttributeForm } from '@/components/relations-attribute-form/RelationAttributeForm'
import { filterFormValuesBasedOnCurrentRole, formatForFormDefaultValues } from '@/componentHelpers/ci'
export interface HasResetState {
    hasReset: boolean
    setHasReset: Dispatch<SetStateAction<boolean>>
}
interface ICreateCiEntityForm {
    generatedEntityId: CiCode
    constraintsData: (EnumType | undefined)[]
    ciTypeData: CiType | undefined
    uploadError: boolean
    onSubmit: (formData: FieldValues) => void
    unitsData: EnumType | undefined
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    updateCiItemId?: string
    relationSchema?: RelationshipType
    isProcessing: boolean
    withRelation?: boolean
    selectedRole: GidRoleData | null
}

export const CreateCiEntityForm: React.FC<ICreateCiEntityForm> = ({
    ciTypeData,
    unitsData,
    constraintsData,
    generatedEntityId,
    uploadError,
    onSubmit,
    defaultItemAttributeValues,
    updateCiItemId,
    relationSchema,
    isProcessing,
    withRelation,
    selectedRole,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const ability = useAbilityContext()
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)

    const hasRightsToCreateProject = canCreateProject(ciTypeData?.technicalName ?? '', selectedRole?.roleName ?? '')

    const isUpdate = !!updateCiItemId
    const isSubmitDisabled =
        (!selectedRole?.roleUuid && !updateCiItemId) || (withRelation ? !canCreateRelationType : false) || (!hasRightsToCreateProject && !isUpdate)

    const [hasReset, setHasReset] = useState(false)
    const genProfilTechName = Gen_Profil
    const metaisEmail = 'metais@mirri.gov.sk'
    const location = useLocation()
    const attProfiles = ciTypeData?.attributeProfiles?.map((profile) => profile) ?? []

    const attProfileTechNames = attProfiles.map((profile) => profile.technicalName)
    const mappedProfileTechNames: Record<string, boolean> = attProfileTechNames.reduce<Record<string, boolean>>((accumulator, attributeName) => {
        if (attributeName != null) {
            accumulator[attributeName] = false
        }
        return accumulator
    }, {})
    const attributes = [...(ciTypeData?.attributes ?? []), ...attProfiles.map((profile) => profile.attributes).flat()]
        .filter((att) => !att?.invisible)
        .filter((att) => att?.valid)

    const sectionErrorDefaultConfig: { [x: string]: boolean } = {
        [genProfilTechName]: false,
        ...mappedProfileTechNames,
    }
    const [sectionError, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

    const defaultValuesFromSchema = attributes.reduce((acc, att) => {
        if (att?.defaultValue) {
            return { ...acc, [att?.technicalName?.toString() ?? '']: att?.defaultValue }
        }
        return acc
    }, {})

    const combinedProfiles = [ciTypeData as AttributeProfile, ...attProfiles]

    const methods = useForm({
        defaultValues: formatForFormDefaultValues(isUpdate ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes),
        resolver: yupResolver(
            generateFormSchema(
                isUpdate ? combinedProfiles : getFilteredAttributeProfilesBasedOnRole(combinedProfiles, selectedRole?.roleName ?? ''),
                t,
            ),
        ),
    })

    const { handleSubmit, setValue, reset, formState, getValues } = methods

    useEffect(() => {
        if (!isUpdate) {
            const currentValues = getValues()
            const currentRole = selectedRole

            const filteredFormValuesWithoutPermission = filterFormValuesBasedOnCurrentRole(
                combinedProfiles,
                currentRole?.roleName ?? '',
                currentValues,
            )

            reset(formatForFormDefaultValues(filteredFormValuesWithoutPermission, attributes))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRole])

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    const sections: ISection[] =
        [
            {
                title: t('ciInformationAccordion.basicInformation'),
                error: sectionError[genProfilTechName] === true,
                stepLabel: { label: '1', variant: 'circle' },
                content: (
                    <CreateEntitySection
                        sectionId={genProfilTechName}
                        attributes={ciTypeData?.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                        setSectionError={setSectionError}
                        constraintsData={constraintsData}
                        unitsData={unitsData}
                        generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                        defaultItemAttributeValues={defaultItemAttributeValues}
                        hasResetState={{ hasReset, setHasReset }}
                        updateCiItemId={updateCiItemId}
                        sectionRoles={ciTypeData?.roleList ?? []}
                        selectedRole={selectedRole}
                    />
                ),
            },
            ...attProfiles.map((profile, index) => ({
                title: (i18n.language === Languages.SLOVAK ? profile.description : profile.engDescription) ?? profile.name ?? '',
                stepLabel: { label: (index + 2).toString(), variant: 'circle' } as IStepLabel,
                last: relationSchema ? false : attProfiles.length === index + 1 ? true : false,
                error: sectionError[profile.technicalName ?? ''] === true,
                content: (
                    <CreateEntitySection
                        sectionId={profile.technicalName ?? ''}
                        attributes={profile.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                        setSectionError={setSectionError}
                        constraintsData={constraintsData}
                        generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                        unitsData={unitsData}
                        defaultItemAttributeValues={defaultItemAttributeValues}
                        hasResetState={{ hasReset, setHasReset }}
                        updateCiItemId={updateCiItemId}
                        sectionRoles={profile.roleList ?? []}
                        selectedRole={selectedRole}
                    />
                ),
            })),
        ] ?? []

    const newRelationSections = [
        ...sections,
        {
            title: t('newRelation.relation'),
            last: true,
            stepLabel: { label: (attProfiles.length + 2).toString(), variant: 'circle' } as IStepLabel,
            content: (
                <RelationAttributeForm
                    relationSchema={relationSchema}
                    hasResetState={{ hasReset, setHasReset }}
                    constraintsData={constraintsData}
                    unitsData={unitsData}
                />
            ),
        },
    ]

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (uploadError) {
            scrollToMutationFeedback()
        }
    }, [scrollToMutationFeedback, uploadError])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {uploadError && (
                    <div ref={wrapperRef}>
                        <ErrorBlock
                            errorTitle={t('createEntity.errorTitle')}
                            errorMessage={
                                <>
                                    {t('createEntity.errorMessage')}
                                    <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                        {t('createEntity.email')}
                                    </Link>
                                </>
                            }
                        />
                    </div>
                )}
                <Stepper subtitleTitle="" stepperList={relationSchema ? newRelationSections : sections} />

                <SubmitWithFeedback
                    className={styles.buttonGroup}
                    additionalButtons={[
                        <Button
                            key={1}
                            label={t('button.cancel')}
                            type="reset"
                            variant="secondary"
                            onClick={() => {
                                reset()
                                setHasReset(true)
                                //back to where we came from
                                navigate(-1)
                            }}
                        />,
                    ]}
                    submitButtonLabel={t('button.saveChanges')}
                    loading={isProcessing || formState.isValidating || formState.isSubmitting}
                    disabled={isSubmitDisabled}
                />
            </form>
        </FormProvider>
    )
}
