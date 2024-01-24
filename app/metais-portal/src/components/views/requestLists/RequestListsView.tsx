import { BreadCrumbs, Filter, HomeIcon, Input, MultiSelect, PaginatorWrapper, SimpleSelect, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { ApiCodelistItemName, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, RequestListState } from '@isdd/metais-common/constants'
import { ActionsOverTable, CreateEntityButton, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'

import { CodeListFilterOnlyBase } from '@/components/containers/CodeListListContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RequestListFilterData, RequestListViewProps, defaultFilterValues } from '@/components/containers/RequestListContainer'

const getDefaultLanguageValue = (languageData: Array<ApiCodelistItemName>) => {
    return languageData?.find((item) => item.language === 'sk')?.value
}

export const RequestListsView: React.FC<RequestListViewProps> = ({ data, filter, handleFilterChange, isLoading }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const userAbility = useAbilityContext()

    const {
        isActionSuccess: { value: isSuccess, additionalInfo },
    } = useActionSuccess()

    const columns: Array<ColumnDef<ApiCodelistPreview>> = [
        {
            id: 'codelistName',
            header: t('codeListList.table.name'),
            accessorFn: (row) => row.codelistNames,
            enableSorting: true,
            meta: {
                getCellContext: (ctx) => getDefaultLanguageValue(ctx.getValue() as ApiCodelistItemName[]),
            },
            cell: (row) => {
                const name = getDefaultLanguageValue(row.getValue() as ApiCodelistItemName[])
                return <TextLink to={`${NavigationSubRoutes.REQUESTLIST}/${row.row.original.id}`}>{name}</TextLink>
            },
        },
        {
            id: 'id',
            header: t('codeListList.table.code'),
            accessorFn: (row) => row.code,
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            enableSorting: true,
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
        {
            id: 'codelistState',
            header: t('codeListList.table.state'),
            accessorFn: (row) => row.codelistState,
            enableSorting: true,
            cell: (row) => {
                return t(`codeListList.state.${row.getValue()}`)
            },
        },
    ]

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('codeList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('codeList.breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                    { label: t('codeList.breadcrumbs.codeLists'), href: RouteNames.HOW_TO_CODELIST },
                    { label: t('codeList.breadcrumbs.requestList'), href: NavigationSubRoutes.REQUESTLIST },
                ]}
            />
            {userAbility.can(Actions.SHOW, Subjects.LIST) && (
                <MainContentWrapper>
                    {isSuccess && (
                        <MutationFeedback
                            success
                            error={false}
                            successMessage={t([additionalInfo?.messageKey ?? '', 'mutationFeedback.successfulUpdated'])}
                        />
                    )}
                    <QueryFeedback loading={isLoading} error={false} withChildren>
                        <TextHeading size="XL">{t('codeListList.requestTitle')}</TextHeading>

                        <Filter<RequestListFilterData>
                            heading={t('codeListList.filter.title')}
                            defaultFilterValues={defaultFilterValues}
                            form={({ filter: formFilter, register, setValue }) => (
                                <div>
                                    <MultiSelect
                                        id="wfState"
                                        name="wfState"
                                        label={t('codeListList.filter.state')}
                                        options={Object.values(RequestListState).map((state) => ({
                                            value: state,
                                            label: t(`codeListList.state.${state}`),
                                        }))}
                                        setValue={setValue}
                                        defaultValue={formFilter.wfState || defaultFilterValues.wfState}
                                    />
                                    <Input {...register('code')} type="text" label={t('codeListList.filter.code')} />
                                    <Input {...register('name')} type="text" label={t('codeListList.filter.name')} />
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
                                </div>
                            )}
                        />
                        <ActionsOverTable
                            pagination={{
                                pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                                pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                                dataLength: data?.dataLength || 0,
                            }}
                            entityName="requestList"
                            pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                            createButton={
                                userAbility.can(Actions.CREATE, Subjects.DETAIL) && (
                                    <CreateEntityButton
                                        onClick={() => navigate(`${NavigationSubRoutes.REQUESTLIST}/create`, { state: { from: location } })}
                                        label={t('codeListList.requestCreate.addBtn')}
                                    />
                                )
                            }
                            handleFilterChange={handleFilterChange}
                            hiddenButtons={{ SELECT_COLUMNS: true }}
                        />
                        <Table
                            data={data?.list}
                            columns={columns}
                            sort={filter.sort ?? []}
                            onSortingChange={(columnSort) => {
                                handleFilterChange({ sort: columnSort })
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
            )}
        </>
    )
}

export default RequestListsView
