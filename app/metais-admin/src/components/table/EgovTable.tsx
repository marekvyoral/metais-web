import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { CiTypePreview } from '@isdd/metais-common/api'

type IListData = {
    data?: CiTypePreview[] | undefined
}

export const EgovTable = ({ data }: IListData) => {
    const { t } = useTranslation()
    const dataLength = data?.length ?? 0

    const columns: Array<ColumnDef<CiTypePreview>> = [
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            cell: (ctx) => <Link to={'./' + ctx?.row?.original?.technicalName}>{ctx?.getValue?.() as string}</Link>,
        },
        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.technicalName,
            enableSorting: true,
            id: 'technicalName',
            cell: (ctx) => <span>{ctx?.row?.original?.technicalName}</span>,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            id: 'type',
            cell: (ctx) => <span>{t(`type.${ctx.row?.original?.type}`)}</span>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => <span>{t(`state.${ctx.row?.original?.valid}`)}</span>,
        },
    ]

    const [pageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
        setStart((filter?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filter?.pageNumber ?? 0) * pageSize)
    }

    return (
        <div>
            <Table data={data?.slice(start, end)} columns={columns} />
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={dataLength} handlePageChange={handlePageChange} />
        </div>
    )
}
