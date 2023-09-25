import { ButtonLink } from '@isdd/idsk-ui-kit/button-link/ButtonLink'
import { LoadingIndicator } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_SIZE, EkoCodeEkoCodeState, EkoCodeList } from '@isdd/metais-common/api'
import { CheckInACircleIcon, CrossInACircleIcon } from '@isdd/metais-common/assets/images'
import { BulkPopup, CreateEntityButton } from '@isdd/metais-common/components/actions-over-table'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { BASE_PAGE_NUMBER, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { EkoTableModals } from './EkoTablesModals'

import { IListData, IRowSelectionState, TEkoCodeDecorated } from '@/components/views/eko/ekoCodes'
import { IResultApiCall, getTableColumns, reduceTableDataToObject } from '@/components/views/eko/ekoHelpers'
import { IFilterData } from '@/components/containers/Eko/EkoListContainer'

export interface IEkoTableProps extends IListData {
    defaultFilterParams: IFilterData
    rowSelectionState: IRowSelectionState
    handleFilterChange: (filter: IFilter) => void
    invalidateCodes: (ekoCodes: EkoCodeList) => Promise<void>
    deleteCodes: (ekoCodes: EkoCodeList) => Promise<void>
}

export const EkoTable: React.FC<IEkoTableProps> = ({
    data,
    entityName,
    rowSelectionState,
    invalidateCodes,
    deleteCodes,
    defaultFilterParams,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const dataLength = data?.length ?? 0
    const { rowSelection, setRowSelection } = rowSelectionState
    const checkedRowItems = Object.keys(rowSelection).length
    const checkedToInvalidate = Object.values(rowSelection)?.filter((row) => row.ekoCodeState === EkoCodeEkoCodeState.ACTIVE)
    const checkedToDelete = Object.values(rowSelection)?.filter((row) => row.ekoCodeState === EkoCodeEkoCodeState.INVALIDATED)
    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = useState<boolean>(false)
    const [isOpenDeleteConfirmationModal, setIsOpenDeleteConfirmationModal] = useState<boolean>(false)
    const [resultApiCall, setResultApiCall] = useState<IResultApiCall>({
        isError: false,
        isSuccess: false,
        message: undefined,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCheckboxChange = useCallback(
        (row: Row<TEkoCodeDecorated>) => {
            if (row?.original?.ekoCode) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row?.original?.ekoCode]) {
                    delete newRowSelection[row?.original?.ekoCode]
                } else {
                    newRowSelection[row?.original?.ekoCode] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection, setRowSelection],
    )

    const handleAllCheckboxChange = useCallback(
        (rows: TEkoCodeDecorated[]) => {
            const checked = rows.every(({ ekoCode }) => (ekoCode ? !!rowSelection[ekoCode] : false))
            const newRowSelection = { ...rowSelection }
            if (checked) {
                rows.forEach(({ ekoCode }) => ekoCode && delete newRowSelection[ekoCode])
                setRowSelection(newRowSelection)
            } else {
                setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...reduceTableDataToObject(rows) }))
            }
        },
        [rowSelection, setRowSelection],
    )

    const isRowSelected = useCallback(
        (row: Row<TEkoCodeDecorated>) => {
            return row?.original?.ekoCode ? !!rowSelection[row?.original?.ekoCode] : false
        },
        [rowSelection],
    )

    const columns: Array<ColumnDef<TEkoCodeDecorated>> = useMemo(() => {
        return getTableColumns(rowSelection, handleAllCheckboxChange, data, handleCheckboxChange, t)
    }, [data, handleAllCheckboxChange, handleCheckboxChange, rowSelection, t])
    const columnsWithPermissions = isUserLogged ? columns : columns.slice(1)

    const handlerSetIsLoading = useCallback((loading: boolean) => setIsLoading(loading), [setIsLoading])
    const handlerSetCloseDeleteModal = useCallback(() => setIsOpenDeleteConfirmationModal(false), [])
    const handlerSetCloseConfirmationModal = useCallback(() => setIsOpenConfirmationModal(false), [])
    const handlerSetResultApiCall = useCallback((call: IResultApiCall) => {
        setResultApiCall(call)
    }, [])

    const getSlicedData = useCallback((d: TEkoCodeDecorated[], pageSize: number, pageNumber: number) => {
        if (d.length < pageSize) return d.slice(0, d.length)
        return d.slice(pageSize * (pageNumber ?? 0) - (pageSize ?? 0), pageSize * (pageNumber ?? 0)) ?? []
    }, [])

    return (
        <>
            {isLoading && <LoadingIndicator fullscreen />}
            <ActionsOverTable
                handleFilterChange={handleFilterChange}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName={entityName ?? ''}
                createButton={<CreateEntityButton onClick={() => navigate(`/${entityName}/create`)} label={t('eko.createdCode')} />}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={checkedRowItems}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'invalidateCodes'}
                                icon={CrossInACircleIcon}
                                label={t('eko.invalidateCodes') + (checkedToInvalidate?.length ? ` (${checkedToInvalidate.length})` : '')}
                                onClick={() => {
                                    setIsOpenConfirmationModal(true)
                                    closePopup()
                                }}
                                disabled={checkedToInvalidate.length === 0}
                            />,
                            <ButtonLink
                                key={'deleteCodes'}
                                icon={CheckInACircleIcon}
                                label={t('eko.deleteCodes') + (checkedToDelete?.length ? ` (${checkedToDelete.length})` : '')}
                                onClick={() => {
                                    setIsOpenDeleteConfirmationModal(true)
                                    closePopup()
                                }}
                                disabled={checkedToDelete.length === 0}
                            />,
                        ]}
                    />
                }
            />
            {(resultApiCall.isError || resultApiCall.isSuccess) && (
                <MutationFeedback error={resultApiCall.message} success={resultApiCall.isSuccess} />
            )}

            <Table
                key={'ekoTable'}
                data={getSlicedData(data, defaultFilterParams?.pageSize ?? 0, defaultFilterParams?.pageNumber ?? 0) ?? []}
                sort={[
                    {
                        orderBy: defaultFilterParams.sortAttribute,
                        sortDirection: defaultFilterParams.ascending === 'true' ? SortType.ASC : SortType.DESC,
                    },
                ]}
                columns={columnsWithPermissions}
                pagination={{
                    pageIndex: (defaultFilterParams.pageNumber ?? BASE_PAGE_NUMBER) - 1,
                    pageSize: defaultFilterParams.pageSize ?? BASE_PAGE_SIZE,
                }}
                isRowSelected={isRowSelected}
                onSortingChange={(columnSort) => {
                    handleFilterChange({
                        pageNumber: BASE_PAGE_NUMBER,
                        sortAttribute: columnSort.length && columnSort[0].orderBy,
                        ascending: columnSort.length && columnSort[0].sortDirection === SortType.ASC ? 'true' : 'false',
                        pageSize: BASE_PAGE_SIZE,
                    })
                }}
            />
            <PaginatorWrapper
                pageNumber={defaultFilterParams.pageNumber ?? BASE_PAGE_NUMBER}
                pageSize={defaultFilterParams.pageSize ?? BASE_PAGE_SIZE}
                dataLength={dataLength}
                handlePageChange={handleFilterChange}
            />
            <EkoTableModals
                checkedToInvalidate={checkedToInvalidate}
                checkedToDelete={checkedToDelete}
                closeConfirmationModal={handlerSetCloseConfirmationModal}
                closeDeleteModal={handlerSetCloseDeleteModal}
                isOpenConfirmationModal={isOpenConfirmationModal}
                isOpenDeleteConfirmationModal={isOpenDeleteConfirmationModal}
                invalidateCodes={invalidateCodes}
                deleteCodes={deleteCodes}
                setLoading={handlerSetIsLoading}
                setResultApiCall={handlerSetResultApiCall}
            />
        </>
    )
}
