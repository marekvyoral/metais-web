import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { Link } from 'react-router-dom'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'

import styles from './ciTable.module.scss'

import { Attribute, ConfigurationItemUiAttributes } from '@/api'

interface ColumnsDefinition {
    name: string
    order: number
}

export interface ColumnsOutputDefinition {
    attributes?: ConfigurationItemUiAttributes
    metaAttributes?: {
        [key: string]: string
    }
    type?: string
    uuid?: string
    checked?: boolean
}

export const createColumnsData = (attributes: ColumnsDefinition[], metaAttributes: ColumnsDefinition[], allAttributes: Attribute[]) => {
    attributes?.sort((a, b) => a?.order - b?.order)
    let newColumns: Array<ColumnDef<ColumnsOutputDefinition>> = [
        {
            accessorFn: (row) => row?.checked,
            header: () => <></>,
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="checkbox" id={row.getValue() as string} value="true" />,
        },
    ]
    attributes?.map((attribute, index) => {
        const attributeName = attribute?.name
        const attributeHeader = allAttributes?.find((attr) => attr?.technicalName === attributeName)?.name
        newColumns = [
            ...newColumns,
            {
                accessorFn: (row) => row?.attributes?.[attributeName],
                header: attributeHeader ?? attributeName,
                id: attributeName,
                cell: (ctx) =>
                    !index ? (
                        <Link to={'./' + ctx?.row?.original?.uuid}>{ctx?.getValue?.() as string}</Link>
                    ) : (
                        <strong>{ctx.getValue() as string}</strong>
                    ),
            },
        ]
    })
    metaAttributes?.sort((a, b) => a?.order - b?.order)
    metaAttributes?.map((metaAttribute) => {
        const attributeName = metaAttribute?.name
        const attributeHeader = allAttributes?.find((attr) => attr?.technicalName === attributeName)?.name
        newColumns = [
            ...newColumns,
            {
                accessorFn: (row) => row?.metaAttributes?.[attributeName],
                header: attributeHeader ?? metaAttribute?.name,
                id: metaAttribute?.name,
                cell: (row) => <div className={styles.lightColor}>{row.getValue() as string}</div>,
            },
        ]
    })
    return newColumns ?? []
}
