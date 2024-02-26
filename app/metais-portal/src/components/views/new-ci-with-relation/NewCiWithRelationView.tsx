import { SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useStoreGraph } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import {
    useInvalidateCiHistoryListCache,
    useInvalidateCiNeighboursWithAllRelsCache,
    useInvalidateRelationsCountCache,
} from '@isdd/metais-common/hooks/invalidate-cache'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useGetStatus } from '@isdd/metais-common/hooks/useGetRequestStatus'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/src/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { findCommonStrings } from '@isdd/metais-common/utils/utils'
import { ElementToScrollTo } from '@isdd/metais-common/components/element-to-scroll-to/ElementToScrollTo'

import { createSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { ICiCreateItemAndRelationContainerView } from '@/components/containers/CiCreateItemAndRelationContainer'
import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'

export const NewCiWithRelationView: React.FC<ICiCreateItemAndRelationContainerView> = ({
    entityName,
    entityId,
    data,
    states,
    isError,
    isLoading,
    tabName,
    ciName,
}) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const ability = useAbilityContext()
    const canCreateRelationType = ability?.can(Actions.CREATE, `ci.create.newRelationType`)

    const { attributesData, generatedEntityId, relationData, groupData } = data

    const {
        selectedRelationTypeState: { selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName },
        publicAuthorityState: { selectedPublicAuthority, setSelectedPublicAuthority },
        roleState: { selectedRole, setSelectedRole },
    } = states

    const relatedListAsSources = relationData?.relatedListAsSources
    const relatedListAsTargets = relationData?.relatedListAsTargets
    const relationConstraintsData = relationData?.constraintsData

    const relationSchema = relationData?.relationTypeData

    const relationAttributesKeys = [
        ...(relationSchema?.attributes?.map((item) => item.technicalName) ?? []),
        ...(relationSchema?.attributeProfiles?.map((profile) => profile?.attributes?.map((att) => att.technicalName)).flat() ?? []),
    ]
    const ciAttributeKeys = [
        ...(attributesData.ciTypeData?.attributes?.map((item) => item.technicalName) ?? []),
        ...(attributesData.ciTypeData?.attributeProfiles?.map((profile) => profile?.attributes?.map((att) => att.technicalName)).flat() ?? []),
    ]

    const { constraintsData, ciTypeData, unitsData } = attributesData
    const [uploadError, setUploadError] = useState(false)

    const currentName =
        i18n.language == Languages.SLOVAK
            ? data.ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : data.ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const relationTypeOptions = createSelectRelationTypeOptions({
        relatedListAsSources,
        relatedListAsTargets,
        t,
    })

    useEffect(() => {
        if (!selectedRelationTypeTechnicalName) {
            setSelectedRelationTypeTechnicalName(relationTypeOptions[1]?.value)
        }
    }, [
        relatedListAsSources,
        relatedListAsTargets,
        relationTypeOptions,
        selectedRelationTypeTechnicalName,
        selectedRole?.roleName,
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
    const invalidateRelationListCacheByUuid = useInvalidateCiNeighboursWithAllRelsCache(entityId)
    const { invalidate: invalidateHistoryListCache } = useInvalidateCiHistoryListCache()
    const invalidateRelationsCountCache = useInvalidateRelationsCountCache()

    const onStoreGraphSuccess = () => {
        navigate(`/ci/${entityName}/${entityId}`, { state: { from: location } })
        invalidateRelationListCacheByUuid.invalidate()
        invalidateHistoryListCache(entityId)
        invalidateRelationsCountCache.invalidate(entityId)
    }

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess(successData) {
                getRequestStatus(successData.requestId ?? '', onStoreGraphSuccess)
            },
            onError() {
                setUploadError(true)
            },
        },
    })

    const onSubmit = async (formAttributes: FieldValues) => {
        setUploadError(false)

        const formAttributesKeys = Object.keys(formAttributes)

        const formattedRelationAttributes = formAttributesKeys
            .filter((key) => relationAttributesKeys.includes(key))
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            }))
        const formattedCiAttributes = formAttributesKeys
            .filter((key) => ciAttributeKeys.includes(key))
            .map((key) => ({
                name: key,
                value: formatFormAttributeValue(formAttributes, key),
            }))
        const type = tabName
        const ownerId = groupData?.gid
        const newEntityUuid = uuidV4()

        const isRelatedEntityAsTarget =
            relationData?.relatedListAsTargets &&
            relationData?.relatedListAsTargets.find((relData) => relData.relationshipTypeTechnicalName === selectedRelationTypeTechnicalName)

        storeGraph.mutateAsync({
            data: {
                storeSet: {
                    configurationItemSet: [
                        {
                            uuid: newEntityUuid,
                            owner: ownerId,
                            type: type,
                            attributes: formattedCiAttributes,
                        },
                    ],
                    relationshipSet: [
                        {
                            type: selectedRelationTypeTechnicalName,
                            attributes: formattedRelationAttributes,
                            startUuid: isRelatedEntityAsTarget ? entityId : newEntityUuid,
                            endUuid: isRelatedEntityAsTarget ? newEntityUuid : entityId,
                            owner: ownerId,
                            uuid: uuidV4(),
                        },
                    ],
                },
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading || storeGraph.isLoading || isRequestStatusLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('breadcrumbs.newCiAndRelation', { itemName: ciName })}</TextHeading>

                <ElementToScrollTo isVisible={isError || isProcessedError || isTooManyFetchesError || isRequestStatusError}>
                    <QueryFeedback loading={false} error />
                </ElementToScrollTo>
                <ElementToScrollTo isVisible={storeGraph.isError}>
                    <MutationFeedback success={false} error={t('newRelation.mutationError')} />
                </ElementToScrollTo>
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />

            <SelectPublicAuthorityAndRole
                selectedRole={selectedRole ?? {}}
                onChangeAuthority={setSelectedPublicAuthority}
                onChangeRole={setSelectedRole}
                selectedOrg={selectedPublicAuthority}
                ciRoles={findCommonStrings(relationData?.relationTypeData?.roleList ?? [], attributesData?.ciTypeData?.roleList ?? [])}
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

            <CreateCiEntityForm
                entityName={entityName}
                ciTypeData={ciTypeData}
                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                constraintsData={[...constraintsData, ...(relationConstraintsData ?? [])]}
                unitsData={unitsData}
                uploadError={uploadError}
                onSubmit={onSubmit}
                relationSchema={relationSchema}
                isProcessing={storeGraph.isLoading}
                selectedRole={selectedRole}
                withRelation
            />
        </QueryFeedback>
    )
}
