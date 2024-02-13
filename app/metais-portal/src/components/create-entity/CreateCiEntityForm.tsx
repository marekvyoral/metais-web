import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { Gen_Profil } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUiAttributes, HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { CiCode, CiType, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { CreateEntitySection } from './CreateEntitySection'
import { canCreateProject, getValidAndVisibleAttributes } from './createEntityHelpers'
import { CiEntityFormBody } from './CiEntityFormBody'

import { RelationAttributeForm } from '@/components/relations-attribute-form/RelationAttributeForm'
import { formatForFormDefaultValues } from '@/componentHelpers/ci'

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
    isProcessing?: boolean
    withRelation?: boolean
    selectedRole?: GidRoleData | null
    selectedOrg?: HierarchyRightsUi | null
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
    selectedOrg,
}) => {
    const { t, i18n } = useTranslation()
    const [hasReset, setHasReset] = useState(false)

    const ability = useAbilityContext()
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)
    const hasRightsToCreateProject = canCreateProject(ciTypeData?.technicalName ?? '', selectedRole?.roleName ?? '')
    const isUpdate = !!updateCiItemId
    const isSubmitDisabled =
        (!selectedRole?.roleUuid && !updateCiItemId) || (withRelation ? !canCreateRelationType : false) || (!hasRightsToCreateProject && !isUpdate)

    const metaisEmail = 'metais@mirri.gov.sk'
    const location = useLocation()
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
    const [sectionError, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

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

    const sections: ISection[] =
        [
            {
                title: t('ciInformationAccordion.basicInformation'),
                error: sectionError[Gen_Profil] === true,
                stepLabel: { label: '1', variant: 'circle' },
                content: (
                    <CreateEntitySection
                        sectionId={Gen_Profil}
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
            <CiEntityFormBody
                generatedEntityId={generatedEntityId}
                ciTypeData={ciTypeData}
                onSubmit={onSubmit}
                isProcessing={isProcessing}
                selectedRole={selectedRole}
                stepperList={relationSchema ? newRelationSections : sections}
                formDefaultValues={formDefaultValues}
                isUpdate={isUpdate}
                setHasReset={setHasReset}
                isSubmitDisabled={isSubmitDisabled}
                selectedOrg={selectedOrg}
            />
        </>
    )
}
