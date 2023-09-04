import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { ButtonGroupRow } from '@isdd/idsk-ui-kit/index'
import { Stepper } from '@isdd/idsk-ui-kit/src/stepper/Stepper'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { CiCode, CiType, ConfigurationItemUiAttributes, EnumType, Gen_Profil, RelationshipType } from '@isdd/metais-common/api'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CreateEntitySection } from './CreateEntitySection'
import { generateFormSchema } from './createCiEntityFormSchema'
import styles from './createEntity.module.scss'

import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { RelationAttributeForm } from '@/components/relations-attribute-form/RelationAttributeForm'
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
}) => {
    const { t } = useTranslation()
    const [hasReset, setHasReset] = useState(false)
    const genProfilTechName = Gen_Profil
    const metaisEmail = 'metais@mirri.gov.sk'

    const attProfiles = ciTypeData?.attributeProfiles?.map((profile) => profile) ?? []
    const attributes = [...(ciTypeData?.attributes ?? []), ...attProfiles.map((profile) => profile.attributes).flat()]

    const attProfileTechNames = attProfiles.map((profile) => profile.technicalName)
    const mappedProfileTechNames: Record<string, boolean> = attProfileTechNames.reduce<Record<string, boolean>>((accumulator, attributeName) => {
        if (attributeName != null) {
            accumulator[attributeName] = false
        }
        return accumulator
    }, {})

    const sectionErrorDefaultConfig: { [x: string]: boolean } = {
        [genProfilTechName]: false,
        ...mappedProfileTechNames,
    }
    const [sectionError, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

    const methods = useForm({
        defaultValues: defaultItemAttributeValues ?? {},
        resolver: yupResolver(generateFormSchema(attributes, t)),
    })
    const { handleSubmit, setValue, reset, formState } = methods

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    const sections: ISection[] =
        [
            {
                title: ciTypeData?.name ?? '',
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
                    />
                ),
            },
            ...attProfiles.map((profile, index) => ({
                title: profile.name ?? '',
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

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Stepper subtitleTitle="" stepperList={relationSchema ? newRelationSections : sections} />
                {uploadError && (
                    <ErrorBlock
                        errorTitle={t('createEntity.errorTitle')}
                        errorMessage={
                            <>
                                {t('createEntity.errorMessage')}
                                <Link className="govuk-link" to={`mailto:${metaisEmail}`}>
                                    {t('createEntity.email')}
                                </Link>
                            </>
                        }
                    />
                )}
                <ButtonGroupRow className={styles.buttonGroup}>
                    <Button
                        label={t('button.cancel')}
                        type="reset"
                        variant="secondary"
                        onClick={() => {
                            reset()
                            setHasReset(true)
                        }}
                    />
                    <Button label={t('button.saveChanges')} disabled={formState.isValidating || formState.isSubmitting} type="submit" />
                </ButtonGroupRow>
            </form>
        </FormProvider>
    )
}
