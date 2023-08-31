import { ColumnSort } from '@isdd/idsk-ui-kit/types'

import { CiListFilterContainerUi, CiType, ConfigurationItemSetUi, EnumType, IColumn } from '@isdd/metais-common/api'

export interface IListFilterCallbacks {
    setListQueryArgs: React.Dispatch<SetStateAction<CiListFilterContainerUi>>
}

export interface IListData {
    entityStructure?: CiType | undefined
    columnListData: IColumn | undefined
    unitsData?: EnumType | undefined
    constraintsData?: (EnumType | undefined)[]
    tableData: void | ConfigurationItemSetUi | AttributeProfilePreview | undefined
    attributeProfiles?: AttributeProfile[]
    attributes?: Attribute[]
    gestorsData?: RoleParticipantUI[]
}

export interface IListView {
    data: IListData
    pagination: Pagination
    sort: ColumnSort[]
    handleFilterChange: (filter: IFilter) => void
    storeUserSelectedColumns: (columnSelection: FavoriteCiType) => void
    resetUserSelectedColumns: () => Promise<void>
    isLoading: boolean
    isError: boolean
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
}
