import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DotsIcon, PaginatorEndArrowIcon, PaginatorLeftArrowIcon, PaginatorRightArrowIcon, PaginatorStartArrowIcon } from '../assets/images'

import styles from './paginator.module.scss'
import { computePageModel } from './paginatorModel'

import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Pagination } from '@isdd/idsk-ui-kit/types'

type PaginatorProps = {
    pagination: Pagination
    onPageChanged: (pageNumber: number) => void
}

/**
 * Component for showing paginator.
 *
 * @param pageNumber starts from 1 to Math.ceil(dataLength / pageSize)
 */
export const Paginator: React.FC<PaginatorProps> = ({ pagination, onPageChanged }) => {
    const { t } = useTranslation()
    const { pageNumber, pageSize, dataLength } = pagination
    const totalPageCount = Math.ceil(dataLength / pageSize)
    const pages = useMemo(() => {
        return computePageModel(totalPageCount, pageNumber)
    }, [pageNumber, totalPageCount])

    const selectPage = (page: number) => {
        if (page < 1 || page > totalPageCount) {
            return
        }
        onPageChanged(page)
    }

    const jumpToFirstPage = () => selectPage(1)
    const jumpToNextPage = () => selectPage(pageNumber + 1)
    const jumpToPreviousPage = () => selectPage(pageNumber - 1)
    const jumpToLastPage = () => selectPage(totalPageCount)
    const hidePaginator = totalPageCount < 2

    return (
        <nav className={classNames(styles.pagination, { hidden: hidePaginator })} role="navigation" aria-label={t('table.pagination')}>
            <Button
                variant="secondary"
                label={<img src={PaginatorStartArrowIcon} alt="start-icon" />}
                onClick={jumpToFirstPage}
                disabled={pageNumber === 1}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorLeftArrowIcon} alt="prev-icon" />}
                onClick={jumpToPreviousPage}
                className={styles.paginatorStepButton}
                disabled={pageNumber === 1}
            />
            <Button onClick={jumpToFirstPage} className={classNames({ [styles.selectedButton]: pageNumber === 1 })} variant="secondary" label={1} />
            {pages.leftDots && <img src={DotsIcon} alt="dots" className={styles.paginatorItem} />}
            {pages.range.map((page) => (
                <Button
                    key={page}
                    variant="secondary"
                    label={page}
                    onClick={() => selectPage(page)}
                    className={classNames({ [styles.selectedButton]: pageNumber === page })}
                />
            ))}
            {pages.rightDots && <img src={DotsIcon} alt="dots" className={styles.paginatorItem} />}
            <Button
                onClick={jumpToLastPage}
                className={classNames({ [styles.selectedButton]: pageNumber === totalPageCount })}
                variant="secondary"
                label={totalPageCount}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorRightArrowIcon} alt="next-icon" />}
                onClick={jumpToNextPage}
                className={styles.paginatorStepButton}
                disabled={pageNumber === totalPageCount}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorEndArrowIcon} alt="end-icon" />}
                onClick={jumpToLastPage}
                disabled={pageNumber === totalPageCount}
            />
        </nav>
    )
}
