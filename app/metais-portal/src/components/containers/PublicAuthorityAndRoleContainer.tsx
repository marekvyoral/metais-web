import { RoleOrgGroup, useAddOrGetGroup } from '@isdd/metais-common/api/generated/iam-swagger'
import { HierarchyRightsUi, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface PublicAuthorityState {
    selectedPublicAuthority: HierarchyRightsUi | null
    setSelectedPublicAuthority: React.Dispatch<React.SetStateAction<HierarchyRightsUi | null>>
}

export interface RoleState {
    selectedRole: string
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>
}

export interface IPublicAuthorityAndRoleView {
    data?: RoleOrgGroup | undefined
    publicAuthorityState: PublicAuthorityState
    roleState: RoleState
    isLoading: boolean
    isError: boolean
}
interface ICiContainer {
    View: React.FC<IPublicAuthorityAndRoleView>
}

export const PublicAuthorityAndRoleContainer: React.FC<ICiContainer> = ({ View }) => {
    const { t } = useTranslation()
    const [selectedPublicAuthority, setSelectedPublicAuthority] = useState<HierarchyRightsUi | null>(null)
    const [selectedRole, setSelectedRole] = useState<string>('')

    const {
        data: groupData,
        isLoading,
        isError,
        isFetched,
    } = useAddOrGetGroup(selectedRole, selectedPublicAuthority?.poUUID ?? '', { query: { enabled: !!selectedRole && !!selectedPublicAuthority } })

    const publicAuthorityState = { selectedPublicAuthority, setSelectedPublicAuthority }
    const selectedRoleState = { selectedRole, setSelectedRole }

    if (isFetched && (isLoading || isError)) {
        return <QueryFeedback loading={isLoading} error={isError} errorProps={{ errorMessage: t('feedback.failedFetch') }} />
    }
    return <View data={groupData} publicAuthorityState={publicAuthorityState} roleState={selectedRoleState} isLoading={isLoading} isError={isError} />
}
