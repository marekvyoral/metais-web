import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit/index'
import { DefinitionListItem } from '@isdd/metais-common/components/definition-list/DefinitionListItem'

import { IRelationItem } from '@/components/containers/HistorySingleItemCompareContainer'

interface IRelationCompareItemViewProps {
    label: string
    tooltip: string
    dataRelationFirst?: IRelationItem[]
    dataRelationSecond?: IRelationItem[]
    isSimple?: boolean
    withoutCompare?: boolean
    showOnlyChanges?: boolean
}

export const RelationCompareItemView: React.FC<IRelationCompareItemViewProps> = ({
    showOnlyChanges,
    dataRelationFirst,
    dataRelationSecond,
    isSimple,
}) => {
    const columns: Array<ColumnDef<IRelationItem>> = [
        {
            header: '',
            accessorFn: (row) => row?.name,
            enableSorting: false,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => `${ctx?.row?.original?.type}: ${ctx?.row?.original?.name}`,
        },
    ]
    const columnsSec: Array<ColumnDef<IRelationItem>> = [
        {
            header: '',
            accessorFn: (row) => row?.name,
            enableSorting: false,
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (ctx) => `${ctx?.row?.original?.type}: ${ctx?.row?.original?.name}`,
        },
    ]

    const isDiff = (): boolean => {
        if (Array.isArray(dataRelationFirst) && Array.isArray(dataRelationSecond)) {
            if (dataRelationFirst.length !== dataRelationSecond.length) {
                return true
            }

            for (let i = 0; i < dataRelationFirst.length; i++) {
                if (
                    dataRelationFirst[i]?.name !== dataRelationSecond[i]?.name ||
                    dataRelationFirst[i]?.type !== dataRelationSecond[i]?.type ||
                    dataRelationFirst[i]?.uuid !== dataRelationSecond[i]?.uuid
                ) {
                    return true
                }
            }
        }

        return false
    }
    return showOnlyChanges && !isDiff() ? (
        <></>
    ) : (
        <DefinitionListItem
            value={
                <>
                    <Table columns={columns.map((item) => ({ ...item, size: 100 }))} data={dataRelationFirst} />
                </>
            }
            secColValue={
                !isSimple && (
                    <>
                        <Table columns={columnsSec.map((item) => ({ ...item, size: 100 }))} data={dataRelationSecond} />
                    </>
                )
            }
            label={undefined}
        />
    )
}
