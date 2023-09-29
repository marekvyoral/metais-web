import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'

export interface IDraftsListTable {
    data: {
        draftsList: ApiStandardRequestPreview[] | undefined
        workingGroups: (Group | undefined)[]
    }
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    sort: ColumnSort[]
}
