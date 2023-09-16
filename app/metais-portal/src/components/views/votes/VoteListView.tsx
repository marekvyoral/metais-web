import { BreadCrumbs, CheckBox, Filter, HomeIcon, Input, SimpleSelect, Table, TextHeading, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreviewList, ApiVotePreview, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, isRowSelected } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { SelectFilterOrganization } from '../codeLists/components/SelectFilterMainGestor/SelectFilterMainGestor'

import { CodeListListFilterData, defaultFilterValues } from '@/components/containers/CodeListListContainer'

export interface IVotesListView {
    votesListData: ApiVotePreviewList | undefined
}

export const VotesListView: React.FC<IVotesListView> = ({ votesListData }) => {
    const { t } = useTranslation()
    // const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    // const [currentPage, setCurrentPage] = useState(1)

    const columns: Array<ColumnDef<ApiVotePreview>> = [
        {
            header: t('voteslist.subjectname'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'subjectname',
            size: 500,
            cell: (ctx) => {
                const { id } = ctx.row.original
                const name = ctx.getValue() as string
                return <TextLink to={`${NavigationSubRoutes.VOTE_DETAIL}/${id}`}>{name}</TextLink>
            },
        },
        {
            header: t('voteslist.datefrom'),
            accessorFn: (row) => row?.effectiveFrom,
            enableSorting: true,
            id: 'datefrom',
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('voteslist.dateto'),
            accessorFn: (row) => row?.effectiveTo,
            enableSorting: true,
            id: 'dateto',
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('voteslist.votestate'),
            accessorFn: (row) => row?.voteState,
            enableSorting: true,
            id: 'votestate',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('voteslist.cancast'),
            accessorFn: (row) => row?.canCast,
            enableSorting: true,
            id: 'cancast',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('voteslist.hascast'),
            accessorFn: (row) => row?.hasCast,
            enableSorting: true,
            id: 'hascast',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]

    function handleFilterChange(filter: IFilter): void {
        throw new Error('Function not implemented.')
    }

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('votesList.breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('votesList.breadcrumbs.standardization'), href: RouteNames.HOW_TO_STANDARDIZATION },
                    { label: t('votesList.breadcrumbs.VotesLists'), href: NavigationSubRoutes.ZOZNAM_HLASOV },
                ]}
            />
            <TextHeading size="XL">{t('votesList.title')}</TextHeading>
            <TextHeading size="L">{t('votesList.votesListSubtitle')}</TextHeading>
            <Filter<CodeListListFilterData>
                heading={t('votesList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter: formFilter, register, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="type"
                            label={t('votesList.create.type')}
                            options={[
                                { value: 'application', label: t('votesList.type.application') },
                                { value: 'system', label: t('votesList.type.system') },
                                { value: 'custom', label: t('votesList.type.custom') },
                            ]}
                            setValue={setValue}
                            defaultValue={formFilter.type || defaultFilterValues}
                            name="type"
                        />
                        <Input {...register('toDate')} type="date" label={t('votesList.filter.toDate')} />
                        <CheckBox {...register('onlyBase')} id="onlyBase" label={t('votesList.filter.onlyBase')} />
                    </div>
                )}
            />
            <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
            <Table data={votesListData?.votes} columns={columns} sort={undefined} isLoading={false} error={undefined} />
        </>
    )
}
