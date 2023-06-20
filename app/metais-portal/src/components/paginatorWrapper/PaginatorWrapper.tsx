import React from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { Pagination } from '@isdd/idsk-ui-kit/types'

import styles from './paginatorWrapper.module.scss'

import { IFilter } from '@/types/filter'

interface IPaginatorWrapper {
    pagination: Pagination
    handlePageChange: (filter: IFilter) => void
}

export const PaginatorWrapper: React.FC<IPaginatorWrapper> = ({ pagination, handlePageChange }) => {
    const { t } = useTranslation()
    const { pageNumber, pageSize, dataLength } = pagination
    const start = (pageNumber - 1) * pageSize
    const end = pageNumber * pageSize < dataLength ? pageNumber * pageSize : dataLength

    return (
        <div className={styles.paginationDiv}>
            <Paginator pagination={pagination} onPageChanged={(page) => handlePageChange({ pageNumber: page })} />
            <p className={classnames('govuk-body-s', styles.text)}>
                {t('table.paginationSummary', {
                    start,
                    end,
                    total: dataLength,
                })}
            </p>
        </div>
    )
}
