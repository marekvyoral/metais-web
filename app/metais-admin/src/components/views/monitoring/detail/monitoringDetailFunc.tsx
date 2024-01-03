import { ApiActiveMonitoringLog } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { MonitoringDetailLogColumnsEnum } from './monitoringDetailProps'

export const monitoringDetailLogColumns = (t: TFunction): Array<ColumnDef<ApiActiveMonitoringLog>> => {
    const columnsAll: Array<ColumnDef<ApiActiveMonitoringLog>> = [
        {
            header: t('monitoring.detail.table.intervalStart'),
            accessorFn: (row) => row?.intervalStart,
            enableSorting: false,
            id: MonitoringDetailLogColumnsEnum.INTERVAL_START,
            size: 250,
            cell: (ctx) => <span>{t('dateTime', { date: ctx.getValue() as string })}</span>,
            meta: { getCellContext: (ctx) => t('dateTime', { date: ctx.getValue() as string }) },
        },
        {
            header: t('monitoring.detail.table.intervalEnd'),
            accessorFn: (row) => row?.intervalEnd,
            enableSorting: false,
            id: MonitoringDetailLogColumnsEnum.INTERVAL_END,
            size: 250,
            cell: (ctx) => <span>{t('dateTime', { date: ctx.getValue() as string })}</span>,
            meta: { getCellContext: (ctx) => t('dateTime', { date: ctx.getValue() as string }) },
        },
        {
            header: t('monitoring.detail.table.status'),
            accessorFn: (row) => row?.status,
            enableSorting: false,
            id: MonitoringDetailLogColumnsEnum.STATUS,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
    ]

    return columnsAll
}
