import React from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import styles from './paginatorWrapper.module.scss'

interface IPaginatorWrapper {
    pageNumber: number
    pageSize: number
    dataLength: number
    handlePageChange: (filter: IFilter) => void
}

export const PaginatorWrapper: React.FC<IPaginatorWrapper> = ({ pageNumber, pageSize, dataLength, handlePageChange }) => {
    const { t } = useTranslation()
    const start = (pageNumber - 1) * pageSize
    const end = pageNumber * pageSize < dataLength ? pageNumber * pageSize : dataLength

    return (
        <div className={styles.paginationDiv}>
            <Paginator
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={dataLength}
                onPageChanged={(page) => handlePageChange({ pageNumber: page })}
            />
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
