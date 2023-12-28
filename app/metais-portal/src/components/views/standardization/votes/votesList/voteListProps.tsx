import { IOption, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreview } from '@isdd/metais-common/api/generated/standards-swagger'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { VoteStateOptionEnum, VotesListColumnsEnum } from '../voteProps'

export enum VotesListShowEnum {
    EVERYONE = 'everyone',
    ONLY_MY = 'onlyMy',
}

export const voteListColumns = (t: TFunction, isUserLogged: boolean): Array<ColumnDef<ApiVotePreview>> => {
    const columnsAll: Array<ColumnDef<ApiVotePreview>> = [
        {
            header: t('votes.votesList.table.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: VotesListColumnsEnum.NAME,
            size: 400,
            cell: (ctx) => {
                const { id } = ctx.row.original
                const name = ctx.getValue() as string
                return <TextLink to={`${NavigationSubRoutes.ZOZNAM_HLASOV_DETAIL}/${id}`}>{name}</TextLink>
            },
        },
        {
            header: t('votes.votesList.table.effectiveFrom'),
            accessorFn: (row) => row?.effectiveFrom,
            enableSorting: true,
            id: VotesListColumnsEnum.EFFECTIVE_FROM,
            size: 150,
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.table.effectiveTo'),
            accessorFn: (row) => row?.effectiveTo,
            enableSorting: true,
            id: VotesListColumnsEnum.EFFECTIVE_TO,
            size: 150,
            cell: (ctx) => t('date', { date: ctx.getValue() as string }),
        },
        {
            header: t('votes.votesList.table.voteState'),
            accessorFn: (row) => row?.voteState,
            enableSorting: true,
            id: VotesListColumnsEnum.VOTE_STATE,
            size: 150,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('votes.votesList.table.canCast'),
            accessorFn: (row) => row?.canCast,
            enableSorting: true,
            id: VotesListColumnsEnum.CAN_CAST,
            size: 100,
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? t('votes.type.yes') : t('votes.type.no')}</span>,
        },
        {
            header: t('votes.votesList.table.hasCast'),
            accessorFn: (row) => row?.hasCast,
            enableSorting: true,
            id: VotesListColumnsEnum.HAS_CAST,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]

    if (!isUserLogged) {
        return columnsAll.filter((column) => column.id != VotesListColumnsEnum.CAN_CAST && column.id != VotesListColumnsEnum.CAN_CAST)
    }
    return columnsAll
}

export const votesTypeToShowOptions = (t: TFunction): IOption<string>[] => {
    return [
        { value: VotesListShowEnum.ONLY_MY, label: t('votes.type.toShow.onlyMyVotes') },
        { value: VotesListShowEnum.EVERYONE, label: t('votes.type.toShow.allVotes') },
    ]
}

export const voteStateOptions = (t: TFunction): IOption<string>[] => {
    return [
        { value: VoteStateOptionEnum.PLANNED, label: t('votes.type.state.planned') },
        { value: VoteStateOptionEnum.CANCELED, label: t('votes.type.state.canceled') },
        { value: VoteStateOptionEnum.UPCOMING, label: t('votes.type.state.upcoming') },
        { value: VoteStateOptionEnum.ENDED, label: t('votes.type.state.ended') },
        { value: VoteStateOptionEnum.SUMMARIZED, label: t('votes.type.state.summarized') },
        { value: VoteStateOptionEnum.VETOED, label: t('votes.type.state.vetoed') },
    ]
}

export const voteStateWithoutDate = [VoteStateOptionEnum.PLANNED, VoteStateOptionEnum.UPCOMING, VoteStateOptionEnum.ENDED]
