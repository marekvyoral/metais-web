import React from 'react'
import {Table} from 'shared/src/components/table/Table'
import {SortingState} from "@tanstack/react-table";
import {set} from "react-hook-form";

const mockData = [{
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'CMDB_HISTORY_REL_PROFIL',
    techName: 'CMDB_HISTORY_REL_PROFI',
    type: 'Systemovy',
    status: 'Platny',
}, {
    name: 'CMDB_HISTORY_CI_PROFIL',
    techName: 'CMDB_HISTORY_CI_PROFIL',
    type: 'Systemovy',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}, {
    name: 'Genericky profil IKT',
    techName: 'Gen_Profil-IKT',
    type: 'Aplikacny',
    status: 'Platny',
}]

interface ColumnSort {
    name: String
    techName: String
    type: String
    status: String
}


export const ManageEgovComponents: React.FC = () => {
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
    const [sorting, setSorting] = React.useState<SortingState>([])
    return (
        <div>
            <Table data={mockData} columns={columns} sorting={sorting} onSortingChange={setSorting} />
        </div>
    )
}
