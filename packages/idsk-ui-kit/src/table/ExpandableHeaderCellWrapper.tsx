import React, { PropsWithChildren } from 'react'
import { Table } from '@tanstack/react-table'

import styles from './table.module.scss'

import { PaginatorRightArrowIcon } from '@isdd/idsk-ui-kit/assets/images'

interface ExpandableHeaderCellProps<T> extends PropsWithChildren {
    table: Table<T>
}

export const ExpandableHeaderCellWrapper = <T,>({ table, children }: ExpandableHeaderCellProps<T>): JSX.Element => {
    return (
        <div className={styles.expandCheckboxCell}>
            {table.getCanSomeRowsExpand() && (
                <img
                    src={PaginatorRightArrowIcon}
                    onClick={table.getToggleAllRowsExpandedHandler()}
                    style={{ cursor: 'pointer', transform: table.getIsAllRowsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
            )}
            <div className={styles.height40}>{children}</div>
        </div>
    )
}
