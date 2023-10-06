import React, { SetStateAction, useState } from 'react'
import { Button, Input, PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { Group, StdHistory } from '@isdd/metais-common/api/generated/iam-swagger'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable, QueryFeedback } from '@isdd/metais-common/index'

import { GroupSelect } from './components/GroupSelect'

interface IMembershipHistoryView {
    membershipHistory: StdHistory[] | undefined
    columns: ColumnDef<StdHistory>[]
    selectedGroup: Group | undefined
    setSelectedGroup: React.Dispatch<SetStateAction<Group | undefined>>
    selectedDate: string | undefined
    setSelectedDate: React.Dispatch<SetStateAction<string | undefined>>
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
    const { t } = useTranslation()

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
                    <GroupSelect selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
                    <Input
                        type="date"
                        name="historyFilterDate"
                        label={`${t('groups.selectDate')}:`}
                        id="historyFilterDate"
                        value={selectedDate}
                        onChange={(val) => {
                            setSelectedDate(val.currentTarget.value)
                        }}
                    />
                    <Button label={t('groups.show')} className={'idsk-button'} type="submit" disabled={!selectedGroup || !selectedDate} />
                </form>
            </div>
            <ActionsOverTable entityName="" hiddenButtons={{ SELECT_COLUMNS: true }} handleFilterChange={handlePerPageChange} />
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
