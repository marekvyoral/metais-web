import React, { useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, ConfigurationItemUiAttributes, Gen_Profil } from '@isdd/metais-common/api'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Button } from '@isdd/idsk-ui-kit/index'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { CreateEntitySection } from '@/components/create-entity/CreateEntitySection'

interface Props {
    data: CreateEntityData
    onSubmit: (formData: FieldValues) => void
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    updateCiItemId?: string
    isProcessing: boolean
}

export const ITVSExceptionsCreateView: React.FC<Props> = ({ data, onSubmit, defaultItemAttributeValues, updateCiItemId, isProcessing }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData
    const attProfiles = ciTypeData?.attributeProfiles?.map((profile) => profile) ?? []
    const filtredAttributes = ciTypeData?.attributes?.filter((attr) => {
        return (
            attr.technicalName === ATTRIBUTE_NAME.Gen_Profil_nazov ||
            attr.technicalName === ATTRIBUTE_NAME.Gen_Profil_kod_metais ||
            attr.technicalName === ATTRIBUTE_NAME.Gen_Profil_ref_id
        )
    })

    const attributes = [...(filtredAttributes ?? []), ...attProfiles.map((profile) => profile.attributes).flat()]

    const genProfilTechName = Gen_Profil
    const attProfileTechNames = attProfiles.map((profile) => profile.technicalName)

    const mappedProfileTechNames: Record<string, boolean> = attProfileTechNames.reduce<Record<string, boolean>>((accumulator, attributeName) => {
        if (attributeName != null) {
            accumulator[attributeName] = false
        }
        return accumulator
    }, {})

    const [hasReset, setHasReset] = useState(false)

    const sectionErrorDefaultConfig: { [x: string]: boolean } = {
        [genProfilTechName]: false,
        ...mappedProfileTechNames,
    }

    const [sectionError, setSectionError] = useState<{ [x: string]: boolean }>(sectionErrorDefaultConfig)

    const methods = useForm({
        defaultValues: {},
        resolver: yupResolver(generateFormSchema(attributes, t)),
    })
    const { handleSubmit, setValue, reset, formState } = methods

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CreateEntitySection
                        sectionId={genProfilTechName}
                        attributes={filtredAttributes?.sort((a, b) => (a.order ?? -1) - (b.order ?? -1)) ?? []}
                        setSectionError={setSectionError}
                        constraintsData={constraintsData}
                        generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                        unitsData={unitsData}
                        defaultItemAttributeValues={defaultItemAttributeValues}
                        hasResetState={{ hasReset, setHasReset }}
                        updateCiItemId={updateCiItemId}
                    />

                    {...attProfiles.map((profile, index) => (
                        <div key={profile.id}>
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
                        </div>
                    ))}
                    <SubmitWithFeedback
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
                        disabled={false}
                    />
                </form>
            </FormProvider>
        </>
    )
}
