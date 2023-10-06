import { ApiVoteActor, ApiVoteActorResult } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export enum VotesListColumnsEnum {
    name = 'NAME',
    userOrgName = 'USER_ORG_NAME',
    role = 'ROLE',
}

export const voteActorsColumns = (t: TFunction): Array<ColumnDef<ApiVoteActor>> => {
    const columns: Array<ColumnDef<ApiVoteActorResult>> = [
        {
            header: t('votes.voteDetail.table.name'),
            accessorFn: (row) => row?.userName,
            enableSorting: true,
            id: VotesListColumnsEnum.name,
            size: 200,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
        {
            header: t('votes.voteDetail.table.organization'),
            accessorFn: (row) => row?.userOrgName,
            enableSorting: true,
            id: VotesListColumnsEnum.userOrgName,
            size: 300,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
        {
            header: t('votes.voteDetail.table.role'),
            accessorFn: (row) => row?.userRoleDesc,
            enableSorting: true,
            id: VotesListColumnsEnum.role,
            size: 150,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
    ]

    return columns
}
