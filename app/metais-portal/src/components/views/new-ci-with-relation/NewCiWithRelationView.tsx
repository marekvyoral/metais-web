import { SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RoleOrgGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ConfigurationItemUi, useStoreGraph } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/src/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CiType, CiCode } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useInvalidateCiNeighboursWithAllRelsCache } from '@isdd/metais-common/hooks/invalidate-cache'

import { createSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { INewCiRelationData, ISelectedRelationTypeState } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'

interface AttrributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
}

interface NewCiWithRelationData {
    attributesData: AttrributesData
    generatedEntityId: CiCode | undefined
    relationData: INewCiRelationData | undefined
    groupData: RoleOrgGroup | undefined
    ciItemData: ConfigurationItemUi | undefined
}

export interface NewCiWithRelationStates {
    selectedRelationTypeState: ISelectedRelationTypeState
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
}

interface Props {
    entityName: string
    entityId: string
    tabName: string
    data: NewCiWithRelationData
    states: NewCiWithRelationStates
    isLoading: boolean
    isError: boolean
}

export const NewCiWithRelationView: React.FC<Props> = ({ entityName, entityId, data, states, isError, isLoading, tabName }) => {
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
    const { setIsListPageOpen, setSelectedItems } = useNewRelationData()
    const [uploadError, setUploadError] = useState(false)

    const currentName =
        i18n.language == Languages.SLOVAK
            ? data.ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : data.ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    useEffect(() => {
        if (!selectedRelationTypeTechnicalName) {
            setSelectedRelationTypeTechnicalName(
                createSelectRelationTypeOptions({ relatedListAsSources, relatedListAsTargets, t, currentRole: selectedRole?.roleName ?? '' })[1]
                    ?.value,
            )
        }
    }, [
        relatedListAsSources,
        relatedListAsTargets,
        selectedRelationTypeTechnicalName,
        selectedRole?.roleName,
        setSelectedRelationTypeTechnicalName,
        t,
    ])

    const invalidateRelationListCacheByUuid = useInvalidateCiNeighboursWithAllRelsCache(entityId)

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess() {
                navigate(`/ci/${entityName}/${entityId}`, { state: { from: location } })
                setIsListPageOpen(false)
                setSelectedItems(null)
                invalidateRelationListCacheByUuid.invalidate()
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
                            startUuid: entityId,
                            endUuid: newEntityUuid,
                            owner: ownerId,
                            uuid: uuidV4(),
                        },
                    ],
                },
            },
        })
    }

    return (
        <QueryFeedback loading={isLoading} error={false} withChildren>
            <FlexColumnReverseWrapper>
                <TextHeading size="XL">{t('newRelation.newCiWithRelationHeading', { entityName: tabName })}</TextHeading>
                {isError && <QueryFeedback loading={false} error={isError} />}
                {(storeGraph.isError || storeGraph.isSuccess) && (
                    <MutationFeedback success={storeGraph.isSuccess} error={storeGraph.isError ? t('newRelation.mutationError') : ''} />
                )}
            </FlexColumnReverseWrapper>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />

            <SelectPublicAuthorityAndRole
                selectedRole={selectedRole ?? {}}
                onChangeAuthority={setSelectedPublicAuthority}
                onChangeRole={setSelectedRole}
                selectedOrg={selectedPublicAuthority}
                ciRoles={ciTypeData?.roleList ?? []}
            />

            <SimpleSelect
                isClearable={false}
                label={t('newRelation.selectRelType')}
                name="relation-type"
                options={createSelectRelationTypeOptions({
                    relatedListAsSources,
                    relatedListAsTargets,
                    t,
                    currentRole: selectedRole?.roleName ?? '',
                })}
                value={selectedRelationTypeTechnicalName}
                onChange={(val) => setSelectedRelationTypeTechnicalName(val ?? '')}
                error={!canCreateRelationType ? t('newRelation.selectRelTypeError') : ''}
            />

            <CreateCiEntityForm
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
