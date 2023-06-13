import React from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'

import styles from './paginatorWrapper.module.scss'

interface IPaginatorWrapper {
    paginator: {
        pageNumber: number
        pageSize: number
        dataLength: number
        handlePageChange: (page: number, from: number, to: number) => void
    }
    text: {
        start: number
        end: number
        total: number
    }
}

export const PaginatorWrapper: React.FC<IPaginatorWrapper> = ({ paginator, text }) => {
    const { t } = useTranslation()
    return (
        <div className={styles.paginationDiv}>
            <Paginator
                pageNumber={paginator.pageNumber}
                pageSize={paginator.pageSize}
                dataLength={paginator.dataLength}
                onPageChanged={(page, from, to) => paginator.handlePageChange(page, from, to)}
            />
            <p className={classnames('govuk-body-s', styles.text)}>
                {t('table.paginationSummary', {
                    start: text.start,
                    end: text.end,
                    total: text.total,
                })}
            </p>
        </div>
    )
}
