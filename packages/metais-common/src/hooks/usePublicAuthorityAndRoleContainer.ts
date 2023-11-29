import { useState } from 'react'

import { HierarchyRightsUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { GidRoleData, useAddOrGetGroup } from '@isdd/metais-common/api/generated/iam-swagger'

export const usePublicAuthorityAndRoleContainer = () => {
    const [selectedPublicAuthority, setSelectedPublicAuthority] = useState<HierarchyRightsUi | null>(null)
    const [selectedRole, setSelectedRole] = useState<GidRoleData | null>(null)

    const {
        data: groupData,
        isLoading,
        isError,
        isFetched,
    } = useAddOrGetGroup(selectedRole?.roleUuid ?? '', selectedPublicAuthority?.poUUID ?? '', {
        query: { enabled: !!selectedRole && !!selectedPublicAuthority },
    })

    const publicAuthorityState = { selectedPublicAuthority, setSelectedPublicAuthority }
    const selectedRoleState = { selectedRole, setSelectedRole }

    return {
        groupData,
        publicAuthorityState,
        selectedRoleState,
        isLoading: isFetched && isLoading,
        isError: isFetched && isError,
    }
}
