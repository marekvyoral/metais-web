import React, { PropsWithChildren } from 'react'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import styles from './table.module.scss'

import { PaginatorRightArrowIcon } from '@isdd/idsk-ui-kit/assets/images'
interface ExpandableRowCellProps<T> extends PropsWithChildren {
    row: Row<T>
}

export const ExpandableRowCellWrapper = <T,>({ row, children }: ExpandableRowCellProps<T>): JSX.Element => {
    const { t } = useTranslation()

    return (
        <div
            className={styles.expandCheckboxCell}
            onClick={row.getToggleExpandedHandler()}
            style={{
                paddingLeft: `${row.depth * 2}rem`,
                display: 'flex',
                gap: 6,
            }}
        >
            {row.getCanExpand() && (
                <div>
                    <img
                        src={PaginatorRightArrowIcon}
                        style={{
                            cursor: 'pointer',
                            transform: row.getIsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)',
                            width: '1.1rem',
                            height: '1.1rem',
                        }}
                        alt={row.getIsExpanded() ? t('table.expandableCloseItem') : t('table.expandableExpandItem')}
                    />
                </div>
            )}
            <div className={styles.height40}>{children}</div>
        </div>
    )
}
