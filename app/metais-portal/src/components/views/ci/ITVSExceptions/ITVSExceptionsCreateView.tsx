import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonGroupRow, ErrorBlock } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, Gen_Profil } from '@isdd/metais-common/api'
import { CiWithRelsUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { ENTITY_OSOBITNY_POSTUP, metaisEmail } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import classNames from 'classnames'
import React, { useEffect, useMemo, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

import styles from './styles.module.scss'

import { formatForFormDefaultValues } from '@/componentHelpers/ci'
import { CI_TYPE_DATA_ITVS_EXCEPTIONS_BLACK_LIST, getModifiedCiTypeData } from '@/componentHelpers/ci/ciTypeBlackList'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { RelationshipWithCiType } from '@/components/containers/ITVS-exceptions/ITVSExceptionsCreateContainer'
import { RelationForITVSExceptionSelect } from '@/components/containers/ITVS-exceptions/RelationForITVSExceptionSelect'
import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { CreateEntitySection } from '@/components/create-entity/CreateEntitySection'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { INewCiRelationData } from '@/hooks/useNewCiRelation.hook'
import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'

export interface IRelationshipSetState {
    relationshipSet: RelationshipWithCiType[]
    setRelationshipSet: React.Dispatch<React.SetStateAction<RelationshipWithCiType[]>>
}

interface Props {
    data: CreateEntityData
    relationData: INewCiRelationData
    onSubmit: (formData: FieldValues) => void
    defaultItemAttributeValues?: ConfigurationItemUiAttributes | undefined
    updateCiItemId?: string
    isProcessing: boolean
    isLoading: boolean
    isError: boolean
    publicAuthorityState?: PublicAuthorityState
    roleState?: RoleState
    relationshipSetState: IRelationshipSetState
    uploadError: boolean
    allCIsInRelations: CiWithRelsUi[]
}

const GENERATED_ATTRIBUTES = [ATTRIBUTE_NAME.Gen_Profil_kod_metais, ATTRIBUTE_NAME.Gen_Profil_kod_metais, ATTRIBUTE_NAME.Gen_Profil_ref_id]

export const ITVSExceptionsCreateView: React.FC<Props> = ({
    data,
    relationData,
    onSubmit,
    defaultItemAttributeValues,
    updateCiItemId,
    isProcessing,
    isLoading,
    isError,
    publicAuthorityState,
    roleState,
    relationshipSetState,
    allCIsInRelations,
    uploadError,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const { attributesData, generatedEntityId } = data
    const { constraintsData, ciTypeData, unitsData } = attributesData
    const { readRelationShipsData: existingRelations, relationTypeData: relationSchema } = relationData

    const ciTypeModified = useMemo(() => {
        return getModifiedCiTypeData(ciTypeData, CI_TYPE_DATA_ITVS_EXCEPTIONS_BLACK_LIST)
    }, [ciTypeData])

    const attProfiles = useMemo(() => ciTypeModified?.attributeProfiles?.map((profile) => profile) ?? [], [ciTypeModified?.attributeProfiles])

    const genProfilTechName = Gen_Profil
    const [hasReset, setHasReset] = useState(false)

    const [relationSchemaCombinedAttributes, setRelationSchemaCombinedAttributest] = useState<(Attribute | undefined)[]>([])
    useEffect(() => {
        setRelationSchemaCombinedAttributest([
            ...(relationSchema?.attributes ?? []),
            ...(relationSchema?.attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? []),
        ])
    }, [relationSchema])
    const attributes = useMemo(
        () => [...(ciTypeModified?.attributes ?? []), ...attProfiles.map((profile) => profile.attributes ?? []).flat()],
        [attProfiles, ciTypeModified?.attributes],
    )
    const defaultValuesFromSchema = useMemo(
        () =>
            attributes.reduce((acc, att) => {
                if (att?.defaultValue) {
                    return { ...acc, [att?.technicalName?.toString() ?? '']: att?.defaultValue }
                }
                return acc
            }, {}),
        [attributes],
    )
    const defaultValues = formatForFormDefaultValues(updateCiItemId ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes)
    const methods = useForm({
        defaultValues: defaultValues,
        resolver: yupResolver(
            generateFormSchema(
                [ciTypeModified as AttributeProfile, ...attProfiles],
                t,
                i18n.language,
                roleState?.selectedRole,
                ENTITY_OSOBITNY_POSTUP,
                defaultValues,
            ),
        ),
    })

    const { handleSubmit, setValue, reset } = methods

    useEffect(() => {
        reset(formatForFormDefaultValues(updateCiItemId ? defaultItemAttributeValues ?? {} : defaultValuesFromSchema ?? {}, attributes))
    }, [attributes, defaultItemAttributeValues, defaultValuesFromSchema, reset, updateCiItemId])

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    const ciTypeAttributes = attributes?.filter((attribute) => !GENERATED_ATTRIBUTES.includes(attribute?.technicalName as ATTRIBUTE_NAME)) ?? []

    const generatedAttributes = attributes?.filter((attribute) => GENERATED_ATTRIBUTES.includes(attribute?.technicalName as ATTRIBUTE_NAME)) ?? []

    return (
        <>
            {!updateCiItemId && publicAuthorityState && roleState && (
                <SelectPublicAuthorityAndRole
                    selectedRole={roleState.selectedRole ?? {}}
                    onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                    onChangeRole={roleState.setSelectedRole}
                    selectedOrg={publicAuthorityState.selectedPublicAuthority}
                    ciRoles={ciTypeModified?.roleList ?? []}
                />
            )}

            <QueryFeedback loading={isLoading || isProcessing} error={isError} withChildren>
                <FormProvider {...methods}>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <CreateEntitySection
                            hideErrorBlock
                            sectionId={genProfilTechName}
                            attributes={ciTypeAttributes}
                            constraintsData={constraintsData}
                            generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                            unitsData={unitsData}
                            defaultItemAttributeValues={defaultItemAttributeValues}
                            hasResetState={{ hasReset, setHasReset }}
                            updateCiItemId={updateCiItemId}
                            sectionRoles={ciTypeModified?.roleList ?? []}
                            selectedRole={roleState?.selectedRole ?? null}
                        />

                        {uploadError && (
                            <ErrorBlock
                                errorTitle={t('createEntity.errorTitle')}
                                errorMessage={
                                    <>
                                        {t('createEntity.errorMessage')}
                                        <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                            {metaisEmail}
                                        </Link>
                                    </>
                                }
                            />
                        )}

                        <RelationForITVSExceptionSelect
                            ciType="ISVS"
                            relationSchemaCombinedAttributes={relationSchemaCombinedAttributes}
                            methods={methods}
                            hasResetState={{ hasReset, setHasReset }}
                            constraintsData={relationData?.constraintsData ?? []}
                            unitsData={unitsData}
                            relationType="osobitny_postup_vztah_ISVS"
                            relationshipSetState={relationshipSetState}
                            label={t('ITVSExceptions.relatedITVS')}
                            existingRelations={existingRelations}
                        />
                        <div className={styles.margin30}>
                            {allCIsInRelations
                                ?.filter((ciRel) => ciRel.rels?.[0].type === 'osobitny_postup_vztah_ISVS')
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
                        <RelationForITVSExceptionSelect
                            ciType="PO"
                            relationSchemaCombinedAttributes={relationSchemaCombinedAttributes}
                            methods={methods}
                            hasResetState={{ hasReset, setHasReset }}
                            constraintsData={relationData?.constraintsData ?? []}
                            unitsData={unitsData}
                            relationType="osobitny_postup_vztah_PO"
                            relationshipSetState={relationshipSetState}
                            label={t('ITVSExceptions.relatedPO')}
                            existingRelations={existingRelations}
                        />
                        {allCIsInRelations
                            ?.filter((ciRel) => ciRel.rels?.[0].type === 'osobitny_postup_vztah_PO')
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

                        <CreateEntitySection
                            hideErrorBlock
                            sectionId={genProfilTechName}
                            attributes={generatedAttributes}
                            constraintsData={constraintsData}
                            generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                            unitsData={unitsData}
                            defaultItemAttributeValues={defaultItemAttributeValues}
                            hasResetState={{ hasReset, setHasReset }}
                            updateCiItemId={updateCiItemId}
                            sectionRoles={ciTypeModified?.roleList ?? []}
                            selectedRole={roleState?.selectedRole ?? null}
                        />

                        <ButtonGroupRow>
                            <Button
                                label={t('button.cancel')}
                                type="reset"
                                variant="secondary"
                                onClick={() => {
                                    navigate(`${NavigationSubRoutes.OSOBITNY_POSTUP}`)
                                }}
                            />
                            <Button type="submit" label={t('button.saveChanges')} />
                        </ButtonGroupRow>
                    </form>
                </FormProvider>
            </QueryFeedback>
        </>
    )
}
