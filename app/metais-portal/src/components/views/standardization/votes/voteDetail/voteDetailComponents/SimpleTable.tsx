import { Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { ColumnDef } from '@tanstack/react-table'

type IVotedTabContent<T> = {
    tableData: Array<T>
    tableColumns: ColumnDef<T>[]
    sort: ColumnSort[] | undefined
}

export const SimpleTable: <T>({ tableData, sort, tableColumns }: IVotedTabContent<T>) => React.ReactElement<IVotedTabContent<T>> = ({
    tableData,
    sort,
    tableColumns,
}) => {
    return (
        <>
            <Table data={tableData} columns={tableColumns} sort={sort ?? []} isLoading={false} />
        </>
    )
}
