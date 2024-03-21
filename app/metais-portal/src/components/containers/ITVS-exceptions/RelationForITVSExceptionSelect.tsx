import { AccordionContainer, BaseModal, ButtonGroupRow, ButtonLink, IAccordionSection, Input } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { CiWithRelsUi, ConfigurationItemUi, IncidentRelationshipSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { Languages } from '@isdd/metais-common/localization/languages'
import classNames from 'classnames'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { MultiValue } from 'react-select'
import { v4 as uuidV4 } from 'uuid'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { ModalButtons } from '@isdd/metais-common/index'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { HasResetState } from '@/components/create-entity/CreateCiEntityForm'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { SelectCiItem } from '@/components/select-ci-item/SelectCiItem'
import { IRelationshipSetState } from '@/components/views/ci/ITVSExceptions/ITVSExceptionsCreateView'
import styles from '@/components/views/new-relation/newRelationView.module.scss'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'

interface Props {
    ciType: string
    relationSchemaCombinedAttributes: (Attribute | undefined)[]
    methods: UseFormReturn
    hasResetState: HasResetState
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    relationType: string
    relationshipSetState: IRelationshipSetState
    label: string
    existingRelations: IncidentRelationshipSetUi | undefined
    defaultData?: CiWithRelsUi[]
}

export const RelationForITVSExceptionSelect: React.FC<Props> = ({
    ciType,
    relationSchemaCombinedAttributes,
    methods,
    hasResetState,
    constraintsData,
    unitsData,
    relationType,
    relationshipSetState,
    label,
    existingRelations,
    defaultData,
}) => {
    const { t, i18n } = useTranslation()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null>(null)

    const [itemDetail, setItemDetail] = useState<ConfigurationItemUi | null | undefined>(null)

    const { ciItemData, gestorData, isLoading: isCiItemLoading, isError: isCiItemError } = useCiHook(itemDetail?.uuid)
    const {
        constraintsData: itemConstraintsData,
        ciTypeData: itemCiTypeData,
        unitsData: itemUnitsData,
        isLoading: isAttLoading,
        isError: isAttError,
    } = useAttributesHook(itemDetail?.type)

    const { register, clearErrors, trigger, setValue, formState } = methods

    const { relationshipSet, setRelationshipSet } = relationshipSetState

    const handleItemSelection = (items: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => {
        const selectedCIs = Array.isArray(items) ? items : [items]
        const reducedSet = relationshipSet.filter((rel) => rel.ciType !== ciType)
        setRelationshipSet([...reducedSet, ...selectedCIs.map((ci) => ({ ciType: ciType, type: relationType, endUuid: ci.uuid, uuid: uuidV4() }))])
    }

    const selectItemSections: IAccordionSection[] =
        selectedItems && Array.isArray(selectedItems)
            ? selectedItems.map((item: ConfigurationItemUi) => ({
                  title: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                  summary: (
                      <ButtonGroupRow key={item.uuid} className={''}>
                          <ButtonLink
                              label={t('newRelation.detailButton')}
                              className={classNames(styles.buttonLink, styles.blue)}
                              onClick={(e) => {
                                  e.preventDefault()
                                  setItemDetail(item)
                              }}
                          />
                          <ButtonLink
                              label={t('newRelation.deleteButton')}
                              className={classNames(styles.buttonLink, styles.red)}
                              onClick={() =>
                                  setSelectedItems((prev: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | ColumnsOutputDefinition | null) =>
                                      Array.isArray(prev) ? prev.filter((prevItem: ConfigurationItemUi) => prevItem.uuid !== item.uuid) : prev,
                                  )
                              }
                          />
                      </ButtonGroupRow>
                  ),
                  content: relationSchemaCombinedAttributes.map(
                      (attribute) =>
                          attribute?.valid &&
                          !attribute.invisible && (
                              <AttributeInput
                                  key={`${attribute?.id}+${item.uuid}`}
                                  control={methods.control}
                                  attribute={attribute ?? {}}
                                  register={register}
                                  setValue={setValue}
                                  clearErrors={clearErrors}
                                  trigger={trigger}
                                  isSubmitted={formState.isSubmitted}
                                  error={getAttributeInputErrorMessage(attribute ?? {}, formState.errors)}
                                  nameSufix={JOIN_OPERATOR + item.uuid + JOIN_OPERATOR + 'RELATION'}
                                  hint={attribute?.description}
                                  hasResetState={hasResetState}
                                  constraints={findAttributeConstraint(
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      //@ts-ignore
                                      attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                                      constraintsData ?? [],
                                  )}
                                  unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                              />
                          ),
                  ),
              }))
            : []

    const defaultSections: IAccordionSection[] =
        defaultData?.map((item) => ({
            title: item?.ci?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
            summary: (
                <ButtonGroupRow key={item.ci?.uuid} className={''}>
                    <ButtonLink
                        label={t('newRelation.detailButton')}
                        className={classNames(styles.buttonLink, styles.blue)}
                        onClick={(e) => {
                            e.preventDefault()
                            setItemDetail(item?.ci)
                        }}
                    />
                </ButtonGroupRow>
            ),
            content: relationSchemaCombinedAttributes.map(
                (attribute) =>
                    attribute?.valid &&
                    !attribute.invisible && (
                        <Input
                            key={`${attribute?.id}+${item.ci?.uuid}`}
                            disabled
                            hint={attribute?.description}
                            label={i18n.language === Languages.SLOVAK ? attribute.name : attribute.engName}
                            defaultValue={
                                item.rels?.[0].attributes?.find((relAttribute) => relAttribute.name === attribute.technicalName)?.value?.toString() ??
                                ''
                            }
                            name={`${attribute.technicalName}${JOIN_OPERATOR}${item.ci?.uuid}${JOIN_OPERATOR}RELATION`}
                        />
                    ),
            ),
        })) ?? []

    const sections = [...selectItemSections, ...defaultSections]

    const showAccordion = (selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0) || (defaultData && defaultData?.length > 0)

    return (
        <>
            <SelectCiItem
                ciType={ciType}
                onChangeSelectedCiItem={(val) => {
                    setSelectedItems(val)
                    handleItemSelection(val)
                }}
                onCloseModal={() => setIsOpen(false)}
                onOpenModal={() => setIsOpen(true)}
                existingRelations={existingRelations}
                label={label}
                isOpen={isOpen}
                selectedItems={selectedItems}
            />
            {showAccordion && <AccordionContainer sections={sections} />}

            <BaseModal isOpen={itemDetail !== null} close={() => setItemDetail(null)}>
                <div className={styles.modalContent}>
                    {itemDetail && (
                        <CiInformationAccordion
                            data={{
                                ciItemData,
                                gestorData,
                                constraintsData: itemConstraintsData,
                                ciTypeData: itemCiTypeData,
                                unitsData: itemUnitsData,
                            }}
                            isError={isAttError || isCiItemError}
                            isLoading={isAttLoading || isCiItemLoading}
                        />
                    )}
                </div>
                <ModalButtons onClose={() => setItemDetail(null)} />
            </BaseModal>
        </>
    )
}
