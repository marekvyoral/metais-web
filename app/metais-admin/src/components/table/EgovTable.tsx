import { ButtonLink, CheckBox, LoadingIndicator, PaginatorWrapper, Table, TextWarning } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import {
    AttributeProfile,
    AttributeProfilePreview,
    AttributeProfileType,
    BASE_PAGE_SIZE,
    CiTypePreview,
    useStoreUnValid,
    useStoreValid1,
} from '@isdd/metais-common/api'
import { CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BulkPopup, CreateEntityButton } from '@isdd/metais-common/index'
import { QueryObserverResult } from '@tanstack/react-query'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import classNames from 'classnames'

import styles from './egovTable.module.scss'

type IListData = {
    data?: AttributeProfile[] | undefined
    entityName?: string
    refetch?: () => Promise<QueryObserverResult<AttributeProfilePreview, unknown>>
    isFetching?: boolean
}
interface IEgovTable {
    name?: string
    technicalName?: string
    type?: AttributeProfileType
    valid?: boolean
}

export const EgovTable = ({ data, entityName, refetch, isFetching }: IListData) => {
    const { t } = useTranslation()

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

    const handleAllCheckboxChange = () => {
        if (!data) return
        const checkedAll = data
            .filter((row) => row.type == AttributeProfileType.custom)
            .every((row) => row.type == AttributeProfileType.custom && rowSelection.includes(row.technicalName || ''))

        if (checkedAll) {
            setRowSelection([])
            return
        }
        const customRows = data.filter((row) => row.type == AttributeProfileType.custom).map((row) => row.technicalName || '') || []
        setRowSelection(customRows)
    }
    const columns: Array<ColumnDef<CiTypePreview>> = [
        {
            header: () => {
                const checkedAll = data
                    ?.filter((row) => row.type == AttributeProfileType.custom)
                    .every((row) => row.type == AttributeProfileType.custom && rowSelection.includes(row.technicalName || ''))

                return (
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
                                    //containerClassName={styles.marginBottom15}
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
            enableSorting: true,
            id: 'name',
            cell: (ctx) => (
                <Link to={'./' + ctx?.row?.original?.technicalName} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
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
            cell: (ctx) => <span className={classNames(!ctx.row?.original?.valid && styles.red)}>{t(`validity.${ctx.row?.original?.valid}`)}</span>,
        },
    ]

    const [pageSize, setPageSize] = useState<number>(10)
    const [start, setStart] = useState<number>(0)
    const [end, setEnd] = useState<number>(pageSize)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handlePageChange = (filterPage: IFilter) => {
        setPageNumber(filterPage?.pageNumber ?? 0)
        setStart((filterPage?.pageNumber ?? 0) * pageSize - pageSize)
        setEnd((filterPage?.pageNumber ?? 0) * pageSize)
    }

    const handleSetPageSize = (filterPage: IFilter) => {
        setPageSize(filterPage?.pageSize ?? BASE_PAGE_SIZE)
        setStart((pageNumber ?? 0) * (filterPage?.pageSize ?? 0) - (filterPage?.pageSize ?? 0))
        setEnd((pageNumber ?? 0) * (filterPage?.pageSize ?? 0))
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
                    handleFilterChange={handleSetPageSize}
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
                            checkedRowItems={0}
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
                <Table data={data?.slice(start, end)} columns={columns} pagination={{ pageIndex: pageNumber, pageSize }} />
            </div>
            <PaginatorWrapper pageNumber={pageNumber} pageSize={pageSize} dataLength={data?.length || 0} handlePageChange={handlePageChange} />
        </div>
    )
}
