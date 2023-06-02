import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Paginator } from '../paginator/Paginator'
import { TextBody } from '../typography/TextBody'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'
import styles from '@/components/ci-table/table.module.scss'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks }) => {
    const { t } = useTranslation()
    const pageNumber = filterCallbacks.tableParams.pageNumber
    const pageSize = filterCallbacks.tableParams.pageSize
    const startData = pageNumber * pageSize - pageSize
    const dataLength = placeholderData.length

    const [min, setMin] = useState<number>(1)
    const [max, setMax] = useState<number>(pageSize)

    const handlePageChange = (page: number, from: number, to: number) => {
        filterCallbacks.setTableParams((prev) => ({
            ...prev,
            pageNumber: page,
        }))
        setMin(from + 1)
        setMax(to + 1 > dataLength ? dataLength : to + 1)
    }

    return (
        <>
            <Table columns={placeholderColumns} data={placeholderData.slice(startData, startData + pageSize)} />
            <div className={styles.paginationDiv}>
                <Paginator
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    dataLength={dataLength}
                    onPageChanged={(page, from, to) => handlePageChange(page, from, to)}
                />
                {/* need to add custom classnames... maybe change inside component?*/}
                <TextBody size="S">
                    {t('ciTable.showing')} {min} - {max} {t('ciTable.ofTotal')} {placeholderData.length} {t('ciTable.records')}
                </TextBody>
            </div>
        </>
    )
}
