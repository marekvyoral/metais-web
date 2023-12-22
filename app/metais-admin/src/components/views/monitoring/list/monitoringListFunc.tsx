import { IOption } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { MonitoringListColumnsEnum } from './monitoringListProps'

export const getCiListOptions = (ciListData: ConfigurationItemSetUi | undefined): IOption<string>[] => {
    return (
        ciListData?.configurationItemSet?.map((ciListRecord) => {
            return {
                value: ciListRecord?.uuid ?? '',
                label:
                    (ciListRecord?.attributes && `(${ciListRecord?.type ?? ''}) ${ciListRecord?.attributes[ATTRIBUTE_NAME.Gen_Profil_nazov]}`) ?? '',
            }
        }) ?? []
    )
}

export const monitoringListColumns = (t: TFunction): Array<ColumnDef<ApiActiveMonitoringCfg>> => {
    const columnsAll: Array<ColumnDef<ApiActiveMonitoringCfg>> = [
        {
            header: t('monitoring.list.table.isvsName'),
            accessorFn: (row) => row?.isvsName,
            enableSorting: true,
            id: MonitoringListColumnsEnum.NAME,
            size: 400,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },

        {
            header: t('monitoring.list.table.entityType'),
            accessorFn: (row) => row?.entityType,
            enableSorting: true,
            id: MonitoringListColumnsEnum.ENTITY_TYPE,
            size: 150,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpUrl'),
            accessorFn: (row) => row?.httpUrl,
            enableSorting: true,
            id: MonitoringListColumnsEnum.URL,
            size: 100,
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? t('votes.type.yes') : t('votes.type.no')}</span>,
        },
        {
            header: t('monitoring.list.table.httpMethod'),
            accessorFn: (row) => row?.httpMethod,
            enableSorting: true,
            id: MonitoringListColumnsEnum.METHOD,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpRequestHeader'),
            accessorFn: (row) => row?.httpRequestHeader,
            enableSorting: true,
            id: MonitoringListColumnsEnum.REQUEST_HEADER,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpRequestBody'),
            accessorFn: (row) => row?.httpRequestBody,
            enableSorting: true,
            id: MonitoringListColumnsEnum.RESPONSE_BODY_REGEX,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpResponseStatus'),
            accessorFn: (row) => row?.httpResponseStatus,
            enableSorting: true,
            id: MonitoringListColumnsEnum.RESPONSE_STATUS,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpResponseBodyRegex'),
            accessorFn: (row) => row?.httpResponseBodyRegex,
            enableSorting: true,
            id: MonitoringListColumnsEnum.RESPONSE_BODY_REGEX,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.periodicity'),
            accessorFn: (row) => row?.periodicity,
            enableSorting: true,
            id: MonitoringListColumnsEnum.PERIODICITY,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.enabled'),
            accessorFn: (row) => row?.enabled,
            enableSorting: true,
            id: MonitoringListColumnsEnum.ENABLED,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as boolean}</span>,
        },
    ]

    return columnsAll
}
