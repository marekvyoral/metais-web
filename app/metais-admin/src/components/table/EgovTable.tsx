import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/metais-common/paginatorWrapper/PaginatorWrapper'

import { CiTypePreview } from '@/api'

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
            cell: (ctx) => <Link to={'./' + ctx?.row?.original?.technicalName}>{ctx?.getValue?.() as string}</Link>,
        },
        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.technicalName,
            enableSorting: true,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            cell: (ctx) => <>{t(`type.${ctx.row?.original?.type}`)}</>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            cell: (ctx) => <>{t(`state.${ctx.row?.original?.valid}`)}</>,
        },
    ]

    const [pageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const handlePageChange = (page: number, from: number, to: number) => {
        setPageNumber(page)
        setStart(from)
        setEnd(to + 1 > dataLength ? dataLength : to + 1)
    }

    return (
        <div>
            <Table data={data?.slice(start, end)} columns={columns} />
            <PaginatorWrapper paginator={{ pageNumber, pageSize, dataLength, handlePageChange }} text={{ start, end, total: dataLength }} />
        </div>
    )
}
