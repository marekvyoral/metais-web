import React, { PropsWithChildren } from 'react'
import { Row } from '@tanstack/react-table'

import styles from './table.module.scss'

import { PaginatorRightArrowIcon } from '@isdd/idsk-ui-kit/assets/images'
interface ExpandableRowCellProps<T> extends PropsWithChildren {
    row: Row<T>
}

export const ExpandableRowCellWrapper = <T,>({ row, children }: ExpandableRowCellProps<T>): JSX.Element => {
    return (
        <div
            className={styles.expandCheckboxCell}
            style={{
                paddingLeft: `${row.depth * 2}rem`,
            }}
        >
            {row.getCanExpand() && (
                <img
                    src={PaginatorRightArrowIcon}
                    onClick={row.getToggleExpandedHandler()}
                    style={{ cursor: 'pointer', transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
            )}
            <div className={styles.height40}>{children}</div>
        </div>
    )
}
