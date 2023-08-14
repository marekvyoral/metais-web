import { SortBy, SortType } from '@isdd/idsk-ui-kit/types'
import { GetImplicitHierarchyFilter, useGetImplicitHierarchy } from '@isdd/metais-common/hooks/useGetImplicitHierarchy'
import { useState } from 'react'

export const useImplicitHierarchy = () => {
    //this was in every call... bug?
    const implicitHierarchyPoUUID = '67d48d04-321e-426e-a321-e0bc6fa40437'
    const [filter, setFilter] = useState<GetImplicitHierarchyFilter>({
        fullTextSearch: '',
        page: 1,
        perpage: 20,
        sortBy: SortBy.HIERARCHY_FROM_ROOT,
        sortType: SortType.ASC,
        rights: [
            {
                //vsade sa tam posielal len tento string
                poUUID: implicitHierarchyPoUUID,
                roles: [],
            },
        ],
    })
    const { implicitHierarchyData } = useGetImplicitHierarchy(filter)

    return { implicitHierarchyData, setFilter }
}
