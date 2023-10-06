import { IOption, InfoIcon, TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreview } from '@isdd/metais-common/api'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

import { VoteStateOptionEnum, VotesListColumnsEnum } from '../voteProps'

import styles from './votelist.module.scss'
export enum VotesListShowEnum {
    EVERYONE = 'EVERYONE',
    ONLY_MY = 'ONLY_MY',
}

export const voteListColumns = (t: TFunction, isUserLogged: boolean): Array<ColumnDef<ApiVotePreview>> => {
    const columnsAll: Array<ColumnDef<ApiVotePreview>> = [
        {
            header: () => {
                return (
                    <>
                        {!isUserLogged && (
                            <Tooltip
                                tooltipContent={(open, close) => <img onMouseOver={open} onMouseOut={close} src={InfoIcon} />}
                                descriptionElement={t('votes.votesList.tooltipText')}
                                position={'top left'}
                                arrow={false}
                            />
                        )}
                        <span className={styles.tooltipIcon}>{t('votes.votesList.table.name')}</span>
                    </>
                )
            },
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: VotesListColumnsEnum.NAME,
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
            id: VotesListColumnsEnum.CAN_CAST,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]

    if (!isUserLogged) {
        return columnsAll.filter((column) => column.id != VotesListColumnsEnum.CAN_CAST && column.id != VotesListColumnsEnum.CAN_CAST)
    }
    return columnsAll
}

export const votesTypeToShowOptions = (t: TFunction): IOption[] => {
    return [
        { value: VotesListShowEnum.ONLY_MY, label: t('votes.type.toShow.onlyMyVotes') },
        { value: VotesListShowEnum.EVERYONE, label: t('votes.type.toShow.allVotes') },
    ]
}

export const voteStateOptions = (t: TFunction): IOption[] => {
    return [
        { value: VoteStateOptionEnum.PLANNED, label: t('votes.type.state.planned') },
        { value: VoteStateOptionEnum.CANCELED, label: t('votes.type.state.canceled') },
        { value: VoteStateOptionEnum.UPCOMMING, label: t('votes.type.state.upcomming') },
        { value: VoteStateOptionEnum.ENDED, label: t('votes.type.state.ended') },
        { value: VoteStateOptionEnum.SUMMARIZED, label: t('votes.type.state.summarized') },
        { value: VoteStateOptionEnum.VETOED, label: t('votes.type.state.vetoed') },
    ]
}
