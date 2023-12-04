import { Filter } from '@isdd/idsk-ui-kit/filter'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { SimpleSelect } from '@isdd/idsk-ui-kit/select/simple-select/SimpleSelect'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { TextLink } from '@isdd/idsk-ui-kit/typography/TextLink'
import { ClaimSetUi, ClaimUi } from '@isdd/metais-common/api/generated/claim-manager-swagger'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS, EClaimState } from '@isdd/metais-common/constants'
import { QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { IRequestListFilterView, RequestListType } from '@/components/containers/ManagementList/RequestListContainer'

export interface IRequestListView {
    listType: RequestListType
    data?: ClaimSetUi
    defaultFilterParams: IRequestListFilterView
    route: AdminRouteNames
    handleFilterChange: (filter: IFilter) => void
    isLoading: boolean
    isError: boolean
}

export const RequestListView: React.FC<IRequestListView> = ({
    listType,
    data,
    defaultFilterParams,
    handleFilterChange,
    route,
    isError,
    isLoading,
}) => {
    const { t, i18n } = useTranslation()
    const entityName = 'requestList'
    const columns: Array<ColumnDef<ClaimUi>> = [
        {
            header: t('requestList.fullName'),
            accessorFn: (row) => row?.identityLastName,
            enableSorting: true,
            id: 'identityLastName',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.identityFirstName + ' ' + ctx?.row?.original?.identityLastName,
            },
            cell: (ctx) => (
                <TextLink to={`${route}/detail/${listType?.toLowerCase()}/${ctx?.row?.original?.uuid}`}>
                    {ctx?.row?.original?.identityFirstName + ' ' + ctx?.row?.original?.identityLastName}
                </TextLink>
            ),
        },
        {
            header: t('requestList.identityLogin'),
            accessorFn: (row) => row?.identityLogin,
            enableSorting: true,
            id: 'identityLogin',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.identityLogin,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.identityLogin}</span>,
        },
        {
            header: t('requestList.telephone'),
            accessorFn: (row) => row?.telephone,
            enableSorting: true,
            id: 'telephone',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.telephone,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.telephone}</span>,
        },
        {
            header: t('requestList.mobile'),
            accessorFn: (row) => row?.mobile,
            enableSorting: true,
            id: 'mobile',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.mobile,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.mobile}</span>,
        },
        {
            header: t('requestList.email'),
            accessorFn: (row) => row?.email,
            enableSorting: true,
            id: 'email',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.email,
            },
            cell: (ctx) => <span>{ctx?.row?.original?.email}</span>,
        },
        {
            header: t('requestList.createdAt'),
            accessorFn: (row) => row?.createdAt,
            enableSorting: true,
            id: 'createdAt',
            cell: (ctx) => (
                <span>{ctx?.row?.original?.createdAt ? new Date(ctx?.row?.original?.createdAt).toLocaleDateString(i18n.language) : ''}</span>
            ),
        },
        {
            header: t('requestList.claimState'),
            accessorFn: (row) => row?.claimState,
            enableSorting: false,
            id: 'claimState',
            cell: (ctx) => <span>{t(`requestList.stateEnum.${ctx.getValue()}`)}</span>,
        },
        {
            header: t('requestList.poName'),
            accessorFn: (row) => row?.poName,
            enableSorting: false,
            id: 'poName',
            meta: {
                getCellContext: (ctx) => ctx?.row?.original?.poName,
            },
            cell: (ctx) => <span className="govuk-body-s">{ctx?.row?.original?.poName}</span>,
        },
    ]

    return (
        <>
            <QueryFeedback loading={isLoading} error={false} withChildren>
                <FlexColumnReverseWrapper>
                    <TextHeading size="XL">
                        {listType === RequestListType.GDPR && t('requestList.gdprTitle')}
                        {listType === RequestListType.REGISTRATION && t('requestList.registrationLitle')}
                        {listType === RequestListType.REQUESTS && t('requestList.title')}
                    </TextHeading>
                    {isError && <QueryFeedback error loading={false} errorProps={{ errorMessage: t('managementList.containerQueryError') }} />}
                </FlexColumnReverseWrapper>
                <Filter<IRequestListFilterView>
                    defaultFilterValues={defaultFilterParams}
                    form={({ filter, setValue }) => (
                        <>
                            <SimpleSelect
                                label={t(`userManagement.filter.state`)}
                                options={[
                                    {
                                        value: EClaimState.WAITING,
                                        label: t('requestList.filter.created'),
                                    },
                                    {
                                        value: EClaimState.ACCEPTED,
                                        label: t('requestList.filter.accepted'),
                                    },
                                    {
                                        value: EClaimState.REFUSED,
                                        label: t('requestList.filter.rejected'),
                                    },
                                ]}
                                defaultValue={filter?.status}
                                name="status"
                                setValue={setValue}
                            />
                            <SimpleSelect
                                label={t(`userManagement.filter.listTypeLabel`)}
                                options={[
                                    {
                                        value: RequestListType.REQUESTS,
                                        label: t('requestList.filter.listType.requests'),
                                    },
                                    {
                                        value: RequestListType.REGISTRATION,
                                        label: t('requestList.filter.listType.registrations'),
                                    },
                                    {
                                        value: RequestListType.GDPR,
                                        label: t('requestList.filter.listType.gdpr'),
                                    },
                                ]}
                                defaultValue={filter?.listType}
                                name="listType"
                                setValue={setValue}
                                isClearable={false}
                            />
                        </>
                    )}
                />
                <ActionsOverTable
                    pagination={{
                        pageNumber: defaultFilterParams.pageNumber ?? BASE_PAGE_NUMBER,
                        pageSize: defaultFilterParams.pageSize ?? BASE_PAGE_SIZE,
                        dataLength: data?.pagination?.totalItems ?? 0,
                    }}
                    handleFilterChange={handleFilterChange}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName={entityName}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                />
                <Table
                    key={'requestListTable'}
                    rowHref={(row) => `./detail/${listType.toLowerCase()}/${row?.original?.uuid}`}
                    data={data?.claimSet || []}
                    columns={columns.map((item) => ({ ...item, size: 150 }))}
                    sort={defaultFilterParams.sort}
                    pagination={{
                        pageIndex: defaultFilterParams.pageNumber ?? BASE_PAGE_NUMBER,
                        pageSize: defaultFilterParams.pageSize ?? BASE_PAGE_SIZE,
                    }}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
                <PaginatorWrapper
                    pageNumber={defaultFilterParams.pageNumber ?? BASE_PAGE_NUMBER}
                    pageSize={defaultFilterParams.pageSize ?? BASE_PAGE_SIZE}
                    dataLength={data?.pagination?.totalItems ?? 0}
                    handlePageChange={handleFilterChange}
                />
            </QueryFeedback>
        </>
    )
}
