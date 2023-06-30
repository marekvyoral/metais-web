import React, { useState } from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { SortingState } from '@tanstack/react-table'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'

import { EgovListContainer } from '@/components/containers/EgovListContainer'

const Egov: React.FC = () => {
    const columns = [
        {
            header: 'Meno',
            accessorKey: 'name',
            enableSorting: true,
        },
        {
            header: 'Technické meno',
            accessorKey: 'techName',
            enableSorting: true,
        },
        {
            header: 'Typ',
            accessorKey: 'type',
            enableSorting: true,
        },
        {
            header: 'Stav',
            accessorKey: 'status',
            enableSorting: true,
        },
    ]
    const [sorting, setSorting] = useState<SortingState>([])
    const [page, setPage] = useState(1)
    return (
        <EgovListContainer
            View={(data) => (
                <div>
                    <Table data={data} columns={columns} sorting={sorting} onSortingChange={setSorting} />
                    <Paginator pageNumber={page} pageSize={10} dataLength={100} onPageChanged={(p) => setPage(p)} />
                </div>
            )}
        />
    )
}

export default Egov
