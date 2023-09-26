import { IOption, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreview } from '@isdd/metais-common/api'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export enum VoteStateEnum {
    CREATED = 'CREATED',
    CANCELED = 'CANCELED',
    SUMMARIZED = 'SUMMARIZED',
    VETOED = 'VETOED',
}

export enum VoteStateOptionEnum {
    planned = 'planned',
    ended = 'ended',
    upcomming = 'upcomming',
    canceled = 'canceled',
    summarized = 'summarized',
    vetoed = 'vetoed',
}

export const columns = (t: TFunction): Array<ColumnDef<ApiVotePreview>> => {
    return [
        {
            header: t('votes.votesList.subjectname'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            size: 500,
            cell: (ctx) => {
                const { id } = ctx.row.original
                const name = ctx.getValue() as string
                return <TextLink to={`${NavigationSubRoutes.VOTE_DETAIL}/${id}`}>{name}</TextLink>
            },
        },
        {
            header: t('votes.votesList.datefrom'),
            accessorFn: (row) => row?.effectiveFrom,
            enableSorting: true,
            id: 'effectiveFrom',
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.dateto'),
            accessorFn: (row) => row?.effectiveTo,
            enableSorting: true,
            id: 'effectiveTo',
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.votestate'),
            accessorFn: (row) => row?.voteState,
            enableSorting: true,
            id: 'voteState',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('votes.votesList.cancast'),
            accessorFn: (row) => row?.canCast,
            enableSorting: true,
            id: 'canCast',
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? 'true' : 'false'}</span>,
        },
        {
            header: t('votes.votesList.hascast'),
            accessorFn: (row) => row?.hasCast,
            enableSorting: true,
            id: 'hasCast',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]
}

export const votesTypeToShowOptions = (t: TFunction): IOption[] => {
    return [
        { value: 'onlyMy', label: t('votes.type.toShow.onlyMyVotes') },
        { value: 'everyone', label: t('votes.type.toShow.allVotes') },
    ]
}

export const voteStateOptions = (t: TFunction): IOption[] => {
    return [
        { value: VoteStateOptionEnum.planned, label: t('votes.type.state.planned') },
        { value: VoteStateOptionEnum.canceled, label: t('votes.type.state.canceled') },
        { value: VoteStateOptionEnum.upcomming, label: t('votes.type.state.upcomming') },
        { value: VoteStateOptionEnum.ended, label: t('votes.type.state.ended') },
        { value: VoteStateOptionEnum.summarized, label: t('votes.type.state.summarized') },
        { value: VoteStateOptionEnum.vetoed, label: t('votes.type.state.vetoed') },
    ]
}
