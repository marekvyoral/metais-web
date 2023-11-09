import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { GetImplicitHierarchyFilter, useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { useMemo, useState } from 'react'

export const useImplicitHierarchy = () => {
    const {
        state: { userInfo: user },
    } = useAuth()
    const userDataGroups = useMemo(() => user?.groupData ?? [], [user])

    const [filter, setFilter] = useState<GetImplicitHierarchyFilter>({
        fullTextSearch: '',
        page: 1,
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: userDataGroups.map((group) => ({ poUUID: group.orgId, roles: group.roles.map((role) => role.roleUuid) })),
    })

    const isEnabled = filter?.rights?.[0]?.roles && filter?.rights?.[0]?.roles.length > 0
    const { implicitHierarchyData } = useGetImplicitHierarchy(filter, !!isEnabled)

    return { implicitHierarchyData, setFilter }
}
