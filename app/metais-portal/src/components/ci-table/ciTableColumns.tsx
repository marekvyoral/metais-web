import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { Link } from 'react-router-dom'

import { CheckBox } from '../CheckBox'

import styles from './ciTable.module.scss'

//placeholders
interface Table {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    attributes: any
    metaAttributes: any
    checked: string
}

//names will change based on user
export const columns: Array<ColumnDef<Table>> = [
    {
        accessorFn: (row) => row.checked,
        header: () => <CheckBox label="" name="checkbox" id="checkbox" value="true" />,
        id: '0',
        cell: (row) => <CheckBox label={row.getValue() as string} name="checkbox" id={row.getValue() as string} value="true" />,
    },
    {
        accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
        header: 'Name',
        id: '1',
        cell: (row) => <Link to={'#'}>{row.getValue() as string}</Link>,
    },
    {
        accessorFn: (row) => row?.attributes?.Gen_Profil_kod_metais,
        header: 'Description',
        id: '2',
        cell: (row) => <strong>{row.getValue() as string}</strong>,
    },
    {
        accessorFn: (row) => row?.metaAttributes?.state,
        header: 'Evidence status',
        id: '3',
        cell: (row) => <div className={styles.lightColor}>{row.getValue() as string}</div>,
    },
    {
        accessorFn: (row) => row?.metaAttributes?.createdAt,
        header: 'Created',
        id: '4',
        cell: (row) => {
            const date = new Date(row.getValue() as string)
            return <div className={styles.lightColor}>{date.toDateString()}</div>
        },
    },
    {
        accessorFn: (row) => row?.metaAttributes?.lastModifiedAt,
        header: 'Last change',
        id: '5',
        cell: (row) => <div className={styles.lightColor}>{row.getValue() as string}</div>,
    },
]
