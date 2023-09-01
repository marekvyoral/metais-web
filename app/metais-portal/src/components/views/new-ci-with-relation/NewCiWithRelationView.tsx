import { BreadCrumbs, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RoleOrgGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { SelectPublicAuthorityAndRole } from '@isdd/metais-common/common/SelectPublicAuthorityAndRole'
import { SubHeading } from '@isdd/metais-common/components/sub-heading/SubHeading'
import { useNewRelationData } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { ATTRIBUTE_NAME, CiCode, CiType, ConfigurationItemUi, EnumType, MutationFeedback, useStoreGraph } from '@isdd/metais-common/index'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useEffect, useState } from 'react'
import { FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidV4 } from 'uuid'

import { createSelectRelationTypeOptions } from '@/componentHelpers/new-relation'
import { INewCiRelationData, ISelectedRelationTypeState } from '@/components/containers/NewCiRelationContainer'
import { PublicAuthorityState, RoleState } from '@/components/containers/PublicAuthorityAndRoleContainer'
import { CreateCiEntityForm } from '@/components/create-entity/CreateCiEntityForm'
import { formatFormAttributeValue } from '@/components/create-entity/createEntityHelpers'

interface AttrributesData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType | undefined
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
}

export const NewCiWithRelationView: React.FC<Props> = ({ entityName, entityId, data, states, tabName }) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

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
            setSelectedRelationTypeTechnicalName(createSelectRelationTypeOptions(relatedListAsSources, relatedListAsTargets, t)[1].value)
        }
    }, [relatedListAsSources, relatedListAsTargets, selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName, t])

    const storeGraph = useStoreGraph({
        mutation: {
            onSuccess() {
                navigate(`/ci/${entityName}/${entityId}`)
                setIsListPageOpen(false)
                setSelectedItems(null)
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
        const type = entityName
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
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: '/' },
                    { label: entityName, href: `/ci/${entityName}` },
                    { label: currentName ? currentName : t('breadcrumbs.noName'), href: `/ci/${entityName}/${entityId}` },
                    {
                        label: t('breadcrumbs.newCiAndRelation', { itemName: currentName }),
                        href: `/ci/${entityName}/${entityId}/new-ci/${tabName}`,
                    },
                ]}
            />
            {(storeGraph.isError || storeGraph.isSuccess) && (
                <MutationFeedback success={storeGraph.isSuccess} error={storeGraph.isError ? t('newRelation.mutationError') : ''} />
            )}
            <TextHeading size="XL">{t('newRelation.newCiWithRelationHeading')}</TextHeading>
            <SubHeading entityName={entityName} entityId={entityId} currentName={currentName} />
            <SelectPublicAuthorityAndRole
                selectedRoleId={selectedRole}
                onChangeAuthority={setSelectedPublicAuthority}
                onChangeRole={setSelectedRole}
                selectedOrg={selectedPublicAuthority}
            />
            <SimpleSelect
                isClearable={false}
                label={t('newRelation.selectRelType')}
                name="relation-type"
                options={createSelectRelationTypeOptions(relatedListAsSources, relatedListAsTargets, t)}
                value={selectedRelationTypeTechnicalName}
                onChange={(val) => setSelectedRelationTypeTechnicalName(val ?? '')}
            />
            <CreateCiEntityForm
                ciTypeData={ciTypeData}
                generatedEntityId={generatedEntityId ?? { cicode: '', ciurl: '' }}
                constraintsData={[...constraintsData, ...(relationConstraintsData ?? [])]}
                unitsData={unitsData}
                uploadError={uploadError}
                onSubmit={onSubmit}
                relationSchema={relationSchema}
            />
        </>
    )
}
