import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink, CheckBox, ConfirmationModal, PaginatorWrapper, Table } from '@isdd/idsk-ui-kit'
import { ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import { SortType } from '@isdd/idsk-ui-kit/src/types'
import classNames from 'classnames'
import { Link, useLocation, Location } from 'react-router-dom'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/src/table/constants'
import { useQueryClient } from '@tanstack/react-query'

import styles from './favoritesNotifications.module.scss'

import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { useRemoveFavorite } from '@isdd/metais-common/components/views/user-profile/user-notifications/hooks/useRemoveFavorite'
import {
    FollowedItem,
    FollowedItemItemType,
    FollowedItemList,
    getGetFollowedItemsQueryKey,
    useGetFollowedItems,
    useUpdateFollowedItem,
} from '@isdd/metais-common/api/generated/user-config-swagger'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BulkPopup } from '@isdd/metais-common/components/actions-over-table'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ConfigurationItemSetUi, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'

const reduceTableDataToObject = <T extends { id?: number }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.id) {
            result[item.id] = item
        }
        return result
    }, {})
}

const getLink = (item: FollowedItem, location: Location, ciList: ConfigurationItemSetUi) => {
    let to = ''
    if (item.itemType === FollowedItemItemType.CI) {
        const ciItem = ciList.configurationItemSet?.find((ci) => ci.uuid === item.itemId)
        to = `/ci/${ciItem?.type}/${item.itemId}`
    }
    if (item.itemType === FollowedItemItemType.CODELIST) {
        to = `${NavigationSubRoutes.CODELIST}/${item.itemId}`
    }
    if (item.itemType === FollowedItemItemType.REFID) {
        to = `${NavigationSubRoutes.REF_IDENTIFIERS}/${item.itemId}`
    }
    if (item.itemType === FollowedItemItemType.REF_REGISTER) {
        to = `${NavigationSubRoutes.REFERENCE_REGISTRE}/${item.itemId}`
    }

    return (
        <Link to={to} state={{ from: location }}>
            {item.name}
        </Link>
    )
}

const getTypeIds = (data: FollowedItemList, type: FollowedItemItemType) => {
    return data?.items?.filter((item) => item.itemType === type).map((item) => item.itemId ?? '') ?? []
}

export const UserFavoritesNotifications = () => {
    const location = useLocation()
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    const [pagination, setPagination] = useState({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        order: 'name',
        ascending: false,
    })
    const [removeConfirmData, setRemoveConfirmData] = useState<{ isOpen: boolean; removeId?: number[] }>({
        isOpen: false,
        removeId: undefined,
    })

    const {
        data: listData,
        isLoading: isLoadingList,
        isError: isErrorList,
        refetch,
        isRefetching,
    } = useGetFollowedItems(
        { page: pagination.pageNumber ?? BASE_PAGE_NUMBER, perPage: pagination.pageSize, orderBy: pagination.order, ascending: pagination.ascending },
        { query: { enabled: true } },
    )

    const ciIds = getTypeIds(listData ?? {}, FollowedItemItemType.CI)
    const {
        data: ciListData,
        isFetching: isLoadingCiListData,
        isError: isErrorCiListData,
    } = useReadCiList1({ filter: { uuid: ciIds }, perpage: 999, page: 1 }, { query: { enabled: ciIds.length > 0 } })

    const {
        mutate: updateMutation,
        isLoading: isLoadingUpdateMutation,
        isError: isErrorUpdateMutation,
        isSuccess: isSuccessUpdate,
        reset: resetUpdateState,
    } = useUpdateFollowedItem()
    const {
        removeFavorite,
        removedCount,
        resetState: resetRemoveState,
        isLoading: isLoadingRemove,
        isSuccess: isSuccessRemove,
        isError: isErrorRemove,
    } = useRemoveFavorite()

    const handleCheckboxChange = ({ isPortalChecked, isEmailChecked, id }: { id?: number; isPortalChecked?: boolean; isEmailChecked?: boolean }) => {
        resetRemoveState()
        resetUpdateState()

        if (!id) {
            return
        }

        const updatedItem = {
            ...listData?.items?.find((item) => item.id === id),
            ...(isPortalChecked !== undefined ? { portal: isPortalChecked } : null),
            ...(isEmailChecked !== undefined ? { email: isEmailChecked } : null),
        }

        updateMutation(
            {
                id,
                data: updatedItem,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries([getGetFollowedItemsQueryKey({})[0]])
                },
            },
        )
    }

    const handleRemoveItems = () => {
        if (!removeConfirmData.removeId || removeConfirmData.removeId.length === 0) {
            return
        }

        removeFavorite(removeConfirmData.removeId)
        setRemoveConfirmData({ isOpen: false, removeId: undefined })
    }

    const [rowSelection, setRowSelection] = useState<Record<string, FollowedItem>>({})

    const selectedUuids = useMemo(() => {
        return Object.values(rowSelection).map((i) => Number(i.id))
    }, [rowSelection])

    const handleTableSelectRow = useCallback(
        (row: Row<FollowedItem>) => {
            if (row.original.id) {
                const newRowSelection = { ...rowSelection }
                if (rowSelection[row.original.id]) {
                    delete newRowSelection[row.original.id]
                } else {
                    newRowSelection[row.original.id] = row.original
                }
                setRowSelection(newRowSelection)
            }
        },
        [rowSelection, setRowSelection],
    )

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

    const isRowSelected = useCallback(
        (row: Row<FollowedItem>) => {
            return row.original.id ? !!rowSelection[row.original.id] : false
        },
        [rowSelection],
    )

    const handleAllRowsSelectChange = useCallback(
        (rows: FollowedItem[]) => {
            const checked = rows.every(({ id }) => (id ? !!rowSelection[id] : false))
            const newRowSelection = { ...rowSelection }
            if (checked) {
                rows.forEach(({ id }) => id && delete newRowSelection[id])
                setRowSelection(newRowSelection)
            } else {
                setRowSelection((prevRowSelection) => ({ ...prevRowSelection, ...reduceTableDataToObject(rows) }))
            }
        },
        [rowSelection, setRowSelection],
    )

    const columns: Array<ColumnDef<FollowedItem>> = [
        {
            header: ({ table }: { table: ITable<FollowedItem> }) => {
                const checked = table.getRowModel().rows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox-all"
                            value="checkbox-all"
                            onChange={(event) => {
                                event.stopPropagation()
                                handleAllRowsSelectChange(listData?.items || [])
                            }}
                            onClick={(event) => event.stopPropagation()}
                            checked={checked}
                            title={t('table.selectAllItems')}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }: { row: Row<FollowedItem> }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        title={t('table.selectItem', { itemName: row.original.name })}
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        value="true"
                        onChange={(event) => {
                            event.stopPropagation()
                            handleTableSelectRow(row)
                        }}
                        onClick={(event) => event.stopPropagation()}
                        checked={row.original.id ? !!rowSelection[row.original.id] : false}
                    />
                </div>
            ),
        },
        {
            header: t('userProfile.notifications.table.name'),
            id: 'name',
            enableSorting: true,
            accessorFn: (row) => row,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => getLink(ctx.getValue() as FollowedItem, location, ciListData ?? {}),
        },
        {
            header: t('userProfile.notifications.table.settings'),
            id: 'settings',
            accessorFn: (row) => row,
            cell: (ctx) => {
                const { id, itemId, email, portal } = ctx.cell.getValue() as FollowedItem
                return (
                    <div className={classNames('govuk-checkboxes', 'govuk-checkboxes--small', styles.buttonContainer)}>
                        <CheckBox
                            id={'t' + itemId ?? ''}
                            name={itemId ?? ''}
                            label={t('userProfile.notifications.table.portal')}
                            checked={portal}
                            onChange={(event) => handleCheckboxChange({ isPortalChecked: event.target.checked, id })}
                        />
                        <CheckBox
                            id={itemId ?? ''}
                            name={itemId ?? ''}
                            label={t('userProfile.notifications.table.email')}
                            checked={email}
                            onChange={(event) => handleCheckboxChange({ isEmailChecked: event.target.checked, id })}
                        />
                        <ButtonLink
                            className={classNames(styles.removeButton, 'govuk-link')}
                            label={t('userProfile.notifications.table.delete')}
                            onClick={() => {
                                setRemoveConfirmData({ isOpen: true, removeId: [Number(id)] })
                            }}
                        />
                    </div>
                )
            },
        },
    ]

    useEffect(() => {
        refetch()
    }, [pagination, refetch])

    const disabledBulkAction = !selectedUuids.length
    const isLoading = [isLoadingList, isLoadingCiListData, isLoadingUpdateMutation, isLoadingRemove, isRefetching].some((item) => item)
    const isError = [isErrorList, isErrorCiListData].some((item) => item)
    const isErrorMutation = [isErrorUpdateMutation, isErrorRemove].some((item) => item)
    const isSuccessMutation = [isSuccessUpdate, isSuccessRemove].some((item) => item)
    const successMessage =
        removedCount > 1 ? t('userProfile.notifications.feedback.removeSuccess') : t('userProfile.notifications.feedback.removeSuccessSingle')

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <MutationFeedback
                success={isSuccessMutation}
                error={isErrorMutation ? t('userProfile.notifications.feedback.error') : undefined}
                successMessage={isSuccessRemove ? successMessage : undefined}
                onMessageClose={() => {
                    resetRemoveState()
                    resetUpdateState()
                }}
            />
            <ActionsOverTable
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handleFilterChange={(filter) => {
                    setPagination({ ...pagination, pageNumber: BASE_PAGE_NUMBER, pageSize: filter.pageSize ?? BASE_PAGE_SIZE })
                }}
                pagination={{ ...pagination, dataLength: listData?.items?.length ?? 0 }}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                bulkPopup={
                    <BulkPopup
                        checkedRowItems={selectedUuids.length}
                        disabled={disabledBulkAction}
                        items={(closePopup) => [
                            <ButtonLink
                                key={'remove'}
                                label={t('userProfile.notifications.table.delete')}
                                icon={NotificationBlackIcon}
                                className={actionsOverTableStyles.buttonLinkWithIcon}
                                onClick={() => {
                                    setRemoveConfirmData({ isOpen: true, removeId: selectedUuids })
                                    setRowSelection({})
                                    closePopup()
                                }}
                            />,
                        ]}
                    />
                }
                entityName={''}
            />
            <Table<FollowedItem>
                columns={columns}
                data={listData?.items}
                sort={[{ orderBy: pagination.order, sortDirection: pagination.ascending ? SortType.ASC : SortType.DESC }]}
                onSortingChange={(newSort) => {
                    setPagination({ ...pagination, order: newSort?.[0]?.orderBy, ascending: newSort?.[0]?.sortDirection === SortType.ASC })
                    clearSelectedRows()
                }}
                isRowSelected={isRowSelected}
                pagination={{ pageIndex: pagination.pageNumber - 1, pageSize: pagination.pageSize }}
            />
            <PaginatorWrapper
                pageSize={pagination.pageSize}
                pageNumber={pagination.pageNumber}
                dataLength={200} // api bug - dataLength is not returned MIID-245
                handlePageChange={(page) => setPagination({ ...pagination, pageNumber: page.pageNumber ?? BASE_PAGE_NUMBER })}
            />
            <ConfirmationModal
                isOpen={removeConfirmData.isOpen}
                onClose={() => setRemoveConfirmData({ isOpen: false, removeId: undefined })}
                onConfirm={() => handleRemoveItems()}
                title={t('userProfile.notifications.confirmRemove')}
            />
        </QueryFeedback>
    )
}
