import { IAccordionSection, ButtonGroupRow, ButtonLink, AccordionContainer } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { JOIN_OPERATOR } from '@isdd/metais-common/constants'
import React, { useState } from 'react'
import { MultiValue } from 'react-select'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemUi, IncidentRelationshipSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidV4 } from 'uuid'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

import { SelectCiItem } from '@/components/select-ci-item/SelectCiItem'
import { getAttributeInputErrorMessage, findAttributeConstraint, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { IRelationshipSetState } from '@/components/views/ci/ITVSExceptions/ITVSExceptionsCreateView'
import styles from '@/components/views/new-relation/newRelationView.module.scss'
import { HasResetState } from '@/components/create-entity/CreateCiEntityForm'
import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'

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
}) => {
    const { t } = useTranslation()

    const [isOpen, setIsOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | null>(null)

    const { register, clearErrors, trigger, setValue, formState } = methods

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
                              className={classNames(styles.buttonLink, styles.blue)}
                              onClick={() => {
                                  window.open(`/ci/ISVS/${item.uuid}`, '_blank')
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
            {selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0 && <AccordionContainer sections={sections} />}
        </>
    )
}
