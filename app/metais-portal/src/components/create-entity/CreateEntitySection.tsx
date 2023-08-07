import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { ErrorBlockList } from '@isdd/idsk-ui-kit/error-block-list/ErrorBlockList'
import { Attribute, AttributeConstraintEnumAllOf, CiCode, EnumType } from '@isdd/metais-common'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'

interface ISection {
    sectionId: string
    attributes: Attribute[]
    setSectionError: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>
    generatedEntityId: CiCode
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
}

export const CreateEntitySection: React.FC<ISection> = ({
    attributes,
    sectionId,
    constraintsData,
    generatedEntityId,
    setSectionError,
    unitsData,
}) => {
    const { register, formState, trigger, setValue, control } = useFormContext()
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

    const findAttributeConstraint = (enumCodes: string[]) => {
        const attributeConstraint = constraintsData.find((constraint) => constraint?.code === enumCodes[0])
        return attributeConstraint
    }

    const getAttributeInputErrorMessage = (attribute: Attribute) => {
        if (attribute.technicalName != null) {
            const error = Object.keys(errors).includes(attribute.technicalName)
            return error ? errors[attribute.technicalName] : undefined
        }
        return undefined
    }

    const getAttributeUnits = (unitCode: string) => {
        const attributeUnit = unitsData?.enumItems?.find((item) => item.code == unitCode)
        return attributeUnit
    }

    const getHint = (att: Attribute) => {
        if (att.technicalName === AttributesConfigTechNames.REFERENCE_ID) {
            const lastIndex = generatedEntityId?.ciurl?.lastIndexOf('/')
            const urlString = generatedEntityId?.ciurl?.slice(0, lastIndex) + '/'
            return urlString
        }
    }

    return (
        <div>
            <ErrorBlockList errorList={thisSectionErrorList} />
            {attributes?.map?.((attribute) => (
                <React.Fragment key={attribute.technicalName}>
                    {!attribute.invisible && (
                        <AttributeInput
                            trigger={trigger}
                            setValue={setValue}
                            attribute={attribute}
                            constraints={findAttributeConstraint(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-ignore
                                attribute?.constraints?.map((item: AttributeConstraintEnumAllOf) => item.enumCode ?? '') ?? [],
                            )}
                            register={register}
                            control={control}
                            error={getAttributeInputErrorMessage(attribute)}
                            isSubmitted={isSubmitted}
                            hint={getHint(attribute)}
                            unitsData={attribute.units ? getAttributeUnits(attribute.units ?? '') : undefined}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
