import React, { SetStateAction, useState } from 'react'
import { Button, GridCol, GridRow, PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { StdHistory } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import { Languages } from '@isdd/metais-common/localization/languages'

import { GroupSelect } from './components/GroupSelect'
import styles from './styles.module.scss'

interface IMembershipHistoryView {
    membershipHistory: StdHistory[] | undefined
    columns: ColumnDef<StdHistory>[]
    selectedGroup: string
    setSelectedGroup: React.Dispatch<SetStateAction<string>>
    selectedDate: Date | undefined
    setSelectedDate: React.Dispatch<SetStateAction<Date | undefined>>
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
}

export const MembershipHistoryView: React.FC<IMembershipHistoryView> = ({
    membershipHistory,
    columns,
    selectedGroup,
    setSelectedGroup,
    selectedDate,
    setSelectedDate,
    handleSubmit,
    isLoading,
}) => {
    const { t, i18n } = useTranslation()

    const [pageSize, setPageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
        setStart((filter?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filter?.pageNumber ?? 0) * pageSize)
    }

    const handlePerPageChange = (filter: IFilter) => {
        setPageSize(filter.pageSize ?? 0)
        setStart((pageNumber ?? 0) * (filter?.pageSize ?? 0) - (filter?.pageSize ?? 0))
        setEnd((pageNumber ?? 0) * (filter?.pageSize ?? 0))
    }

    return (
        <>
            <div className="idsk-table-filter idsk-table-filter__panel">
                <form onSubmit={handleSubmit}>
                    <GroupSelect setSelectedGroup={setSelectedGroup} />
                    <GridRow>
                        <GridCol>
                            <label className="govuk-label" htmlFor="historyDatePicker">
                                {t('groups.selectDate')}
                            </label>
                            <DatePicker
                                id="historyDatePicker"
                                className={classNames('govuk-input', styles.rowItem)}
                                wrapperClassName={styles.fullWidth}
                                popperClassName={styles.zIndex}
                                placeholderText="dd.mm.yyyy"
                                selected={selectedDate}
                                onChange={(val) => {
                                    setSelectedDate(val ?? undefined)
                                }}
                                dateFormat="dd.MM.yyyy"
                                locale={i18n.language === Languages.SLOVAK ? Languages.SLOVAK : Languages.ENGLISH}
                            />
                        </GridCol>
                    </GridRow>
                    <div className={classNames(styles.displayFlex, styles.flexEnd, styles.marginTop)}>
                        <Button label={t('groups.show')} className={'idsk-button'} type="submit" disabled={!selectedGroup || !selectedDate} />
                    </div>
                </form>
            </div>
            <ActionsOverTable
                pagination={{ pageNumber, pageSize, dataLength: membershipHistory?.length ?? 0 }}
                entityName=""
                hiddenButtons={{ SELECT_COLUMNS: true }}
                handleFilterChange={handlePerPageChange}
            />
            <QueryFeedback loading={isLoading}>
                <Table<StdHistory> columns={columns} data={membershipHistory?.slice(start, end)} />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={membershipHistory?.length ?? 0}
                handlePageChange={handlePageChange}
            />
        </>
    )
}
