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
import { FieldValues, FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { KRIS_Profil_nazov, metaisEmail } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { CiEntityFormBody } from './CiEntityFormBody'
import { CreateEntitySection } from './CreateEntitySection'
import { getValidAndVisibleAttributes } from './createEntityHelpers'

import { formatForFormDefaultValues } from '@/componentHelpers/ci'
import { RelationAttributeForm } from '@/components/relations-attribute-form/RelationAttributeForm'

export interface HasResetState {
    hasReset: boolean
    setHasReset: Dispatch<SetStateAction<boolean>>
}
interface ICreateCiEntityForm {
    entityName: string
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

export const CreateKrisEntityForm: React.FC<ICreateCiEntityForm> = ({
    entityName,
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
    const { state } = useAuth()
    const [hasReset, setHasReset] = useState(false)
    const [sections, setSections] = useState<ISection[]>([])

    const ability = useAbilityContext()
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)
    const isUpdate = !!updateCiItemId
    const isSubmitDisabled = (!selectedRole?.roleUuid && !updateCiItemId) || (withRelation ? !canCreateRelationType : false)

    const location = useLocation()
    const attProfiles = useMemo(() => ciTypeData?.attributeProfiles?.map((profile) => profile) ?? [], [ciTypeData?.attributeProfiles])
    const attProfileTechNames = useMemo(() => attProfiles.map((profile) => profile.technicalName), [attProfiles])
    const mappedProfileTechNames: Record<string, boolean> = useMemo(
        () =>
            attProfileTechNames.reduce<Record<string, boolean>>((accumulator, attributeName) => {
                if (attributeName != null) {
                    accumulator[attributeName] = false
                }
                return accumulator
            }, {}),
        [attProfileTechNames],
    )

    const attributes = useMemo(() => getValidAndVisibleAttributes(ciTypeData), [ciTypeData])
    const defaultValuesFromSchema = useMemo(() => {
        return attributes.reduce((acc, att) => {
            if (att?.defaultValue) {
                return { ...acc, [att?.technicalName?.toString() ?? '']: att?.defaultValue }
            } else {
                if (!isUpdate) {
                    switch (att?.technicalName) {
                        case 'Gen_Profil_nazov':
                            return {
                                ...acc,
                                [att?.technicalName?.toString() ?? '']: `${KRIS_Profil_nazov} ${selectedOrg?.poName ? selectedOrg?.poName : ''}`,
                            }
                        case 'Profil_KRIS_stav_kris':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: 'c_stav_kris.1' }
                        case 'Profil_KRIS_Spracovatel_meno':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: state.user?.firstName }
                        case 'Profil_KRIS_Spracovatel_priezvisko':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: state.user?.lastName }
                        case 'Profil_KRIS_Spracovatel_funkcia':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: state.user?.position === 'null' ? '' : state.user?.position }
                        case 'Profil_KRIS_Spracovatel_telefon':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: state.user?.mobile }
                        case 'Profil_KRIS_Spracovatel_email':
                            return { ...acc, [att?.technicalName?.toString() ?? '']: state.user?.email }
                    }
                }
            }

            return acc
        }, {})
    }, [
        attributes,
        isUpdate,
        selectedOrg?.poName,
        state.user?.email,
        state.user?.firstName,
        state.user?.lastName,
        state.user?.mobile,
        state.user?.position,
    ])

    const formDefaultValues = useMemo(
        () => formatForFormDefaultValues(isUpdate ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes),
        [isUpdate, attributes, defaultItemAttributeValues, defaultValuesFromSchema],
    )

    const sectionErrorDefaultConfig: { [x: string]: boolean } = useMemo(
        () => ({
            [Gen_Profil]: false,
            ...mappedProfileTechNames,
        }),
        [mappedProfileTechNames],
    )

    const [sectionError, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

    useEffect(() => {
        const result: ISection[] =
            [
                {
                    title: t('ciInformationAccordion.basicInformation'),
                    stepLabel: { label: '1', variant: 'circle' },
                    error: sectionError[Gen_Profil] === true,
                    id: Gen_Profil,
                    isOpen: sections.find((item) => item.id === Gen_Profil)?.isOpen,
                    content: (
                        <CreateEntitySection
                            sectionId={Gen_Profil}
                            attributes={ciTypeData?.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                            constraintsData={constraintsData}
                            unitsData={unitsData}
                            generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                            defaultItemAttributeValues={defaultItemAttributeValues}
                            hasResetState={{ hasReset, setHasReset }}
                            updateCiItemId={updateCiItemId}
                            setSectionError={setSectionError}
                            sectionRoles={ciTypeData?.roleList ?? []}
                            selectedRole={selectedRole}
                        />
                    ),
                },
                ...attProfiles.map((profile, index) => {
                    return {
                        title: (i18n.language === Languages.SLOVAK ? profile.description : profile.engDescription) ?? profile.name ?? '',
                        stepLabel: { label: (index + 2).toString(), variant: 'circle' } as IStepLabel,
                        last: relationSchema ? false : attProfiles.length === index + 1 ? true : false,
                        id: `${profile.technicalName}`,
                        isOpen: sections.find((item) => item.id === `${profile.technicalName}`)?.isOpen,
                        error: sectionError[profile.technicalName ?? ''] === true,
                        content: (
                            <CreateEntitySection
                                sectionId={profile.technicalName ?? ''}
                                attributes={profile.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                                constraintsData={constraintsData}
                                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                                unitsData={unitsData}
                                setSectionError={setSectionError}
                                defaultItemAttributeValues={defaultItemAttributeValues}
                                hasResetState={{ hasReset, setHasReset }}
                                updateCiItemId={updateCiItemId}
                                sectionRoles={profile.roleList ?? []}
                                selectedRole={selectedRole}
                            />
                        ),
                    }
                }),
            ] ?? []

        if (relationSchema) {
            result.push({
                title: t('newRelation.relation'),
                last: true,
                id: 'newRelation',
                stepLabel: { label: (attProfiles.length + 2).toString(), variant: 'circle' } as IStepLabel,
                content: (
                    <RelationAttributeForm
                        relationSchema={relationSchema}
                        hasResetState={{ hasReset, setHasReset }}
                        constraintsData={constraintsData}
                        unitsData={unitsData}
                    />
                ),
            })
        }
        setSections(result)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        attProfiles,
        ciTypeData?.attributes,
        ciTypeData?.roleList,
        selectedOrg?.poName,
        constraintsData,
        defaultItemAttributeValues,
        generatedEntityId,
        hasReset,
        i18n.language,
        mappedProfileTechNames,
        relationSchema,
        sectionError,
        selectedRole,
        t,
        unitsData,
        updateCiItemId,
    ])

    const handleSectionOpen = (id: string) => {
        setSections((prev) => prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)))
    }

    const openOrCloseAllSections = () => {
        setSections((prev) => {
            const allOpen = prev.every((item) => item.isOpen)
            return prev.map((item) => ({ ...item, isOpen: !allOpen }))
        })
    }

    const handleSectionBasedOnError = (errors: FieldErrors) => {
        setSections((prev) =>
            prev.map((section) => {
                const isSectionError = Object.keys(errors).find((item) => item.includes(section.id ?? ''))
                if (isSectionError) {
                    return { ...section, isOpen: true, error: true }
                }
                return { ...section, error: false }
            }),
        )
    }

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
                entityName={entityName}
                generatedEntityId={generatedEntityId}
                ciTypeData={ciTypeData}
                onSubmit={onSubmit}
                onError={(errors) => handleSectionBasedOnError(errors)}
                isProcessing={isProcessing}
                selectedRole={selectedRole}
                stepperList={sections}
                formDefaultValues={formDefaultValues}
                isUpdate={isUpdate}
                handleSectionOpen={handleSectionOpen}
                openOrCloseAllSections={openOrCloseAllSections}
                setHasReset={setHasReset}
                isSubmitDisabled={isSubmitDisabled}
                selectedOrg={selectedOrg}
            />
        </>
    )
}
