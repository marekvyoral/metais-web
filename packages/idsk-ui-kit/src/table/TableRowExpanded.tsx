import { Row } from '@tanstack/react-table'
import React from 'react'

import styles from './table.module.scss'

interface ITableRowProps<T> {
    getExpandedRow?: (row: Row<T>) => JSX.Element | null
    row: Row<T>
    id: string
}

export const TableRowExpanded = <T,>({ row, id, getExpandedRow: getExpandedRow }: ITableRowProps<T>): JSX.Element => {
    return (
        <div id={id} className={styles.expandableRowContent}>
            {getExpandedRow?.(row)}
        </div>
    )
}
