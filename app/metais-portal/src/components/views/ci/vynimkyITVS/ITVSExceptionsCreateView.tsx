import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { ATTRIBUTE_NAME, ConfigurationItemUi, ConfigurationItemUiAttributes, Gen_Profil } from '@isdd/metais-common/api'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { AccordionContainer, Button, ButtonGroupRow, ButtonLink, IAccordionSection, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { isError } from '@tanstack/react-query'
import { SelectCiItem } from '@isdd/metais-common/components/select-ci-item/SelectCiItem'
import { INewRelationData, useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import classNames from 'classnames'
import { MultiValue } from 'react-select'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { CreateEntityData } from '@/components/create-entity/CreateEntity'
import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'
import { CreateEntitySection } from '@/components/create-entity/CreateEntitySection'
import { RelationAttributeForm } from '@/components/relations-attribute-form/RelationAttributeForm'
import { createSelectRelationTypeOptions, filterRelatedList } from '@/componentHelpers/new-relation'
import CiListPage from '@/pages/ci/[entityName]/entity'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { getAttributeInputErrorMessage, findAttributeConstraint, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { INewCiRelationData, ISelectedRelationTypeState } from '@/components/containers/NewCiRelationContainer'
import { AttributesConfigTechNames } from '@/components/attribute-input/attributeDisplaySettings'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { createSelectRelationTypesOptions } from '@/componentHelpers/ITVS-exceptions'

interface ISelectedCITypeForRelationState {
    selectedCITypeForRelationTechnicalName: string
    setSelectedCITypeForRelationTechnicalName: Dispatch<SetStateAction<string>>
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
    selectedRelationTypeState: ISelectedRelationTypeState
    selectedCITypeForRelationState: ISelectedCITypeForRelationState
    selectedRelationItemsState: INewRelationData
    publicAuthorityState?: PublicAuthorityState
    roleState?: RoleState
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
    selectedRelationTypeState,
    selectedRelationItemsState,
    selectedCITypeForRelationState,
    publicAuthorityState,
    roleState,
}) => {
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
    const { selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName } = selectedRelationTypeState
    const { selectedCITypeForRelationTechnicalName, setSelectedCITypeForRelationTechnicalName } = selectedCITypeForRelationState
    const { selectedItems, setSelectedItems, setIsListPageOpen } = selectedRelationItemsState

    const relationSchema = relationData?.relationTypeData
    const [relationSchemaCombinedAttributes, setRelationSchemaCombinedAttributest] = useState<(Attribute | undefined)[]>([])
    useEffect(() => {
        setRelationSchemaCombinedAttributest([
            ...(relationSchema?.attributes ?? []),
            ...(relationSchema?.attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? []),
        ])
    }, [relationSchema])

    const methods = useForm({
        defaultValues: {},
        resolver: yupResolver(generateFormSchema([...attributes, ...relationSchemaCombinedAttributes], t)),
    })
    const { register, clearErrors, trigger, handleSubmit, setValue, reset, formState } = methods

    const referenceIdValue = generatedEntityId?.ciurl?.split('/').pop()
    const metaIsCodeValue = generatedEntityId?.cicode
    useEffect(() => {
        setValue(AttributesConfigTechNames.REFERENCE_ID, referenceIdValue)
        setValue(AttributesConfigTechNames.METAIS_CODE, metaIsCodeValue)
    }, [metaIsCodeValue, referenceIdValue, setValue])

    const setSelectedRelationAndCI = (val: string) => {
        const [relation, ci] = val.split(JOIN_OPERATOR)
        setSelectedRelationTypeTechnicalName(relation)
        setSelectedCITypeForRelationTechnicalName(ci)
    }

    const sections: IAccordionSection[] =
        selectedItems && Array.isArray(selectedItems)
            ? selectedItems.map((item: ConfigurationItemUi) => ({
                  title: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                  summary: (
                      <ButtonGroupRow key={item.uuid} className={''}>
                          <ButtonLink
                              label={t('newRelation.detailButton')}
                              //className={classNames(styles.buttonLink, styles.blue)}
                              onClick={() => navigate(`/ci/${selectedCITypeForRelationTechnicalName}/${item.uuid}`, { state: { from: location } })}
                          />
                          <ButtonLink
                              label={t('newRelation.deleteButton')}
                              //className={classNames(styles.buttonLink, styles.red)}
                              onClick={() =>
                                  setSelectedItems((prev: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | ColumnsOutputDefinition | null) =>
                                      Array.isArray(prev) ? prev.filter((prevItem: ConfigurationItemUi) => prevItem.uuid !== item.uuid) : prev,
                                  )
                              }
                          />
                      </ButtonGroupRow>
                  ),
                  content: (
                      <>
                          {relationSchemaCombinedAttributes.map((attribute) => (
                              <>
                                  <AttributeInput
                                      key={`${attribute?.id}+${item.uuid}`}
                                      attribute={attribute ?? {}}
                                      register={register}
                                      setValue={setValue}
                                      clearErrors={clearErrors}
                                      trigger={trigger}
                                      isSubmitted={formState.isSubmitted}
                                      error={getAttributeInputErrorMessage(attribute ?? {}, formState.errors)}
                                      nameSufix={JOIN_OPERATOR + item.uuid + JOIN_OPERATOR + 'RELATION'}
                                      hint={attribute?.description}
                                      hasResetState={{ hasReset, setHasReset }}
                                      constraints={findAttributeConstraint(
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          //@ts-ignore
                                          attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                                          relationData?.constraintsData ?? [],
                                      )}
                                      unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                                  />
                              </>
                          ))}
                      </>
                  ),
              }))
            : []

    return (
        <>
            {publicAuthorityState && roleState && (
                <SelectPublicAuthorityAndRole
                    selectedRoleId={roleState.selectedRole}
                    onChangeAuthority={publicAuthorityState.setSelectedPublicAuthority}
                    onChangeRole={roleState.setSelectedRole}
                    selectedOrg={publicAuthorityState.selectedPublicAuthority}
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
                        <SimpleSelect
                            isClearable={false}
                            label={t('newRelation.selectRelType')}
                            name="relation-type"
                            options={createSelectRelationTypesOptions(relationData?.relatedListAsSources, relationData?.relatedListAsTargets, t)}
                            value={selectedRelationTypeTechnicalName}
                            onChange={(val) => setSelectedRelationAndCI(val ?? '')}
                        />
                        <SelectCiItem
                            filterTypeEntityName={selectedCITypeForRelationTechnicalName ?? ''}
                            onChangeSelectedCiItem={(val) => setSelectedItems(val)}
                            onCloseModal={() => setIsListPageOpen(false)}
                            onOpenModal={() => setIsListPageOpen(true)}
                            existingRelations={undefined}
                            modalContent={<CiListPage importantEntityName={selectedCITypeForRelationTechnicalName} noSideMenu />}
                        />
                        {selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0 && <AccordionContainer sections={sections} />}

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
