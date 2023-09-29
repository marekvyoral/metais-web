import { IOption, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreview } from '@isdd/metais-common/api'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export enum VotesListShowEnum {
    everyone = 'everyone',
    onlyMy = 'onlyMy',
}

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

export enum VotesListColumnsEnum {
    name = 'name',
    effectiveFrom = 'effectiveFrom',
    effectiveTo = 'effectiveTo',
    voteState = 'voteState',
    canCast = 'canCast',
    hasCast = 'hasCast',
}

export const voteListColumns = (t: TFunction, isUserLogged: boolean): Array<ColumnDef<ApiVotePreview>> => {
    const columnsAll: Array<ColumnDef<ApiVotePreview>> = [
        {
            header: t('votes.votesList.table.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: VotesListColumnsEnum.name,
            size: 400,
            cell: (ctx) => {
                const { id } = ctx.row.original
                const name = ctx.getValue() as string
                return <TextLink to={`${NavigationSubRoutes.VOTE_DETAIL}/${id}`}>{name}</TextLink>
            },
        },
        {
            header: t('votes.votesList.table.effectiveFrom'),
            accessorFn: (row) => row?.effectiveFrom,
            enableSorting: true,
            id: VotesListColumnsEnum.effectiveFrom,
            size: 150,
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.table.effectiveTo'),
            accessorFn: (row) => row?.effectiveTo,
            enableSorting: true,
            id: VotesListColumnsEnum.effectiveTo,
            size: 150,
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.table.voteState'),
            accessorFn: (row) => row?.voteState,
            enableSorting: true,
            id: VotesListColumnsEnum.voteState,
            size: 150,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('votes.votesList.table.canCast'),
            accessorFn: (row) => row?.canCast,
            enableSorting: true,
            id: VotesListColumnsEnum.canCast,
            size: 100,
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? 'true' : 'false'}</span>,
        },
        {
            header: t('votes.votesList.table.hasCast'),
            accessorFn: (row) => row?.hasCast,
            enableSorting: true,
            id: VotesListColumnsEnum.hasCast,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]

    if (!isUserLogged) {
        return columnsAll.filter((column) => column.id != VotesListColumnsEnum.canCast && column.id != VotesListColumnsEnum.hasCast)
    }
    return columnsAll
}

export const votesTypeToShowOptions = (t: TFunction): IOption[] => {
    return [
        { value: VotesListShowEnum.onlyMy, label: t('votes.type.toShow.onlyMyVotes') },
        { value: VotesListShowEnum.everyone, label: t('votes.type.toShow.allVotes') },
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
