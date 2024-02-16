import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'
import { ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction, useState } from 'react'

import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, HiddenButtons, QueryFeedback } from '@isdd/metais-common/index'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

type ITableWithPagination<T> = {
    tableData: Array<T>
    tableColumns: ColumnDef<T>[]
    sort?: ColumnSort[]
    setSort?: React.Dispatch<SetStateAction<ColumnSort[]>>
    isLoading?: boolean
    isError?: boolean
    hiddenButtons?: Partial<HiddenButtons>
}

export const TableWithPagination: <T>({
    tableData,
    sort,
    tableColumns,
    hiddenButtons,
}: ITableWithPagination<T>) => React.ReactElement<ITableWithPagination<T>> = ({
    tableData,
    sort,
    tableColumns,
    isLoading,
    isError,
    setSort,
    hiddenButtons,
}) => {
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [pageNumber, setPageNumber] = useState<number>(BASE_PAGE_NUMBER)
    const dataStart = pageNumber * pageSize - pageSize
    const dataEnd = pageNumber * pageSize
    const data = tableData.slice(dataStart, dataEnd)

    return (
        <div>
            <ActionsOverTable
                entityName=""
                handlePagingSelect={(newPageSize) => setPageSize(Number(newPageSize))}
                hiddenButtons={hiddenButtons}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
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
                handlePageChange={(filter) => setPageNumber(filter?.pageNumber ?? BASE_PAGE_NUMBER)}
            />
        </div>
    )
}
