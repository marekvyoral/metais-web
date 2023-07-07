import React, { useState } from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { ColumnSort } from '@isdd/idsk-ui-kit/types'

const mockData = [
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'CMDB_HISTORY_REL_PROFIL',
        techName: 'CMDB_HISTORY_REL_PROFI',
        type: 'Systemovy',
        status: 'Platny',
    },
    {
        name: 'CMDB_HISTORY_CI_PROFIL',
        techName: 'CMDB_HISTORY_CI_PROFIL',
        type: 'Systemovy',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
    {
        name: 'Genericky profil IKT',
        techName: 'Gen_Profil-IKT',
        type: 'Aplikacny',
        status: 'Platny',
    },
]

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
    const [sort] = useState<ColumnSort[]>([])
    const [page, setPage] = useState(1)
    return (
        <div>
            <Table data={mockData} columns={columns} sort={sort} />

            <div>
                <Paginator pageNumber={page} pageSize={10} dataLength={100} onPageChanged={(p) => setPage(p)} />
            </div>
        </div>
    )
}

export default Egov
