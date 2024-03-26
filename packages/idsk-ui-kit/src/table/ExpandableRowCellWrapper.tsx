import React from 'react'
import { Row } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { RowOpenIcon, RowCloseIcon } from '@isdd/metais-common/assets/images'

import { TransparentButtonWrapper } from '@isdd/idsk-ui-kit/button/TransparentButtonWrapper'

interface ExpandableRowCellProps<T> {
    row: Row<T>
    ariaControlsId: string
}

export const ExpandableRowCellWrapper = <T,>({ row, ariaControlsId }: ExpandableRowCellProps<T>): JSX.Element => {
    const { t } = useTranslation()

    return (
        <TransparentButtonWrapper
            aria-label={row.getIsExpanded() ? t('table.expandableCloseItem') : t('table.expandableExpandItem')}
            aria-expanded={row.getIsExpanded()}
            aria-controls={ariaControlsId}
            onClick={row.getToggleExpandedHandler()}
        >
            {row.getIsExpanded() ? <img src={RowCloseIcon} alt="" /> : <img src={RowOpenIcon} alt="" />}
        </TransparentButtonWrapper>
    )
}
