import React, { PropsWithChildren } from 'react'
import { Row } from '@tanstack/react-table'

import { PaginatorRightArrowIcon } from '../assets/images'

interface ExpandableRowCellProps<T> extends PropsWithChildren {
    row: Row<T>
}

export const ExpandableRowCellWrapper = <T,>({ row, children }: ExpandableRowCellProps<T>): JSX.Element => {
    return (
        <div
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
            )}{' '}
            {children}
        </div>
    )
}
