import { ErrorBlockList } from '@isdd/idsk-ui-kit/error-block-list/ErrorBlockList'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { GidRoleData } from '@isdd/metais-common/api/generated/iam-swagger'
import { Attribute, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import React, { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { HasResetState } from './CreateCiEntityForm'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits, getHint, getSectionErrorList } from './createEntityHelpers'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'

interface ISection {
    sectionId: string
    attributes: Attribute[]
    generatedEntityId: CiCode
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    hasResetState: HasResetState
    setSectionError?: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>
    updateCiItemId?: string
    sectionRoles: string[]
    selectedRole?: GidRoleData | null
    hideErrorBlock?: boolean
}

export const CreateEntitySection: React.FC<ISection> = ({
    attributes,
    sectionId,
    constraintsData,
    generatedEntityId,
    unitsData,
    defaultItemAttributeValues,
    hasResetState,
    updateCiItemId,
    setSectionError,
    sectionRoles,
    selectedRole,
    hideErrorBlock,
}) => {
    const ability = useAbilityContext()

    const { register, formState, trigger, setValue, clearErrors, control } = useFormContext()
    const { errors, isSubmitted } = formState

    const thisSectionErrorList = getSectionErrorList(attributes, formState?.errors, sectionId)

    const canEditSection = useMemo(() => (selectedRole ? sectionRoles.includes(selectedRole?.roleName ?? '') : true), [sectionRoles, selectedRole])
    const isUpdateSectionDisabled = !!updateCiItemId && !ability?.can(Actions.EDIT, `ci.${updateCiItemId}.attributeProfile.${sectionId}`)

    const isSectionError = Object.keys(errors)
        .map((item) => item.includes(sectionId))
        .some((item) => item)

    useEffect(() => {
        setSectionError?.((prev) => ({ ...prev, [sectionId]: isSectionError }))
    }, [sectionId, isSectionError, setSectionError])

    return (
        <div>
            {!hideErrorBlock && <ErrorBlockList errorList={thisSectionErrorList} />}
            {attributes?.map?.((attribute) => (
                <React.Fragment key={attribute.technicalName}>
                    {!attribute.invisible && attribute.valid && (
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
                            hint={getHint(attribute, generatedEntityId)}
                            unitsData={attribute.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                            defaultValueFromCiItem={defaultItemAttributeValues?.[attribute.technicalName ?? '']}
                            hasResetState={hasResetState}
                            disabled={!canEditSection || isUpdateSectionDisabled}
                            isUpdate={!!updateCiItemId}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
