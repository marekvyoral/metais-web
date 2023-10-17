import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { ErrorBlock } from '@isdd/idsk-ui-kit/error-block/ErrorBlock'
import { Stepper } from '@isdd/idsk-ui-kit/src/stepper/Stepper'
import { ISection, IStepLabel } from '@isdd/idsk-ui-kit/stepper/StepperSection'
import { ConfigurationItemUiAttributes, EnumType, Gen_Profil } from '@isdd/metais-common/api'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { CiCode, CiType, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'

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
    isProcessing: boolean
    withRelation?: boolean
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
    isProcessing,
    withRelation,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const ability = useAbilityContext()
    const hasOrgPermission = ability?.can(Actions.CREATE, `ci.create.org`)
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)

    const isSubmitDisabled = (!hasOrgPermission && !updateCiItemId) || (withRelation ? !canCreateRelationType : false)

    const [hasReset, setHasReset] = useState(false)
    const genProfilTechName = Gen_Profil
    const metaisEmail = 'metais@mirri.gov.sk'
    const location = useLocation()
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
                                <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                    {t('createEntity.email')}
                                </Link>
                            </>
                        }
                    />
                )}
                <SubmitWithFeedback
                    className={styles.buttonGroup}
                    additionalButtons={[
                        <Button
                            key={1}
                            label={t('button.cancel')}
                            type="reset"
                            variant="secondary"
                            onClick={() => {
                                reset()
                                setHasReset(true)
                                //back to where we came from
                                navigate(-1)
                            }}
                        />,
                    ]}
                    submitButtonLabel={t('button.saveChanges')}
                    loading={isProcessing || formState.isValidating || formState.isSubmitting}
                    disabled={isSubmitDisabled}
                />
            </form>
        </FormProvider>
    )
}
