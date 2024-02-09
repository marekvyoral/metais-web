import {
    AccordionContainer,
    Button,
    ButtonGroupRow,
    ButtonLink,
    ErrorBlock,
    IAccordionSection,
    SimpleSelect,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemUi, useStoreGraph } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import { JOIN_OPERATOR, metaisEmail } from '@isdd/metais-common/constants'
import { QueryFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MultiValue } from 'react-select'
import { v4 as uuidV4 } from 'uuid'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import {
    useInvalidateCiHistoryListCache,
    useInvalidateCiNeighboursWithAllRelsCache,
    useInvalidateRelationsCountCache,
} from '@isdd/metais-common/hooks/invalidate-cache'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'

import styles from './newRelationView.module.scss'

import { createSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { AttributeInput } from '@/components/attribute-input/AttributeInput'
import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { findAttributeConstraint, getAttributeInputErrorMessage, getAttributeUnits } from '@/components/create-entity/createEntityHelpers'
import { SelectCiItem } from '@/components/select-ci-item/SelectCiItem'
import { INewCiRelationData, ISelectedRelationTypeState } from '@/hooks/useNewCiRelation.hook'
import { PublicAuthorityState, RoleState } from '@/hooks/usePublicAuthorityAndRole.hook'

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
    isLoading: boolean
    isError: boolean
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
    isLoading,
    isError,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const ability = useAbilityContext()
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)

    const [hasReset, setHasReset] = useState(false)
    const [hasMutationError, setHasMutationError] = useState(false)
    const location = useLocation()

    const { setIsActionSuccess } = useActionSuccess()

    const [selectedItems, setSelectedItems] = useState<ConfigurationItemUi | MultiValue<ConfigurationItemUi> | ColumnsOutputDefinition | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const relatedListAsSources = relationData?.relatedListAsSources
    const relatedListAsTargets = relationData?.relatedListAsTargets
    const constraintsData = relationData?.constraintsData ?? []
    const unitsData = relationData?.unitsData

    const { register, handleSubmit: handleFormSubmit, formState, setValue, clearErrors, trigger, control } = useForm()
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

    const relationTypeOptions = createSelectRelationTypeOptions({
        relatedListAsSources,
        relatedListAsTargets,
        t,
    })

    useEffect(() => {
        const isRelTypeInOptions = relationTypeOptions.find(
            (option) => option?.value === selectedRelationTypeState?.selectedRelationTypeTechnicalName,
        )

        if (!selectedRelationTypeTechnicalName) {
            setSelectedRelationTypeTechnicalName(relationTypeOptions?.[1]?.value)
        } else if (!isRelTypeInOptions) {
            setSelectedRelationTypeTechnicalName(relationTypeOptions?.[1]?.value)
        }
    }, [
        relatedListAsSources,
        relatedListAsTargets,
        relationTypeOptions,
        roleState?.selectedRole?.roleName,
        selectedRelationTypeState?.selectedRelationTypeTechnicalName,
        selectedRelationTypeTechnicalName,
        setSelectedRelationTypeTechnicalName,
        t,
    ])

    const {
        getRequestStatus,
        isLoading: isRequestStatusLoading,
        isError: isRequestStatusError,
        isProcessedError,
        isTooManyFetchesError,
    } = useGetStatus()

    const invalidateRelationsCountCache = useInvalidateRelationsCountCache()
    const invalidateRelationListCacheByUuid = useInvalidateCiNeighboursWithAllRelsCache(entityId)
    const { invalidate: invalidateHistoryListCache } = useInvalidateCiHistoryListCache()

    const onStoreGraphSuccess = () => {
        setIsActionSuccess({ value: true, path: `/ci/${entityName}/${entityId}`, additionalInfo: { type: 'relationCreated' } })
        navigate(`/ci/${entityName}/${entityId}`, { state: { from: location } })
        setIsOpen(false)
        setSelectedItems(null)
        invalidateHistoryListCache(entityId)
        invalidateRelationListCacheByUuid.invalidate()
        invalidateRelationsCountCache.invalidate(entityId)
    }

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess(data) {
                getRequestStatus(data.requestId ?? '', onStoreGraphSuccess)
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

        const isRelatedEntityAsTarget =
            relationData?.relatedListAsTargets &&
            relationData?.relatedListAsTargets.find((data) => data.relationshipTypeTechnicalName === selectedRelationTypeTechnicalName)

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
                              startUuid: isRelatedEntityAsTarget ? entityId : item.uuid,
                              //id of current entity
                              endUuid: isRelatedEntityAsTarget ? item.uuid : entityId,
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
        setIsOpen(false)
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
                              onClick={() => {
                                  window.open(`/ci/${tabName}/${item.uuid}`, '_blank')
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
                  content: (
                      <>
                          {relationSchemaCombinedAttributes.map(
                              (attribute) =>
                                  attribute?.valid &&
                                  !attribute.invisible && (
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
                                          control={control}
                                      />
                                  ),
                          )}
                      </>
                  ),
              }))
            : []

    return (
        <QueryFeedback loading={isLoading || storeGraph.isLoading || isRequestStatusLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('newRelation.heading')}</TextHeading>
                <ElementToScrollTo isVisible={isError || storeGraph.isError || isRequestStatusError || isProcessedError || isTooManyFetchesError}>
                    <QueryFeedback loading={false} error />
                </ElementToScrollTo>
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} ciType={ciItemData?.type ?? ''} />
            <SelectPublicAuthorityAndRole
                onChangeAuthority={(e) => publicAuthorityState.setSelectedPublicAuthority(e)}
                onChangeRole={(val) => roleState.setSelectedRole(val)}
                selectedRole={roleState.selectedRole ?? {}}
                selectedOrg={publicAuthorityState.selectedPublicAuthority}
                ciRoles={relationData?.relationTypeData?.roleList ?? []}
            />

            <SimpleSelect
                isClearable={false}
                label={t('newRelation.selectRelType')}
                name="relation-type"
                options={relationTypeOptions}
                value={selectedRelationTypeTechnicalName}
                onChange={(val) => setSelectedRelationTypeTechnicalName(val ?? '')}
                error={!canCreateRelationType ? t('newRelation.wrongRoleRelTypeError') : ''}
            />

            <SelectCiItem
                ciType={tabName}
                isOpen={isOpen}
                selectedItems={selectedItems}
                onChangeSelectedCiItem={(val) => setSelectedItems(val)}
                onCloseModal={() => setIsOpen(false)}
                onOpenModal={() => setIsOpen(true)}
                existingRelations={existingRelations}
            />

            {selectedItems && Array.isArray(selectedItems) && selectedItems.length > 0 && <AccordionContainer sections={sections} />}
            <form onSubmit={handleFormSubmit(handleSubmit)}>
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
                    disabled={isSubmitDisabled || !canCreateRelationType || !roleState?.selectedRole?.roleUuid}
                />
            </form>
        </QueryFeedback>
    )
}
