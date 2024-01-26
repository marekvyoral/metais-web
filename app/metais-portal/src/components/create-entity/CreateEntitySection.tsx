import { ErrorBlockList } from '@isdd/idsk-ui-kit/error-block-list/ErrorBlockList'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Attribute, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'

import { HasResetState } from './CreateCiEntityForm'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from './createEntityHelpers'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'

interface ISection {
    sectionId: string
    attributes: Attribute[]
    setSectionError: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>
    generatedEntityId: CiCode
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    hasResetState: HasResetState
    updateCiItemId?: string
    sectionRoles: string[]
    selectedRole?: GidRoleData | null
}

export const CreateEntitySection: React.FC<ISection> = ({
    attributes,
    sectionId,
    constraintsData,
    generatedEntityId,
    setSectionError,
    unitsData,
    defaultItemAttributeValues,
    hasResetState,
    updateCiItemId,
    sectionRoles,
    selectedRole,
}) => {
    const ability = useAbilityContext()

    const { register, formState, trigger, setValue, clearErrors, control } = useFormContext()
    const { errors, isSubmitted } = formState

    const errorNames = Object.keys(errors).filter((item) => item.includes(sectionId))
    const thisSectionAttWithErrors = attributes.filter((att) => att.technicalName && errorNames.includes(att.technicalName))

    const thisSectionErrorList = [
        ...thisSectionAttWithErrors.map((att) => ({
            errorTitle: att.name ?? '',
            errorMessage: errors[errorNames.find((name) => name === att.technicalName) ?? '']?.message?.toString(),
        })),
    ]

    const isSectionError = Object.keys(errors)
        .map((item) => item.includes(sectionId))
        .some((item) => item)

    useEffect(() => {
        setSectionError((prev) => ({ ...prev, [sectionId]: isSectionError }))
    }, [sectionId, isSectionError, setSectionError])

    const getHint = (att: Attribute) => {
        if (att.technicalName === AttributesConfigTechNames.REFERENCE_ID) {
            const lastIndex = generatedEntityId?.ciurl?.lastIndexOf('/')
            const urlString = generatedEntityId?.ciurl?.slice(0, lastIndex) + '/'
            return urlString
        }
    }

    const canEditSection = useMemo(() => (selectedRole ? sectionRoles.includes(selectedRole?.roleName ?? '') : true), [sectionRoles, selectedRole])

    return (
        <div>
            <ErrorBlockList errorList={thisSectionErrorList} />
            {attributes?.map?.((attribute) => {
                const isUpdateSectionDisabled = !!updateCiItemId && !ability?.can(Actions.EDIT, `ci.${updateCiItemId}.attributeProfile.${sectionId}`) // when create no uuid is required
                return (
                    <React.Fragment key={attribute.technicalName}>
                        {!attribute.invisible && (
                            <AttributeInput
                                control={control}
                                trigger={trigger}
                                setValue={setValue}
                                attribute={attribute}
                                constraints={findAttributeConstraint(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    //@ts-ignore
                                    attribute?.constraints?.map((item: AttributeConstraintEnumAllOf) => item.enumCode ?? '') ?? [],
                                    constraintsData,
                                )}
                                clearErrors={clearErrors}
                                register={register}
                                error={getAttributeInputErrorMessage(attribute, errors)}
                                isSubmitted={isSubmitted}
                                hint={getHint(attribute)}
                                unitsData={attribute.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                                defaultValueFromCiItem={defaultItemAttributeValues?.[attribute.technicalName ?? '']}
                                hasResetState={hasResetState}
                                disabled={!canEditSection || isUpdateSectionDisabled}
                                isUpdate={!!updateCiItemId}
                            />
                        )}
                    </React.Fragment>
                )
            })}
        </div>
    )
}
