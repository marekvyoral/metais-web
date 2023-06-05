import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Paginator } from '../paginator/Paginator'
import { TextBody } from '../typography/TextBody'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'
import styles from '@/components/ci-table/table.module.scss'
import { IListQueryArgs } from '@/api/TableApi'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: IListQueryArgs
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks, filter }) => {
    const { t } = useTranslation()

    const pageNumber = filter.pageNumber
    const pageSize = filter.pageSize
    const startData = pageNumber * pageSize - pageSize
    const dataLength = placeholderData.length

    const [start, setStart] = useState<number>(1)
    const [end, setEnd] = useState<number>(pageSize)

    const handlePageChange = (page: number, from: number, to: number) => {
        filterCallbacks.setListQueryArgs((prev) => ({
            ...prev,
            pageNumber: page,
        }))
        setStart(from + 1)
        setEnd(to + 1 > dataLength ? dataLength : to + 1)
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
                <div style={{ textAlign: 'right' }}>
                    <TextBody size="S">
                        {t('table.paginationSummary', {
                            start,
                            end,
                            total: placeholderData.length,
                        })}
                    </TextBody>
                </div>
            </div>
        </>
    )
}
