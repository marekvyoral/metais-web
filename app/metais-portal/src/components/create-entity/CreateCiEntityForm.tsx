import { AccordionContainer } from '@isdd/idsk-ui-kit/accordion/Accordion'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CiCode, CiType, EnumType } from '@isdd/metais-common/api'

import { AttributesConfigTechNames } from '../attribute-input/attributeDisplaySettings'

import styles from './createEntity.module.scss'
import { CreateEntitySection } from './CreateEntitySection'
import { generateFormSchema } from './createCiEntityFormSchema.ts'

interface ICreateCiEntityForm {
    generatedEntityId: CiCode
    constraintsData: (EnumType | undefined)[]
    ciTypeData: CiType | undefined
    uploadError: boolean
    onSubmit: (formData: FieldValues) => void
    unitsData: EnumType | undefined
}

export const CreateCiEntityForm: React.FC<ICreateCiEntityForm> = ({
    ciTypeData,
    unitsData,
    constraintsData,
    generatedEntityId,
    uploadError,
    onSubmit,
}) => {
    const { t } = useTranslation()
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

    const { register, handleSubmit, reset, formState, setValue } = useForm({ resolver: yupResolver(generateFormSchema(attributes, t)) })
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
                        register={register}
                        attributes={ciTypeData?.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                        formState={formState}
                        setSectionError={setSectionError}
                        constraintsData={constraintsData}
                        unitsData={unitsData}
                        generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
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
                        register={register}
                        attributes={profile.attributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                        formState={formState}
                        setSectionError={setSectionError}
                        constraintsData={constraintsData}
                        generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                        unitsData={unitsData}
                    />
                ),
            })),
        ] ?? []

    return (
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

            <Button className={styles.buttonWithMargin} label={t('button.cancel')} type="reset" variant="secondary" onClick={() => reset()} />
            <Button label={t('button.saveChanges')} type="submit" />
        </form>
    )
}
