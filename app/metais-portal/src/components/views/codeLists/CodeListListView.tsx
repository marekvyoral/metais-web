import { BreadCrumbs, ButtonLink, CheckBox, Filter, HomeIcon, Input, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistItemName, ApiCodelistManager, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable, BulkPopup, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { SelectFilterOrganization } from '@isdd/metais-common/components/select-organization/SelectFilterOrganization'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { useAddFavorite } from '@isdd/metais-common/hooks/useAddFavorite'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'

import { selectBasedOnLanguageAndDate } from '@/components/views/codeLists/CodeListDetailUtils'
import {
    CodeListFilterOnlyBase,
    CodeListListFilterData,
    CodeListListViewProps,
    CodeListState,
    defaultFilterValues,
} from '@/components/containers/CodeListListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

const getMainGestor = (codeListManager: ApiCodelistManager[], roleParticipants: RoleParticipantUI[]) => {
    if (!codeListManager.length) {
        return null
    }
    const id = codeListManager?.[0].value
    const participant = roleParticipants.find((item) => item.gid === id)
    return participant?.configurationItemUi?.attributes?.Gen_Profil_nazov
}

export const reduceTableDataToObject = <T extends { id?: number }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.id) {
            result[item.id] = item
        }
        return result
    }, {})
}

export const CodeListListView: React.FC<CodeListListViewProps> = ({
    data,
    filter,
    handleFilterChange,
    isOnlyPublishedPage = false,
    isError,
    isLoading,
}) => {
    const { t } = useTranslation()
    const {
        isActionSuccess: { value: isExternalSuccess },
    } = useActionSuccess()
    const {
        addFavorite,
        error: errorAddToFavorite,
        isLoading: isLoadingAddToFavorite,
        isSuccess: isSuccessAddToFavorite,
        resetState,
        successMessage,
    } = useAddFavorite()
    const { wrapperRef, scrollToMutationFeedback } = useScroll()
    const [rowSelection, setRowSelection] = useState<Record<string, ApiCodelistPreview>>({})

    const selectedUuids = useMemo(() => {
        return Object.values(rowSelection).map((i) => i.id)
    }, [rowSelection])

    const handleCheckboxChange = useCallback(
        (row: Row<ApiCodelistPreview>) => {
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

    const handleAllCheckboxChange = useCallback(
        (rows: ApiCodelistPreview[]) => {
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

    const isRowSelected = useCallback(
        (row: Row<ApiCodelistPreview>) => {
            return row.original.id ? !!rowSelection[row.original.id] : false
        },
        [rowSelection],
    )

    const handleAddToFavorite = () => {
        addFavorite(
            selectedUuids.map((item) => String(item)),
            FollowedItemItemType.CODELIST,
        )
    }

    useEffect(() => {
        scrollToMutationFeedback()
    }, [isError, isExternalSuccess, isSuccessAddToFavorite, errorAddToFavorite, scrollToMutationFeedback])

    const columns: Array<ColumnDef<ApiCodelistPreview>> = [
        {
            header: ({ table }: { table: ITable<ApiCodelistPreview> }) => {
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
                                handleAllCheckboxChange(data?.list || [])
                            }}
                            onClick={(event) => event.stopPropagation()}
                            checked={checked}
                            title={t('table.selectAllItems')}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }: { row: Row<ApiCodelistPreview> }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        title={`checkbox_${row.id}`}
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        value="true"
                        onChange={(event) => {
                            event.stopPropagation()
                            handleCheckboxChange(row)
                        }}
                        onClick={(event) => event.stopPropagation()}
                        checked={row.original.id ? !!rowSelection[row.original.id] : false}
                    />
                </div>
            ),
        },
        {
            id: 'codelistName',
            header: t('codeListList.table.name'),
            accessorFn: (row) => row.codelistNames,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => selectBasedOnLanguageAndDate(ctx.getValue() as ApiCodelistItemName[], 'sk'),
            },
            cell: (row) => {
                const name = selectBasedOnLanguageAndDate(row.getValue() as ApiCodelistItemName[], 'sk')
                return <TextLink to={`${NavigationSubRoutes.CODELIST}/${row.row.original.id}`}>{name}</TextLink>
            },
        },
        {
            id: 'code',
            header: t('codeListList.table.code'),
            accessorFn: (row) => row.code,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: true,
        },
        {
            id: 'mainGestor',
            header: t('codeListList.table.mainGestor'),
            accessorFn: (row) => row.mainCodelistManagers,
            meta: {
                getCellContext: (ctx) => getMainGestor(ctx.getValue() as ApiCodelistManager[], data?.roleParticipants || []),
            },
            cell: (row) => getMainGestor(row.getValue() as ApiCodelistManager[], data?.roleParticipants || []),
        },
        {
            id: 'effectiveFrom',
            header: t('codeListList.table.effectiveFrom'),
            accessorFn: (row) => row.effectiveFrom,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => t('date', { date: ctx.getValue() as string }),
            },
            cell: (row) => t('date', { date: row.getValue() as string }),
        },
        {
            id: 'base',
            header: t('codeListList.table.isBase'),
            accessorFn: (row) => row.base,
            enableSorting: true,
            cell: (row) => {
                return row.getValue() ? t('radioButton.yes') : t('radioButton.no')
            },
        },
    ]

    if (!isOnlyPublishedPage) {
        columns.push({
            id: 'codelistState',
            header: t('state'),
            accessorFn: (row) => row.codelistState,
            enableSorting: true,
            cell: (row) => {
                return t(`codeListList.state.${row.getValue()}`)
            },
        })
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                    {
                        label: isOnlyPublishedPage ? t('codeList.breadcrumbs.publicCodeListsList') : t('codeList.breadcrumbs.codeListsList'),
                        href: NavigationSubRoutes.CODELIST,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={isLoading || isLoadingAddToFavorite} error={false} withChildren>
                    <FlexColumnReverseWrapper>
                        <TextHeading size="XL">{t('codeListList.title')}</TextHeading>
                        <div ref={wrapperRef}>
                            <MutationFeedback
                                success={isSuccessAddToFavorite}
                                successMessage={successMessage}
                                error={errorAddToFavorite ? t('userProfile.notifications.feedback.error') : undefined}
                                onMessageClose={() => resetState()}
                            />
                            {isError && <QueryFeedback error loading={false} />}
                            {isExternalSuccess && <MutationFeedback success error={false} />}
                        </div>
                    </FlexColumnReverseWrapper>
                    {isOnlyPublishedPage ? (
                        <TextHeading size="L">{t('codeListList.publicCodeListSubtitle')}</TextHeading>
                    ) : (
                        <TextHeading size="L">{t('codeListList.codeListSubtitle')}</TextHeading>
                    )}

                    <Filter<CodeListListFilterData>
                        heading={t('codeList.filter.title')}
                        defaultFilterValues={defaultFilterValues}
                        form={({ filter: formFilter, register, setValue }) => (
                            <div>
                                <SelectFilterOrganization<CodeListListFilterData>
                                    label={t('codeListList.filter.mainGestor')}
                                    name="mainGestorPoUuid"
                                    filter={formFilter}
                                    setValue={setValue}
                                />
                                <Input {...register('toDate')} type="date" label={t('codeListList.filter.toDate')} />
                                <SimpleSelect
                                    id="onlyBase"
                                    name="onlyBase"
                                    label={t('codeListList.filter.onlyBase.label')}
                                    options={[
                                        { value: CodeListFilterOnlyBase.TRUE, label: t('codeListList.filter.onlyBase.true') },
                                        { value: CodeListFilterOnlyBase.FALSE, label: t('codeListList.filter.onlyBase.false') },
                                    ]}
                                    setValue={setValue}
                                    defaultValue={formFilter.onlyBase || defaultFilterValues.onlyBase}
                                />
                                {!isOnlyPublishedPage && (
                                    <>
                                        <SimpleSelect
                                            id="wfState"
                                            name="wfState"
                                            label={t('codeListList.filter.state')}
                                            options={Object.values(CodeListState).map((state) => ({
                                                value: state,
                                                label: t(`codeListList.state.${state}`),
                                            }))}
                                            setValue={setValue}
                                            defaultValue={formFilter.wfState || defaultFilterValues.wfState}
                                        />
                                        <Input {...register('code')} type="text" label={t('codeListList.filter.code')} />
                                        <Input {...register('name')} type="text" label={t('codeListList.filter.name')} />
                                    </>
                                )}
                            </div>
                        )}
                    />
                    <ActionsOverTable
                        pagination={{
                            pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                            dataLength: data?.dataLength ?? 0,
                        }}
                        bulkPopup={
                            <BulkPopup
                                checkedRowItems={selectedUuids.length}
                                disabled={!selectedUuids.length}
                                items={(closePopup) => [
                                    <ButtonLink
                                        key={'favorite'}
                                        label={t('codeListList.buttons.addToFavorites')}
                                        icon={NotificationBlackIcon}
                                        className={actionsOverTableStyles.buttonLinkWithIcon}
                                        onClick={() => {
                                            handleAddToFavorite()
                                            setRowSelection({})
                                            closePopup()
                                        }}
                                    />,
                                ]}
                            />
                        }
                        entityName=""
                        handleFilterChange={handleFilterChange}
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    />
                    <Table<ApiCodelistPreview>
                        data={data?.list}
                        columns={columns}
                        sort={filter.sort ?? []}
                        isRowSelected={isRowSelected}
                        onSortingChange={(columnSort) => {
                            handleFilterChange({ sort: columnSort })
                            clearSelectedRows()
                        }}
                    />
                    <PaginatorWrapper
                        pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                        pageSize={filter.pageSize || BASE_PAGE_SIZE}
                        dataLength={data?.dataLength || 0}
                        handlePageChange={handleFilterChange}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}

export default CodeListListView
