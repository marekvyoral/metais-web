import React, { useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, Gen_Profil } from '@isdd/metais-common/api'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { Button } from '@isdd/idsk-ui-kit/index'
import { NewRelationDataProvider } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CiWithRelsResultUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import classNames from 'classnames'

import styles from './styles.module.scss'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { CreateEntitySection } from '@/components/create-entity/CreateEntitySection'
import { INewCiRelationData } from '@/components/containers/NewCiRelationContainer'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { ISVSRelationSelect } from '@/components/containers/ITVS-exceptions/ISVSRelationSelect'
import { RelationshipWithCiType } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'

export interface IRelationshipSetState {
    relationshipSet: RelationshipWithCiType[]
    setRelationshipSet: React.Dispatch<React.SetStateAction<RelationshipWithCiType[]>>
}

interface Props {
    data: CreateEntityData
    relationData: INewCiRelationData | undefined
    onSubmit: (formData: FieldValues) => void
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    updateCiItemId?: string
    isProcessing: boolean
    isLoading: boolean
    isError: boolean
    // selectedISVSItemsState: INewRelationData
    // selectedPOItemsState: INewRelationData
    publicAuthorityState?: PublicAuthorityState
    roleState?: RoleState
    relationshipSetState: IRelationshipSetState
    existingRelations?: CiWithRelsResultUi
}

export const ITVSExceptionsCreateView: React.FC<Props> = ({
    data,
    relationData,
    onSubmit,
    defaultItemAttributeValues,
    updateCiItemId,
    isProcessing,
    isLoading,
    isError,
    // selectedISVSItemsState,
    // selectedPOItemsState,
    publicAuthorityState,
    roleState,
    relationshipSetState,
    existingRelations,
}) => {
    const { t, i18n } = useTranslation()
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

    // const { selectedItems: selectedISVSs, setSelectedItems: setSelectedISVSs, setIsListPageOpen: setIsISVSListPageOpen } = selectedISVSItemsState
    // const { selectedItems: selectedPOs, setSelectedItems: setSelectedPOs, setIsListPageOpen: setIsPOListPageOpen } = selectedPOItemsState

    const relationSchema = relationData?.relationTypeData
    const [relationSchemaCombinedAttributes, setRelationSchemaCombinedAttributest] = useState<(Attribute | undefined)[]>([])
    useEffect(() => {
        setRelationSchemaCombinedAttributest([
            ...(relationSchema?.attributes ?? []),
            ...(relationSchema?.attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? []),
        ])
    }, [relationSchema])

    const methods = useForm({
        defaultValues: defaultItemAttributeValues ?? {},
        resolver: yupResolver(generateFormSchema([ciTypeData as AttributeProfile, ...attProfiles], t)),
    })
    const { register, clearErrors, trigger, handleSubmit, setValue, reset, formState } = methods

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    return (
        <>
            {!updateCiItemId && publicAuthorityState && roleState && (
                <SelectPublicAuthorityAndRole
                    selectedRole={roleState.selectedRole ?? {}}
                    onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                    onChangeRole={roleState.setSelectedRole}
                    selectedOrg={publicAuthorityState.selectedPublicAuthority}
                    ciRoles={ciTypeData?.roleList ?? []}
                />
            )}
            <QueryFeedback loading={isLoading} error={false} withChildren>
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
                            sectionRoles={ciTypeData?.roleList ?? []}
                            selectedRole={roleState?.selectedRole ?? {}}
                        />

                        {...attProfiles.map((profile) => (
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
                                    sectionRoles={ciTypeData?.roleList ?? []}
                                    selectedRole={roleState?.selectedRole ?? {}}
                                />
                            </div>
                        ))}
                        <NewRelationDataProvider>
                            <ISVSRelationSelect
                                ciType="ISVS"
                                relationSchemaCombinedAttributes={relationSchemaCombinedAttributes}
                                methods={methods}
                                register={register}
                                setValue={setValue}
                                trigger={trigger}
                                hasResetState={{ hasReset, setHasReset }}
                                constraintsData={relationData?.constraintsData ?? []}
                                unitsData={unitsData}
                                relationType="osobitny_postup_vztah_ISVS"
                                relationshipSetState={relationshipSetState}
                                label={t('ITVSExceptions.relatedISVS')}
                            />
                        </NewRelationDataProvider>
                        <div className={styles.margin30}>
                            {existingRelations?.ciWithRels
                                ?.filter((ciRel) => ciRel.ci?.type === 'ISVS')
                                .map((ciWithRel) => (
                                    <div className={classNames(['govuk-accordion__section'])} key={ciWithRel.ci?.uuid}>
                                        <div className={classNames(['govuk-accordion__section-header', styles.existingRelWrapper])}>
                                            <a className="govuk-accordion__section-button">
                                                {ciWithRel.ci?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                            </a>
                                            {ciWithRel.rels?.[0].attributes?.[0]?.value && (
                                                <small>
                                                    {t('ITVSExceptions.note')}: {ciWithRel.rels?.[0].attributes?.[0]?.value?.toString() ?? ''}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <NewRelationDataProvider>
                            <ISVSRelationSelect
                                ciType="PO"
                                relationSchemaCombinedAttributes={relationSchemaCombinedAttributes}
                                methods={methods}
                                register={register}
                                setValue={setValue}
                                trigger={trigger}
                                hasResetState={{ hasReset, setHasReset }}
                                constraintsData={relationData?.constraintsData ?? []}
                                unitsData={unitsData}
                                relationType="osobitny_postup_vztah_ISVS"
                                relationshipSetState={relationshipSetState}
                                label={t('ITVSExceptions.relatedPO')}
                            />
                        </NewRelationDataProvider>
                        {existingRelations?.ciWithRels
                            ?.filter((ciRel) => ciRel.ci?.type === 'PO')
                            .map((ciWithRel) => (
                                <div className={classNames(['govuk-accordion__section'])} key={ciWithRel.ci?.uuid}>
                                    <div className={classNames(['govuk-accordion__section-header', styles.existingRelWrapper])}>
                                        <a className="govuk-accordion__section-button">
                                            {ciWithRel.ci?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]}
                                        </a>
                                        {ciWithRel.rels?.[0].attributes?.[0]?.value && (
                                            <small>
                                                {t('ITVSExceptions.note')}: {ciWithRel.rels?.[0].attributes?.[0]?.value?.toString() ?? ''}
                                            </small>
                                        )}
                                    </div>
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
            </QueryFeedback>
        </>
    )
}
