import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { useFormContext } from 'react-hook-form'
import { RelationshipCode, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useEffect } from 'react'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { HasResetState } from '@/components/create-entity/CreateCiEntityForm'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'

interface Props {
    relationSchema: RelationshipType | undefined
    hasResetState: HasResetState
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    generatedRelCode: RelationshipCode | undefined
}

export const RelationAttributeForm: React.FC<Props> = ({ relationSchema, hasResetState, constraintsData, unitsData, generatedRelCode }) => {
    const { register, formState, trigger, setValue, clearErrors, control } = useFormContext()
    const attributes = [
        ...(relationSchema?.attributes ?? []),
        ...(relationSchema?.attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? []),
    ]
    const hasGenRelCodeAttribute = relationSchema?.attributes?.find((item) => item.technicalName === ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais)

    useEffect(() => {
        if (generatedRelCode?.code && hasGenRelCodeAttribute) {
            setValue(ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais, generatedRelCode.code)
        }
    }, [generatedRelCode?.code, hasGenRelCodeAttribute, setValue])

    return (
        <>
            {attributes.map(
                (attribute) =>
                    attribute?.valid &&
                    !attribute.invisible && (
                        <AttributeInput
                            key={attribute?.id}
                            attribute={attribute ?? {}}
                            register={register}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            trigger={trigger}
                            isSubmitted={formState.isSubmitted}
                            error={getAttributeInputErrorMessage(attribute ?? {}, formState.errors)}
                            hint={attribute?.description}
                            hasResetState={hasResetState}
                            constraints={findAttributeConstraint(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                                constraintsData,
                            )}
                            unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                            control={control}
                            disabled={attribute.technicalName == ATTRIBUTE_NAME.Gen_Profil_Rel_kod_metais}
                        />
                    ),
            )}
        </>
    )
}
