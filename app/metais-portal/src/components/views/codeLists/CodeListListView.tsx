import { BreadCrumbs, ButtonLink, CheckBox, Filter, HomeIcon, Input, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { RoleParticipantUI } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiCodelistItemName, ApiCodelistManager, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, PO } from '@isdd/metais-common/constants'
import { ActionsOverTable, BulkPopup, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, Table as ITable, Row } from '@tanstack/react-table'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { DynamicFilterAttributes, ExtendedAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { useAddFavorite } from '@isdd/metais-common/hooks/useAddFavorite'
import { FollowedItemItemType } from '@isdd/metais-common/api/generated/user-config-swagger'
import { NotificationBlackIcon } from '@isdd/metais-common/assets/images'
import actionsOverTableStyles from '@isdd/metais-common/components/actions-over-table/actionsOverTable.module.scss'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'
import { SelectPOForFilter } from '@isdd/metais-common/components/select-po/SelectPOForFilter'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { selectBasedOnLanguageAndDate } from '@/components/views/codeLists/CodeListDetailUtils'
import { CodeListListFilterData, CodeListListViewProps, CodeListState, defaultFilterValues } from '@/components/containers/CodeListListContainer'
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
    rowSelection,
    setRowSelection,
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
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
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
                        title={t('table.selectItem', {
                            itemName: selectBasedOnLanguageAndDate(row.original.codelistNames as ApiCodelistItemName[], 'sk'),
                        })}
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
            size: 150,
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
            size: 150,
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

    const filterAttributes = (): ExtendedAttribute[] | undefined => {
        const logged: ExtendedAttribute[] = !isOnlyPublishedPage
            ? [
                  {
                      name: t('codeListList.filter.state'),
                      attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                      technicalName: 'wfState',
                      invisible: false,
                      valid: true,
                      customComponent: (value, onChange) => {
                          return (
                              <SimpleSelect
                                  name={'atributeValue'}
                                  label={t('customAttributeFilter.value.label')}
                                  options={Object.values(CodeListState).map((state) => ({
                                      value: state,
                                      label: t(`codeListList.state.${state}`),
                                  }))}
                                  defaultValue={value?.value}
                                  onChange={(val) => {
                                      onChange({ ...value, value: val })
                                  }}
                              />
                          )
                      },
                      customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
                  },
              ]
            : []

        return [
            {
                name: t('codeListList.filter.code'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'code',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            {
                name: t('codeListList.filter.onlyBase.label'),
                attributeTypeEnum: 'BOOLEAN',
                technicalName: 'onlyBase',
                invisible: false,
                valid: true,
            },
            {
                name: t('codeListList.filter.toDate'),
                attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
                technicalName: 'toDate',
                invisible: false,
                valid: true,
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL_OR_LOWER],
            },
            {
                name: t('codeListList.filter.mainGestor'),
                attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
                technicalName: 'mainGestorPoUuid',
                invisible: false,
                valid: true,
                customComponent: (value, onChange) => {
                    return (
                        <SelectPOForFilter
                            ciType={PO}
                            label={t('customAttributeFilter.value.label')}
                            name="atributeValue"
                            valuesAsUuids={Array.isArray(value) ? [value?.[0]?.value] ?? [] : value?.value ? [value?.value] : []}
                            onChange={(val) => {
                                if (val && val.length && val.every((v) => v && v.uuid != '')) {
                                    onChange({ ...value, value: val?.[0]?.uuid })
                                }
                            }}
                            isMulti={false}
                        />
                    )
                },
                customOperators: [OPERATOR_OPTIONS_URL.EQUAL],
            },
            ...logged,
        ]
    }

    const constraintsData: (EnumType | undefined)[] = [
        {
            code: 'state',
            enumItems: Object.values(CodeListState).map((state) => ({
                value: state,
                description: t(`codeListList.state.${state}`),
            })),
        },
    ]
    const columnsWithPermissions = isUserLogged ? columns : columns.slice(1)
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
                                error={!!errorAddToFavorite}
                                errorMessage={t('userProfile.notifications.feedback.error')}
                                onMessageClose={() => resetState()}
                            />
                            <QueryFeedback error={isError} loading={false} />
                            <MutationFeedback success={isExternalSuccess} />
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
                        form={({ filter: formFilter, register, setValue }) => {
                            return (
                                <div>
                                    <Input {...register('name')} type="text" label={t('codeListList.filter.name')} />
                                    <DynamicFilterAttributes
                                        setValue={setValue}
                                        defaults={defaultFilterValues}
                                        attributes={filterAttributes()}
                                        attributeProfiles={[]}
                                        constraintsData={constraintsData}
                                        filterData={{
                                            attributeFilters: formFilter.attributeFilters ?? {},
                                            metaAttributeFilters: {},
                                        }}
                                        ignoreInputNames={['lastModifiedAt', 'createdAt', 'owner', 'state']}
                                    />
                                </div>
                            )
                        }}
                    />

                    <ActionsOverTable
                        pagination={{
                            pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                            dataLength: data?.dataLength ?? 0,
                        }}
                        selectedRowsCount={selectedUuids.length}
                        bulkPopup={({ selectedRowsCount }) => (
                            <BulkPopup
                                checkedRowItems={selectedRowsCount}
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
                        )}
                        entityName=""
                        handleFilterChange={handleFilterChange}
                        pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                        hiddenButtons={{ SELECT_COLUMNS: true }}
                    />
                    <Table<ApiCodelistPreview>
                        data={data?.list}
                        // columns={columns}
                        sort={filter.sort ?? []}
                        isRowSelected={isRowSelected}
                        onSortingChange={(columnSort) => {
                            handleFilterChange({ sort: columnSort })
                            clearSelectedRows()
                        }}
                        columns={columnsWithPermissions}
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
