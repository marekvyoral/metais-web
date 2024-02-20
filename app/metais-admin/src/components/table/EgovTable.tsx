import { ButtonLink, CheckBox, LoadingIndicator, PaginatorWrapper, Table, TextWarning } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import {
    AttributeProfile,
    AttributeProfilePreview,
    AttributeProfileType,
    CiTypePreview,
    useStoreUnValid,
    useStoreValid1,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, BulkPopup, CreateEntityButton } from '@isdd/metais-common/index'
import { QueryObserverResult } from '@tanstack/react-query'
import { ColumnDef, Row } from '@tanstack/react-table'
import { SetStateAction, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import styles from './egovTable.module.scss'

type IListData = {
    data?: AttributeProfile[] | undefined
    entityName?: string
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
    isFetching?: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}
interface IEgovTable {
    name?: string
    technicalName?: string
    type?: AttributeProfileType
    valid?: boolean
}

export const EgovTable = ({ data, entityName, refetch, isFetching, sort, setSort }: IListData) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const navigate = useNavigate()
    const location = useLocation()
    const [rowSelection, setRowSelection] = useState<Array<string>>([])

    const handleCheckboxChange = useCallback(
        (row: Row<IEgovTable>) => {
            if (row.original.technicalName) {
                if (rowSelection.includes(row.original.technicalName)) {
                    setRowSelection((prev) => prev.filter((tname) => tname !== row.original.technicalName))
                } else {
                    setRowSelection((prev) => [...prev, row.original.technicalName || ''])
                }
            }
        },
        [rowSelection, setRowSelection],
    )

    const [pageNumber, setPageNumber] = useState<number>(BASE_PAGE_NUMBER)
    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const handleAllCheckboxChange = () => {
        if (!data) return

        const checkedAll = data
            .slice(pageNumber * pageSize - pageSize - 1, pageNumber * pageSize)
            .filter((row) => row.type == AttributeProfileType.custom)
            .every((row) => row.type == AttributeProfileType.custom && rowSelection.includes(row.technicalName || ''))

        const customRows =
            data
                .slice(pageNumber * pageSize - pageSize - 1, pageNumber * pageSize)
                .filter((row) => row.type == AttributeProfileType.custom)
                .map((row) => row.technicalName || '') || []

        if (checkedAll) {
            setRowSelection((prev) => prev.filter((p) => !customRows.includes(p)))
            return
        }

        setRowSelection((prev) => [...prev, ...customRows])
    }
    const columns: Array<ColumnDef<CiTypePreview>> = [
        {
            header: () => {
                const checkedAll = data
                    ?.slice(pageNumber * pageSize - pageSize - 1, pageNumber * pageSize)
                    ?.filter((row) => row.type == AttributeProfileType.custom)
                    .every((row) => row.type == AttributeProfileType.custom && rowSelection.includes(row.technicalName || ''))

                return (
                    <>
                        {data
                            ?.slice(pageNumber * pageSize - pageSize - 1, pageNumber * pageSize)
                            .some((a) => a.type == AttributeProfileType.custom) ? (
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox
                                    label=""
                                    name="checkbox"
                                    id="checkbox-all"
                                    value="checkbox-all"
                                    onChange={() => handleAllCheckboxChange()}
                                    checked={checkedAll}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => {
                return (
                    <>
                        {row.original.type == AttributeProfileType.custom ? (
                            <div className="govuk-checkboxes govuk-checkboxes--small">
                                <CheckBox
                                    label=""
                                    name="checkbox"
                                    id={`checkbox_${row.id}`}
                                    value="true"
                                    onChange={() => {
                                        handleCheckboxChange(row)
                                    }}
                                    checked={row.original.technicalName ? !!rowSelection.includes(row.original.technicalName) : false}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                )
            },
        },
        {
            header: t('egov.name'),
            accessorFn: (row) => row?.name,
            size: 150,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link to={'./' + ctx?.row?.original?.technicalName} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
        },
        {
            header: t('egov.technicalName'),
            accessorFn: (row) => row?.technicalName,
            size: 200,
            enableSorting: true,
            id: 'technicalName',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.technicalName,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.technicalName}</span>,
        },
        {
            header: t('egov.type'),
            accessorFn: (row) => row?.type,
            enableSorting: true,
            id: 'type',
            cell: (ctx) => <span>{t(`tooltips.type.${ctx.row?.original?.type}`)}</span>,
        },
        {
            header: t('egov.state'),
            accessorFn: (row) => row?.valid,
            enableSorting: true,
            id: 'state',
            cell: (ctx) => <span className={classNames(!ctx.row?.original?.valid && styles.red)}>{t(`validity.${ctx.row?.original?.valid}`)}</span>,
        },
    ]
    const columnsWithPermissions = isUserLogged ? columns : columns.slice(1)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handlePageChange = (filter: IFilter) => {
        setPageNumber(filter?.pageNumber ?? 0)
    }

    const handlePerPageChange = (filter: IFilter | undefined) => {
        if (pageNumber * pageSize > (data?.length ?? 0)) {
            setPageNumber(1)
        }
        const newPageSize = Number(filter?.pageSize)
        setPageSize(newPageSize)
    }

    const [errorMessageUnvalid, setErrorMessageUnvalid] = useState(false)
    const [errorMessageValid, setErrorMessageValid] = useState(false)

    const { mutateAsync: setAttrUnvalid } = useStoreUnValid()
    const { mutateAsync: setAttrValid } = useStoreValid1()

    const invalidateItems = async () => {
        if (data?.some((colData) => rowSelection.includes(colData.technicalName || '') && !colData.valid)) {
            setErrorMessageUnvalid(true)
            setErrorMessageValid(false)
            return
        }
        setErrorMessageValid(false)
        setErrorMessageUnvalid(false)
        setIsLoading(true)
        await Promise.all(
            rowSelection.map(async (tname) => {
                await setAttrUnvalid({ technicalName: tname })
            }),
        )
        refetch?.()
        setIsLoading(false)
    }

    const validateItems = async () => {
        if (data?.some((colData) => rowSelection.includes(colData.technicalName || '') && colData.valid)) {
            setErrorMessageValid(true)
            setErrorMessageUnvalid(false)
            return
        }
        setErrorMessageValid(false)
        setErrorMessageUnvalid(false)
        setIsLoading(true)
        await Promise.all(
            rowSelection.map(async (tname) => {
                await setAttrValid({ technicalName: tname })
            }),
        )
        refetch?.()
        setIsLoading(false)
    }
    return (
        <div>
            {errorMessageUnvalid && <TextWarning>{t('tooltips.unvalidTextWarning')}</TextWarning>}
            {errorMessageValid && <TextWarning>{t('tooltips.validTextWarning')}</TextWarning>}

            <div style={{ position: 'relative' }}>
                {(isFetching || isLoading) && <LoadingIndicator />}
                <ActionsOverTable
                    pagination={{ pageSize, pageNumber, dataLength: data?.length || 0 }}
                    handleFilterChange={handlePerPageChange}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName={entityName ?? ''}
                    createButton={
                        <CreateEntityButton
                            label={t(`egov.addNew.${entityName}`)}
                            onClick={() => navigate(`/egov/${entityName}/create`, { state: { from: location } })}
                        />
                    }
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                    bulkPopup={
                        <BulkPopup
                            checkedRowItems={Object.keys(rowSelection).length}
                            items={(closePopup) => [
                                <ButtonLink
                                    key={'buttonBlock'}
                                    icon={CrossInACircleIcon}
                                    label={t('actionOverTable.invalidateItems')}
                                    onClick={() => {
                                        invalidateItems()
                                        closePopup()
                                    }}
                                />,
                                <ButtonLink
                                    key={'buttonUnblock'}
                                    icon={CheckInACircleIcon}
                                    label={t('actionOverTable.validateItems')}
                                    onClick={() => {
                                        validateItems()
                                        closePopup()
                                    }}
                                />,
                            ]}
                        />
                    }
                />
                <Table<IEgovTable>
                    data={data}
                    columns={columnsWithPermissions}
                    sort={sort}
                    onSortingChange={setSort}
                    manualSorting={false}
                    manualPagination={false}
                    pagination={{ pageIndex: pageNumber - 1, pageSize: pageSize }}
                />
            </div>
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={data?.length || 0} handlePageChange={handlePageChange} />
        </div>
    )
}
