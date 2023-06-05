import classNames from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './paginator.module.scss'
import { computePageModel } from './paginatorModel'
import { Button } from '../button/Button'
import {
    DotsIcon,
    PaginatorEndArrowIcon,
    PaginatorLeftArrowIcon,
    PaginatorRightArrowIcon,
    PaginatorStartArrowIcon,
} from '../../../app/metais-portal/src/assets/images'

type PaginatorProps = {
    pageNumber: number
    dataLength: number
    onPageChanged: (page: number, from: number, to: number) => void
    pageSize: number
}

/**
 * Component for showing paginator.
 *
 * @param pageNumber starts from 1 to Math.ceil(dataLength / pageSize)
 */
export const Paginator: React.FC<PaginatorProps> = ({ pageNumber, dataLength, onPageChanged, pageSize }) => {
    const { t } = useTranslation()
    const totalPageCount = Math.ceil(dataLength / pageSize)

    const pages = useMemo(() => {
        return computePageModel(totalPageCount, pageNumber)
    }, [pageNumber, totalPageCount])

    const selectPage = (page: number) => {
        if (page < 1 || page > totalPageCount) {
            return
        }
        const dataFrom = (page - 1) * pageSize
        const dataTo = page * pageSize - 1
        onPageChanged(page, dataFrom, dataTo)
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
