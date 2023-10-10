import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export type PendingChangeData = {
    id: number
    date: string
    desctription: string
}
export const voteActorPendingChangesColumns = (t: TFunction): Array<ColumnDef<PendingChangeData>> => {
    const columns: Array<ColumnDef<PendingChangeData>> = [
        {
            header: t('votes.voteDetail.changeDate'),
            accessorFn: (row) => row?.date,
            enableSorting: true,
            id: 'date',
            size: 100,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
        {
            header: t('votes.voteDetail.changeDescription'),
            accessorFn: (row) => row?.desctription,
            enableSorting: true,
            id: 'description',
            size: 300,
            cell: (ctx) => {
                const contentText = ctx.getValue() as string
                return <span>{contentText}</span>
            },
        },
    ]

    return columns
}
