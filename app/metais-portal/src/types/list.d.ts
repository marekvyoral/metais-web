import { ColumnSort } from '@isdd/idsk-ui-kit/types'

import { CiType, IColumn, EnumType, ConfigurationItemSetUi, CiListFilterContainerUi } from '@/api'

export interface IListFilterCallbacks {
    setListQueryArgs: React.Dispatch<SetStateAction<CiListFilterContainerUi>>
}

export interface IListData {
    entityStructure?: CiType | undefined
    columnListData: IColumn | undefined
    unitsData?: EnumType | undefined
    constraintsData?: (EnumType | undefined)[]
    tableData: void | ConfigurationItemSetUi | undefined
}

export interface IListView {
    data: IListData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    sort: ColumnSort[]
}
