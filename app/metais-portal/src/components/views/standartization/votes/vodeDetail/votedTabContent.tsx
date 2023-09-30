import { Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { ApiVoteActorResult } from '@isdd/metais-common/api'

import { voteDetailColumns } from './voteDetailColumns'

interface IVotedTabContent<T> {
    tableData: Array<T>
    sort: ColumnSort[] | undefined
}

export const VotedTabContent: React.FC<IVotedTabContent<ApiVoteActorResult>> = ({ tableData, sort }) => {
    const { t } = useTranslation()
    const tableColumns = voteDetailColumns(t)

    return (
        <>
            <Table
                data={tableData}
                columns={tableColumns}
                sort={sort ?? []}
                // onSortingChange={(columnSort) => {
                //     handleFilterChange({ sort: columnSort })
                // }}
                isLoading={false}
                error={undefined}
            />
        </>
    )
}
