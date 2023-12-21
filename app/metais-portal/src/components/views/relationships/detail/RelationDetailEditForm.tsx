import React, { Dispatch, SetStateAction, useState } from 'react'
import { AttributeProfile, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ApiError, AttributeUi, AttributeUiValue, RelationshipUi, RequestIdUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Button } from '@isdd/idsk-ui-kit/index'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'

type Props = {
    relationTypeData: RelationshipType | undefined
    relationshipData: RelationshipUi | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    setIsEditable: Dispatch<SetStateAction<boolean>>
    isEditLoading: boolean
    editRelation: UseMutateAsyncFunction<
        RequestIdUi,
        ApiError,
        {
            data: RelationshipUi
        },
        unknown
    >
}

export const RelationDetailEditForm: React.FC<Props> = ({
    relationTypeData,
    relationshipData,
    constraintsData,
    unitsData,
    setIsEditable,
    isEditLoading,
    editRelation,
}) => {
    const { t, i18n } = useTranslation()
    const flatAttributesFromSchema = relationTypeData?.attributes?.concat(
        relationTypeData?.attributeProfiles?.flatMap((profile) => profile.attributes ?? []) ?? [],
    )

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors, isSubmitted },
        trigger,
        control,
    } = useForm({
        defaultValues: flatAttributesFromSchema?.reduce<Record<string, AttributeUiValue>>((acc, item) => {
            const value = relationshipData?.attributes?.find((relAttr) => relAttr.name === item.technicalName)?.value

            if (value && item.technicalName) {
                return {
                    ...acc,
                    [item.technicalName]: value,
                }
            }
            return acc
        }, {}),

        resolver: yupResolver(
            generateFormSchema([relationTypeData as AttributeProfile, ...(relationTypeData?.attributeProfiles ?? [])], t, i18n.language),
        ),
    })

    const [hasReset, setHasReset] = useState(false)

    const formatFormDataToAttributeUi = (formData: FieldValues, prevAttributes: AttributeUi[]): AttributeUi[] => {
        const formattedFormData: AttributeUi[] = []

        for (const key in formData) {
            const attributeInPrev = prevAttributes.find((att) => att.name === formData[key])
            const isAttributeInPrev = !!attributeInPrev?.name

            if (isAttributeInPrev) {
                formattedFormData.push(attributeInPrev)
            } else {
                const attribute = { name: key, value: formData[key] }
                formattedFormData.push(attribute)
            }
        }

        return formattedFormData
    }

    const onSubmit = (formData: FieldValues) => {
        const dataToSend: RelationshipUi = {
            ...relationshipData,
            attributes: formatFormDataToAttributeUi(formData, relationshipData?.attributes ?? []),
        }
        editRelation({ data: dataToSend })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {flatAttributesFromSchema?.map((attribute) => {
                return (
                    <AttributeInput
                        key={attribute?.id}
                        attribute={attribute}
                        register={register}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        trigger={trigger}
                        isSubmitted={isSubmitted}
                        error={getAttributeInputErrorMessage(attribute, errors)}
                        hint={attribute?.description}
                        hasResetState={{ hasReset, setHasReset }}
                        constraints={findAttributeConstraint(
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                            constraintsData,
                        )}
                        unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                        control={control}
                    />
                )
            })}
            <SubmitWithFeedback
                submitButtonLabel={t('relationDetail.submit')}
                loading={isEditLoading}
                additionalButtons={[<Button key={1} variant="secondary" label={t('relationDetail.cancel')} onClick={() => setIsEditable(false)} />]}
            />
        </form>
    )
}
