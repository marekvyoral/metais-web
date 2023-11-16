import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, HiddenButtons, QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { SetStateAction, useState } from 'react'

type ISimpleTable<T> = {
    tableData: Array<T>
    tableColumns: ColumnDef<T>[]
    sort?: ColumnSort[]
    setSort?: React.Dispatch<SetStateAction<ColumnSort[]>>
    isLoading?: boolean
    isError?: boolean
    hiddenButtons?: Partial<HiddenButtons>
}

export const TableWithPagination: <T>({ tableData, sort, tableColumns, hiddenButtons }: ISimpleTable<T>) => React.ReactElement<ISimpleTable<T>> = ({
    tableData,
    sort,
    tableColumns,
    isLoading,
    isError,
    setSort,
    hiddenButtons,
}) => {
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const dataStart = pageNumber * pageSize - pageSize
    const dataEnd = pageNumber * pageSize
    const data = tableData.slice(dataStart, dataEnd)

    return (
        <div>
            <ActionsOverTable
                entityName=""
                handlePagingSelect={(newPageSize) => setPageSize(Number(newPageSize))}
                hiddenButtons={hiddenButtons}
                pagination={{
                    pageNumber: pageNumber || BASE_PAGE_NUMBER,
                    pageSize: pageSize || BASE_PAGE_SIZE,
                    dataLength: 0,
                }}
            />
            <QueryFeedback loading={!!isLoading} error={!!isError}>
                <Table columns={tableColumns} data={data} sort={sort ?? []} onSortingChange={setSort} />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={tableData?.length ?? 0}
                handlePageChange={(filter) => setPageNumber(filter?.pageNumber ?? 0)}
            />
        </div>
    )
}
