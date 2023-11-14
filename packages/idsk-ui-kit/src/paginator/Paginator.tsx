import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DotsIcon, PaginatorEndArrowIcon, PaginatorLeftArrowIcon, PaginatorRightArrowIcon, PaginatorStartArrowIcon } from '../assets/images'

import styles from './paginator.module.scss'
import { computePageModel } from './paginatorModel'

import { Button } from '@isdd/idsk-ui-kit/button/Button'

type PaginatorProps = {
    pageNumber: number
    pageSize: number
    dataLength: number
    onPageChanged: (pageNumber: number) => void
}

/**
 * Component for showing paginator.
 *
 * @param pageNumber starts from 1 to Math.ceil(dataLength / pageSize)
 */
export const Paginator: React.FC<PaginatorProps> = ({ pageNumber, pageSize, dataLength, onPageChanged }) => {
    const { t } = useTranslation()
    const pageNumberInt = Number(pageNumber)
    const pageSizeInt = Number(pageSize)

    const totalPageCount = Math.ceil(dataLength / pageSizeInt)

    const pages = useMemo(() => {
        return computePageModel(totalPageCount, pageNumberInt)
    }, [pageNumberInt, totalPageCount])

    const selectPage = (page: number) => {
        if (page < 1 || page > totalPageCount) {
            return
        }
        onPageChanged(page)
    }

    const jumpToFirstPage = () => selectPage(1)
    const jumpToNextPage = () => selectPage(pageNumberInt + 1)
    const jumpToPreviousPage = () => selectPage(pageNumberInt - 1)
    const jumpToLastPage = () => selectPage(totalPageCount)
    const hidePaginator = totalPageCount < 2

    return (
        <nav
            className={classNames(styles.pagination, { [styles.hidden]: hidePaginator })}
            role="navigation"
            aria-label={t('table.pagination') ?? undefined}
        >
            <Button
                variant="secondary"
                label={<img src={PaginatorStartArrowIcon} alt="start-icon" />}
                onClick={jumpToFirstPage}
                disabled={pageNumberInt === 1}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorLeftArrowIcon} alt="prev-icon" />}
                onClick={jumpToPreviousPage}
                className={styles.paginatorStepButton}
                disabled={pageNumberInt === 1}
            />
            <Button
                onClick={jumpToFirstPage}
                className={classNames({ [styles.selectedButton]: pageNumberInt === 1 })}
                variant="secondary"
                label={1}
            />
            {pages.leftDots && <img src={DotsIcon} alt="dots" className={styles.paginatorItem} />}
            {pages.range.map((page) => (
                <Button
                    key={page}
                    variant="secondary"
                    label={page}
                    onClick={() => selectPage(page)}
                    className={classNames({ [styles.selectedButton]: pageNumberInt === page })}
                />
            ))}
            {pages.rightDots && <img src={DotsIcon} alt="dots" className={styles.paginatorItem} />}
            <Button
                onClick={jumpToLastPage}
                className={classNames({ [styles.selectedButton]: pageNumberInt === totalPageCount })}
                variant="secondary"
                label={totalPageCount}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorRightArrowIcon} alt="next-icon" />}
                onClick={jumpToNextPage}
                className={styles.paginatorStepButton}
                disabled={pageNumberInt === totalPageCount}
            />
            <Button
                variant="secondary"
                label={<img src={PaginatorEndArrowIcon} alt="end-icon" />}
                onClick={jumpToLastPage}
                disabled={pageNumberInt === totalPageCount}
            />
        </nav>
    )
}
