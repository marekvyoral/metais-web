import React from 'react'
import { ActionsOverTable } from '@isdd/metais-common/src/components/actions-over-table/ActionsOverTable'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/src/constants'
import { GetFOPStandardRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'

import DraftsListListContainer from '../../../components/entities/draftsList/DraftsListDataTableContainer'
import DraftsListTable from '../../../components/entities/draftsList/DraftsListTable'
import { DraftsListFilter } from '../../../components/entities/draftsList/DraftsListFilter'

import { MainContentWrapper } from '@/components/MainContentWrapper'
const DraftsListListPage: React.FC = () => {
    const defaultFilterValues: GetFOPStandardRequestsParams = {
        name: '',
        createdBy: '',
        state: '',
        fromDate: '',
        toDate: '',
        draftName: '',
        requestChannel: undefined,
        workGroupId: '',
    }
    return (
        <DraftsListListContainer
            defaultFilterValues={defaultFilterValues}
            View={({ data, handleFilterChange, pagination, sort }) => (
                <>
                    <MainContentWrapper>
                        <DraftsListFilter defaultFilterValues={defaultFilterValues} />
                        <ActionsOverTable
                            entityName="draftsList"
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            hiddenButtons={{ SELECT_COLUMNS: true, BULK_ACTIONS: true }}
                            handleFilterChange={handleFilterChange}
                        />
                        <DraftsListTable data={data?.standardRequests} handleFilterChange={handleFilterChange} pagination={pagination} sort={sort} />
                    </MainContentWrapper>
                </>
            )}
        />
    )
}
export default DraftsListListPage
