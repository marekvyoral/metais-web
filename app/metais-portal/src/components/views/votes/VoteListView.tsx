import { BreadCrumbs, CheckBox, Filter, HomeIcon, Input, SimpleSelect, Table, TextHeading, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreviewList, ApiVotePreview, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef, isRowSelected } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { IVotesListFilterData } from '@/components/containers/votes/VotesListContainer'

export interface IVotesListView {
    votesListData: ApiVotePreviewList | undefined
}

const defaultFilterValues: IVotesListFilterData = {
    votesTypeToShow: { value: 'everyone', label: 'everyone' },
    voteState: { value: 'planned', label: 'planned' },
    effectiveFrom: '',
    effectiveTo: '',
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
            <Filter<IVotesListFilterData>
                heading={t('votesList.filter.title')}
                defaultFilterValues={defaultFilterValues}
                form={({ filter, register, setValue }) => (
                    <div>
                        <SimpleSelect
                            id="votesTypeToShow"
                            label={t('votesList.filter.votesTypeToShow')}
                            options={[
                                { value: 'onlyMy', label: t('votesList.type.onlyMyVotes') },
                                { value: 'everyone', label: t('votesList.type.allVotes') },
                            ]}
                            setValue={setValue}
                            defaultValue={defaultFilterValues.votesTypeToShow.label}
                            name="votesTypeToShow"
                        />
                        <SimpleSelect
                            id="voteState"
                            label={t('votesList.filter.voteState')}
                            options={[
                                { value: 'planned', label: t('votesList.type.planned') },
                                { value: 'ended', label: t('votesList.type.ended') },
                            ]}
                            setValue={setValue}
                            defaultValue={defaultFilterValues.votesTypeToShow.label}
                            name="voteState"
                        />
                        {/*TODO: zmenit inline style na nieco normalne*/}
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Input {...register('fromDate')} type="date" label={t('votesList.filter.fromDate')} />
                            <Input {...register('toDate')} type="date" label={t('votesList.filter.toDate')} />
                        </div>
                    </div>
                )}
            />
            <ActionsOverTable entityName="" handleFilterChange={handleFilterChange} hiddenButtons={{ SELECT_COLUMNS: true }} />
            <Table data={votesListData?.votes} columns={columns} sort={undefined} isLoading={false} error={undefined} />
        </>
    )
}
