import React, { PropsWithChildren } from 'react'
import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

import styles from './table.module.scss'

import { PaginatorRightArrowIcon } from '@isdd/idsk-ui-kit/assets/images'
import { TransparentButtonWrapper } from '@isdd/idsk-ui-kit/button/TransparentButtonWrapper'

interface ExpandableHeaderCellProps<T> extends PropsWithChildren {
    table: Table<T>
}

export const ExpandableHeaderCellWrapper = <T,>({ table, children }: ExpandableHeaderCellProps<T>): JSX.Element => {
    const { t } = useTranslation()
    return (
        <div className={styles.expandCheckboxCell}>
            {table.getCanSomeRowsExpand() && (
                <TransparentButtonWrapper
                    onClick={() => table.getToggleAllRowsExpandedHandler()}
                    aria-label={table.getIsAllRowsExpanded() ? t('table.expandableCloseItem') : t('table.expandableExpandItem')}
                >
                    <img
                        src={PaginatorRightArrowIcon}
                        style={{ cursor: 'pointer', transform: table.getIsAllRowsExpanded() ? 'rotate(90deg)' : 'rotate(0deg)' }}
                        alt=""
                    />
                </TransparentButtonWrapper>
            )}
            <div className={styles.height40}>{children}</div>
        </div>
    )
}
