import { EntityDocumentsContainer } from '@/components/containers/EntityDocumentContainer'
import React, { useState } from 'react'
import { Table } from '@/components/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckBox } from '@/components/CheckBox'

export const Documents: React.FC = () => {
    const Loading: React.FC = () => {
        return <div>loading</div>
    }

    const Error: React.FC = () => {
        return <div>error</div>
    }

    interface Table {
        attributes: any
        metaAttributes: any
    }
    const columns: Array<ColumnDef<Table>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => (
                <>
                    <CheckBox label="" name="hi" id="hi" value="hi" />
                </>
            ),
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="hi" id="hi" value="hi" />,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: 'Name',
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_poznamka,
            header: 'Note',
            id: '2',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.state,
            header: 'Evidence status',
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.createdAt,
            header: 'Created',
            id: '4',
            cell: (row) => {
                const date = new Date(row.getValue() as string)
                return date.toDateString()
            },
        },
        {
            accessorFn: (row) => row?.metaAttributes?.lastModifiedAt,
            header: 'Last change',
            id: '5',
            cell: (row) => row.getValue() as string,
        },
    ]

    const View: React.FC<any> = (props) => {
        return <Table columns={columns} data={props.data.data} /> //.slice(startData, startData + pageSize)} />
    }

    return <EntityDocumentsContainer View={View} LoadingView={Loading} ErrorView={Error} />
}
