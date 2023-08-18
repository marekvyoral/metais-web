import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_SIZE, CiTypePreview } from '@isdd/metais-common/api'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { BulkPopup, CreateEntityButton, ExportButton } from '@isdd/metais-common/components/actions-over-table'
import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { ChangeIcon, CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { IColumnSectionType } from '@isdd/idsk-ui-kit/table-select-columns/TableSelectColumns'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'

type IListData = {
    data?: CiTypePreview[] | undefined
    entityName?: string
}

export const EgovTable = ({ data, entityName }: IListData) => {
    const { t } = useTranslation()
    const dataLength = data?.length ?? 0
    const navigate = useNavigate()
    const location = useLocation()
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
            cell: (ctx) => <span>{t(`validity.${ctx.row?.original?.valid}`)}</span>,
        },
    ]

    const [pageSize, setPageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
        setStart((filter?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filter?.pageNumber ?? 0) * pageSize)
    }

    const handleSetPageSize = (filter: IFilter) => {
        setPageSize(filter?.pageSize ?? BASE_PAGE_SIZE)
        setStart((pageNumber ?? 0) * (filter?.pageSize ?? 0) - (filter?.pageSize ?? 0))
        setEnd((pageNumber ?? 0) * (filter?.pageSize ?? 0))
    }

    const metaAttributesColumnSection: IColumnSectionType = {
        name: 'Metainformácie položky',
        attributes: [
            {
                name: t('egov.name'),
                technicalName: 'name',
            },
            {
                name: t('egov.technicalName'),
                technicalName: 'technicalName',
            },
            {
                name: t('egov.type'),
                technicalName: 'type',
            },
            {
                name: t('egov.state'),
                technicalName: 'state',
            },
        ],
    }

    return (
        <div>
            <ActionsOverTable
                handleFilterChange={handleSetPageSize}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={entityName ?? ''}
                createButton={<CreateEntityButton onClick={() => navigate(`/egov/${entityName}/create`, { state: { from: location } })} />}
                exportButton={<ExportButton />}
                metaAttributesColumnSection={metaAttributesColumnSection}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={0}
                        items={[
                            <ButtonLink key={'testItem1'} icon={CrossInACircleIcon} label={t('actionOverTable.invalidateItems')} />,
                            <ButtonLink key={'testItem2'} icon={CheckInACircleIcon} label={t('actionOverTable.validateItems')} />,
                            <ButtonLink key={'testItem3'} icon={ChangeIcon} label={t('actionOverTable.changeOwner')} />,
                        ]}
                    />
                }
            />
            <Table
                rowHref={(row) => `./${row.original.technicalName}`}
                data={data?.slice(start, end)}
                columns={columns}
                pagination={{ pageIndex: pageNumber, pageSize }}
            />
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={dataLength} handlePageChange={handlePageChange} />
        </div>
    )
}
