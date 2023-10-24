import { IAccordionSection, ButtonGroupRow, ButtonLink, AccordionContainer } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, ATTRIBUTE_NAME, EnumType } from '@isdd/metais-common/api'
import { SelectCiItem } from '@isdd/metais-common/components/select-ci-item/SelectCiItem'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import { NewRelationDataProvider, useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MultiValue } from 'react-select'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FieldValues, UseFormRegister, UseFormReturn, UseFormSetValue, UseFormTrigger, set } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'

import CiListPage from '@/pages/ci/[entityName]/entity'
import { getAttributeInputErrorMessage, findAttributeConstraint, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { IRelationshipSetState } from '@/components/views/ci/ITVSExceptions/ITVSExceptionsCreateView'

interface Props {
    ciType: string
    relationSchemaCombinedAttributes: (Attribute | undefined)[]
    methods: UseFormReturn
    hasResetState: any
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    relationType: string
    relationshipSetState: IRelationshipSetState
    register: UseFormRegister<FieldValues>
    setValue: UseFormSetValue<any>
    trigger: UseFormTrigger<any>
}

export const ISVSRelationSelect: React.FC<Props> = ({
    ciType,
    relationSchemaCombinedAttributes,
    methods,
    hasResetState,
    constraintsData,
    unitsData,
    relationType,
    relationshipSetState,
    register,
    setValue,
    trigger,
}) => {
    const navigate = useNavigate()
    const { clearErrors, formState } = methods
    const { selectedItems, setSelectedItems, setIsListPageOpen } = useNewRelationData()
    const { relationshipSet, setRelationshipSet } = relationshipSetState

    const handleItemSelection = (items: ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null) => {
        const selectedCIs = Array.isArray(items) ? items : [items]
        const reducedSet = relationshipSet.filter((rel) => rel.ciType !== ciType)
        setRelationshipSet([...reducedSet, ...selectedCIs.map((ci) => ({ ciType: ciType, type: relationType, endUuid: ci.uuid, uuid: uuidV4() }))])
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
                              onClick={() => navigate(`/ci/ISVS/${item.uuid}`, { state: { from: location } })}
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
                  content: relationSchemaCombinedAttributes.map((attribute) => (
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
                          hasResetState={hasResetState}
                          constraints={findAttributeConstraint(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              //@ts-ignore
                              attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                              constraintsData ?? [],
                          )}
                          unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                      />
                  )),
              }))
            : []
    return (
        <>
            <SelectCiItem
                filterTypeEntityName={ciType}
                onChangeSelectedCiItem={(val) => {
                    setSelectedItems(val)
                    handleItemSelection(val)
                }}
                onCloseModal={() => setIsListPageOpen(false)}
                onOpenModal={() => setIsListPageOpen(true)}
                existingRelations={undefined}
                modalContent={<CiListPage importantEntityName={'ISVS'} noSideMenu />}
                label={'TRANS//Suvisiace ISVS'}
            />
            {selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0 && <AccordionContainer sections={sections} />}
        </>
    )
}
