import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AttributeProfile, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ApiError, AttributeUi, AttributeUiValue, RelationshipUi, RequestIdUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FieldErrors, FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Button } from '@isdd/idsk-ui-kit/index'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { Stepper } from '@isdd/idsk-ui-kit/stepper/Stepper'
import { ISection } from '@isdd/idsk-ui-kit/stepper/StepperSection'

import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import {
    findAttributeConstraint,
    getAttributeInputErrorMessage,
    getAttributeUnits,
    getAttributesInputErrorMessage,
} from '@/components/create-entity/createEntityHelpers'
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
    const [sections, setSections] = useState<ISection[]>([])
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
            generateFormSchema(
                [relationTypeData as AttributeProfile, ...(relationTypeData?.attributeProfiles ?? [])],
                t,
                i18n.language,
                null,
                relationTypeData?.technicalName,
            ),
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

    const handleSectionOpen = (id: string) => {
        setSections((prev) => prev.map((item) => (item.id === id ? { ...item, isOpen: !item.isOpen } : item)))
    }

    const openOrCloseAllSections = () => {
        setSections((prev) => {
            const allOpen = prev.every((item) => item.isOpen)
            return prev.map((item) => ({ ...item, isOpen: !allOpen }))
        })
    }

    const handleSectionBasedOnError = (err: FieldErrors) => {
        setSections((prev) =>
            prev.map((section) => {
                const isSectionError = Object.keys(err).find((item) => item.includes(section.id ?? ''))
                if (isSectionError) {
                    return { ...section, isOpen: true, error: true }
                }
                return { ...section, error: false }
            }),
        )
    }

    useEffect(() => {
        setSections(
            relationTypeData?.attributeProfiles && Array.isArray(relationTypeData?.attributeProfiles)
                ? relationTypeData?.attributeProfiles?.map((profile: AttributeProfile, index) => {
                      return {
                          title: (i18n.language === Languages.SLOVAK ? profile.description : profile.engDescription) ?? profile.name ?? '',
                          error: getAttributesInputErrorMessage(profile.attributes ?? [], errors),
                          stepLabel: { label: (index + 1).toString(), variant: 'circle' },
                          id: profile.id ? profile.id.toString() : 'default_id',
                          last: relationTypeData?.attributeProfiles?.length === index + 1 ? true : false,
                          isOpen: sections[index]?.isOpen ?? false,
                          content: profile.attributes?.map((attribute) => {
                              return (
                                  attribute?.valid &&
                                  !attribute.invisible && (
                                      <AttributeInput
                                          key={attribute?.id}
                                          attribute={attribute}
                                          register={register}
                                          setValue={setValue}
                                          clearErrors={clearErrors}
                                          trigger={trigger}
                                          isSubmitted={isSubmitted}
                                          error={getAttributeInputErrorMessage(attribute, errors)}
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
                              )
                          }),
                      }
                  })
                : [],
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        clearErrors,
        constraintsData,
        control,
        errors,
        hasReset,
        i18n.language,
        isSubmitted,
        register,
        relationTypeData?.attributeProfiles,
        setValue,
        trigger,
        unitsData,
    ])

    const onError = (err: FieldErrors) => {
        handleSectionBasedOnError(err)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            {sections.length > 0 && (
                <Stepper
                    subtitleTitle=""
                    stepperList={sections}
                    handleSectionOpen={handleSectionOpen}
                    openOrCloseAllSections={openOrCloseAllSections}
                />
            )}
            <SubmitWithFeedback
                submitButtonLabel={t('relationDetail.submit')}
                loading={isEditLoading}
                additionalButtons={[<Button key={1} variant="secondary" label={t('relationDetail.cancel')} onClick={() => setIsEditable(false)} />]}
            />
        </form>
    )
}
