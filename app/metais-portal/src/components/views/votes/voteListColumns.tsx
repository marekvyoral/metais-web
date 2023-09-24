import { TextLink } from '@isdd/idsk-ui-kit/index'
import { ApiVotePreview } from '@isdd/metais-common/api'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export const columns = (t: TFunction): Array<ColumnDef<ApiVotePreview>> => {
    return [
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
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? 'true' : 'false'}</span>,
        },
        {
            header: t('voteslist.hascast'),
            accessorFn: (row) => row?.hasCast,
            enableSorting: true,
            id: 'hascast',
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]
}
