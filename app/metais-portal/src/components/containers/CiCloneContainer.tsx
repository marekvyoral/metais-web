import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import { ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import {
    CiCode,
    CiType,
    RelationshipType,
    useGenerateCodeAndURL,
    useGetRelationshipTypeHook,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAttributesHook } from '@isdd/metais-common/hooks/useAttributes.hook'
import { useCiHook } from '@isdd/metais-common/hooks/useCi.hook'
import { Languages } from '@isdd/metais-common/localization/languages'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { PublicAuthorityState, RoleState, usePublicAuthorityAndRoleHook } from '@/hooks/usePublicAuthorityAndRole.hook'

export interface ICiTypeRelationData {
    relatedList: RelationshipType[]
}

export interface ISelectedRelationTypeState {
    selectedRelationTypeTechnicalName: string
    setSelectedRelationTypeTechnicalName: Dispatch<SetStateAction<string>>
}

export interface ICiCloneContainerView {
    ciName: string
    entityName: string
    entityId: string
    ciItemData: ConfigurationItemUi | undefined
    relationData: ICiTypeRelationData
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType
    selectedRelationTypeState: ISelectedRelationTypeState
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
    isLoading: boolean
    isError: boolean
    newCiCode?: CiCode
}

interface ICiCloneContainer {
    entityName: string
    configurationItemId: string
    technicalNames: string[]
    View: React.FC<ICiCloneContainerView>
}

export const CiCloneContainer: React.FC<ICiCloneContainer> = ({ entityName, configurationItemId, technicalNames, View }) => {
    const { i18n } = useTranslation()

    const { ciItemData, isLoading: isCiLoading, isError: isCiError } = useCiHook(configurationItemId)

    const { isError: publicAuthAndRoleError, isLoading: publicAuthAndRoleLoading, publicAuthorityState, roleState } = usePublicAuthorityAndRoleHook()

    const { ciTypeData, constraintsData, isError: isAttributesError, isLoading: isAttributesLoading, unitsData } = useAttributesHook(entityName)

    const [selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName] = useState<string>('')
    const [relationTypes, setRelationTypes] = useState<RelationshipType[]>([])
    const getRelationType = useGetRelationshipTypeHook()
    const { data: newCiCode } = useGenerateCodeAndURL(entityName)

    useEffect(() => {
        const relationPromises = technicalNames.map((technicalName) => getRelationType(technicalName))
        Promise.all(relationPromises).then((types) => {
            setRelationTypes(types)
            setSelectedRelationTypeTechnicalName(types.at(0)?.technicalName ?? '')
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ciName =
        i18n.language == Languages.SLOVAK
            ? ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
            : ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov]

    const isLoading = [isCiLoading, isAttributesLoading, publicAuthAndRoleLoading].some((item) => item)
    const isError = [isCiError, isAttributesError, publicAuthAndRoleError].some((item) => item)

    return (
        <View
            newCiCode={newCiCode}
            entityName={entityName}
            entityId={configurationItemId}
            ciName={ciName}
            ciItemData={ciItemData}
            relationData={{ relatedList: relationTypes }}
            ciTypeData={ciTypeData}
            constraintsData={constraintsData}
            unitsData={unitsData}
            publicAuthorityState={publicAuthorityState}
            roleState={roleState}
            selectedRelationTypeState={{ selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
