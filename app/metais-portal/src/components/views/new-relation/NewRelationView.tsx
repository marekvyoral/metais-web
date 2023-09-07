import {
    AccordionContainer,
    BreadCrumbs,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ErrorBlock,
    IAccordionSection,
    SimpleSelect,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, ConfigurationItemUi, useStoreGraph } from '@isdd/metais-common/api'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import { JOIN_OPERATOR, metaisEmail } from '@isdd/metais-common/constants'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { SubmitWithFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { SelectCiItem } from '@isdd/metais-common/src/components/select-ci-item/SelectCiItem'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MultiValue } from 'react-select'
import { v4 as uuidV4 } from 'uuid'

import styles from './newRelationView.module.scss'

import { createSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { ColumnsOutputDefinition } from '@/components/ci-table/ciTableHelpers'
import { INewCiRelationData, ISelectedRelationTypeState } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import CiListPage from '@/pages/ci/[entityName]/entity'

interface Props {
    ciItemData: ConfigurationItemUi | undefined
    relationData: INewCiRelationData | undefined
    selectedRelationTypeState: ISelectedRelationTypeState
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
    tabName: string
    entityId: string
    entityName: string
    ownerGid: string
}

export const NewRelationView: React.FC<Props> = ({
    ciItemData,
    tabName,
    entityId,
    entityName,
    relationData,
    selectedRelationTypeState,
    ownerGid,
    publicAuthorityState,
    roleState,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const [hasReset, setHasReset] = useState(false)
    const [hasMutationError, setHasMutationError] = useState(false)
    const location = useLocation()
    const { selectedItems, setSelectedItems, setIsListPageOpen } = useNewRelationData()

    const relatedListAsSources = relationData?.relatedListAsSources
    const relatedListAsTargets = relationData?.relatedListAsTargets
    const constraintsData = relationData?.constraintsData ?? []
    const unitsData = relationData?.unitsData

    const { register, handleSubmit: handleFormSubmit, formState, setValue, clearErrors, trigger } = useForm()
    const relationSchema = relationData?.relationTypeData
    const relationSchemaCombinedAttributes = [
        ...(relationSchema?.attributes ?? []),
        ...(relationSchema?.attributeProfiles?.map((profile) => profile.attributes?.map((att) => att)).flat() ?? []),
    ]

    const existingRelations = relationData?.readRelationShipsData

    const { selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName } = selectedRelationTypeState

    const areSelectedItems = Array.isArray(selectedItems) ? selectedItems.length > 0 : false
    const isSubmitDisabled =
        !selectedRelationTypeTechnicalName ||
        !roleState.selectedRole ||
        !publicAuthorityState.selectedPublicAuthority ||
        !ownerGid ||
        !areSelectedItems

    const currentName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    useEffect(() => {
        if (!selectedRelationTypeTechnicalName) {
            setSelectedRelationTypeTechnicalName(createSelectRelationTypeOptions(relatedListAsSources, relatedListAsTargets, t)[1].value)
        }
    }, [relatedListAsSources, relatedListAsTargets, selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName, t])

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess() {
                navigate(`/ci/${entityName}/${entityId}`, { state: { from: location } })
                setIsListPageOpen(false)
                setSelectedItems(null)
            },
            onError() {
                setHasMutationError(true)
            },
        },
    })

    const handleSubmit = (formData: FieldValues) => {
        setHasMutationError(false)
        const splittedFormData = Object.keys(formData)
            .map((key) => key.split(JOIN_OPERATOR))
            .map((item) => ({ name: item[0], id: item[1] }))

        const data = {
            storeSet: {
                relationshipSet:
                    selectedItems && Array.isArray(selectedItems)
                        ? selectedItems.map((item: ConfigurationItemUi) => ({
                              type: selectedRelationTypeTechnicalName,
                              attributes: [
                                  ...splittedFormData
                                      .filter((key) => key.id == item.uuid)
                                      .map((key) => ({ name: key.name, value: formData[key.name + JOIN_OPERATOR + key.id] })),
                              ],
                              //uuid of picked entities
                              startUuid: item.uuid,
                              //id of current entity
                              endUuid: entityId,
                              //from getGroup Api
                              owner: ownerGid,
                              uuid: uuidV4(),
                          }))
                        : [],
            },
        }

        storeGraph.mutateAsync({ data })
    }

    const handleReset = () => {
        setIsListPageOpen(false)
        setSelectedItems(null)
        navigate(`/ci/${entityName}/${entityId}`, { state: { from: location } })
    }

    const sections: IAccordionSection[] =
        selectedItems && Array.isArray(selectedItems)
            ? selectedItems.map((item: ConfigurationItemUi) => ({
                  title: item.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
                  summary: (
                      <ButtonGroupRow key={item.uuid} className={styles.accordionButtonDiv}>
                          <ButtonLink
                              label={t('newRelation.detailButton')}
                              className={classNames(styles.buttonLink, styles.blue)}
                              onClick={() => navigate(`/ci/${tabName}/${item.uuid}`, { state: { from: location } })}
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
                  content: (
                      <>
                          {relationSchemaCombinedAttributes.map((attribute) => (
                              <AttributeInput
                                  key={`${attribute?.id}+${item.uuid}`}
                                  attribute={attribute ?? {}}
                                  register={register}
                                  setValue={setValue}
                                  clearErrors={clearErrors}
                                  trigger={trigger}
                                  isSubmitted={formState.isSubmitted}
                                  error={getAttributeInputErrorMessage(attribute ?? {}, formState.errors)}
                                  nameSufix={JOIN_OPERATOR + item.uuid}
                                  hint={attribute?.description}
                                  hasResetState={{ hasReset, setHasReset }}
                                  constraints={findAttributeConstraint(
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      //@ts-ignore
                                      attribute?.constraints?.map((att: AttributeConstraintEnumAllOf) => att.enumCode ?? '') ?? [],
                                      constraintsData,
                                  )}
                                  unitsData={attribute?.units ? getAttributeUnits(attribute.units ?? '', unitsData) : undefined}
                              />
                          ))}
                      </>
                  ),
              }))
            : []

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: '/' },
                    { label: entityName, href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    {
                        label: t('breadcrumbs.newRelation', { itemName: currentName }),
                        href: `/ci/${entityName}/${entityId}/new-relation/${tabName}`,
                    },
                ]}
            />
            <TextHeading size="XL">{t('newRelation.heading', { relationEntityName: tabName })}</TextHeading>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />
            <SelectPublicAuthorityAndRole
                onChangeAuthority={(e) => publicAuthorityState.setSelectedPublicAuthority(e)}
                onChangeRole={(val) => roleState.setSelectedRole(val)}
                selectedRoleId={roleState.selectedRole}
                selectedOrg={publicAuthorityState.selectedPublicAuthority}
            />
            <SimpleSelect
                isClearable={false}
                label={t('newRelation.selectRelType')}
                name="relation-type"
                options={createSelectRelationTypeOptions(relatedListAsSources, relatedListAsTargets, t)}
                value={selectedRelationTypeTechnicalName}
                onChange={(val) => setSelectedRelationTypeTechnicalName(val ?? '')}
            />
            <SelectCiItem
                filterTypeEntityName={tabName}
                onChangeSelectedCiItem={(val) => setSelectedItems(val)}
                onCloseModal={() => setIsListPageOpen(false)}
                onOpenModal={() => setIsListPageOpen(true)}
                existingRelations={existingRelations}
                modalContent={<CiListPage importantEntityName={tabName} />}
            />
            <form onSubmit={handleFormSubmit(handleSubmit)}>
                {selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0 && <AccordionContainer sections={sections} />}
                {hasMutationError && (
                    <ErrorBlock
                        errorTitle={t('newRelation.errorTitle')}
                        errorMessage={
                            <>
                                {t('newRelation.errorMessage')}
                                <Link className="govuk-link" state={{ from: location }} to={`mailto:${metaisEmail}`}>
                                    {t('newRelation.email')}
                                </Link>
                            </>
                        }
                    />
                )}

                <SubmitWithFeedback
                    submitButtonLabel={t('newRelation.save')}
                    additionalButtons={[<Button key={1} label={t('newRelation.cancel')} type="reset" variant="secondary" onClick={handleReset} />]}
                    loading={storeGraph.isLoading}
                    disabled={isSubmitDisabled}
                />
            </form>
        </>
    )
}