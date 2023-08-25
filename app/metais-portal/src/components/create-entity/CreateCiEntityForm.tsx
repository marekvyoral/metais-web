import { yupResolver } from '@hookform/resolvers/yup'
import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { CiCode, CiType, ConfigurationItemUiAttributes, EnumType } from '@isdd/metais-common/api'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { CreateEntitySection } from './CreateEntitySection'
import { generateFormSchema } from './createCiEntityFormSchema'
import styles from './createEntity.module.scss'

import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'

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
}

export const CreateCiEntityForm: React.FC<ICreateCiEntityForm> = ({
    ciTypeData,
    unitsData,
    constraintsData,
    generatedEntityId,
    uploadError,
    onSubmit,
    defaultItemAttributeValues,
}) => {
    const { t } = useTranslation()
    const [hasReset, setHasReset] = useState(false)
    const genProfilTechName = 'Gen_Profil'
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
        resolver: yupResolver(generateFormSchema(attributes, t)),
    })
    const { handleSubmit, setValue, reset } = methods

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    const sections =
        [
            {
                title: ciTypeData?.name ?? '',
                summary: null,
                error: sectionError[genProfilTechName] === true,
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
                    />
                ),
            },
            ...attProfiles.map((profile) => ({
                title: profile.name ?? '',
                summary: null,
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
                    />
                ),
            })),
        ] ?? []

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <AccordionContainer sections={sections} />
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

                <Button
                    className={styles.buttonWithMargin}
                    label={t('button.cancel')}
                    type="reset"
                    variant="secondary"
                    onClick={() => {
                        reset()
                        setHasReset(true)
                    }}
                />
                <Button label={t('button.saveChanges')} type="submit" />
            </form>
        </FormProvider>
    )
}
