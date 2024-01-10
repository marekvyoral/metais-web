import { IOption, TextLink } from '@isdd/idsk-ui-kit/index'
import { ConfigurationItemSetUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ApiActiveMonitoringCfg } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MonitoringListColumnsEnum } from './monitoringListProps'

export const getCiListOptions = (ciListData: ConfigurationItemSetUi | undefined): IOption<string>[] =>
    ciListData?.configurationItemSet?.map((ciListRecord) => ({
        value: ciListRecord?.uuid ?? '',
        label: (ciListRecord?.attributes && `(${ciListRecord?.type ?? ''}) ${ciListRecord?.attributes[ATTRIBUTE_NAME.Gen_Profil_nazov]}`) ?? '',
    })) ?? []

const getRequestHeaders = (httpRequestHeader?: Array<[string, string]>) => {
    const headerListNodes = httpRequestHeader?.map((headerData, index) => {
        return (
            <div key={index}>
                {`${headerData?.[0] ?? ''}: `}
                {`${headerData?.[1] ?? ''}`}
            </div>
        )
    })

    return headerListNodes
}

export const monitoringListColumns = (t: TFunction): Array<ColumnDef<ApiActiveMonitoringCfg>> => {
    const columnsAll: Array<ColumnDef<ApiActiveMonitoringCfg>> = [
        {
            header: t('monitoring.list.table.isvsName'),
            accessorFn: (row) => row?.isvsName,
            enableSorting: false,
            id: MonitoringListColumnsEnum.NAME,
            size: 400,
            cell: (ctx) => {
                const { id } = ctx.row.original
                const name = ctx.getValue() as string
                return <TextLink to={`${AdminRouteNames.MONITORING_DETAIL}/${id}`}>{name}</TextLink>
            },
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('monitoring.list.table.entityType'),
            accessorFn: (row) => row?.entityType,
            enableSorting: false,
            id: MonitoringListColumnsEnum.ENTITY_TYPE,
            size: 80,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpUrl'),
            accessorFn: (row) => row?.httpUrl,
            enableSorting: false,
            id: MonitoringListColumnsEnum.URL,
            size: 120,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('monitoring.list.table.httpMethod'),
            accessorFn: (row) => row?.httpMethod,
            enableSorting: false,
            id: MonitoringListColumnsEnum.METHOD,
            size: 100,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpRequestHeader'),
            accessorFn: (row) => row?.httpRequestHeader,
            enableSorting: false,
            id: MonitoringListColumnsEnum.REQUEST_HEADER,
            size: 120,
            cell: (ctx) => <div>{getRequestHeaders(ctx?.getValue?.() as Array<[string, string]>)}</div>,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('monitoring.list.table.httpRequestBody'),
            accessorFn: (row) => row?.httpRequestBody,
            enableSorting: false,
            id: MonitoringListColumnsEnum.REQUEST_BODY,
            size: 120,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('monitoring.list.table.httpResponseStatus'),
            accessorFn: (row) => row?.httpResponseStatus,
            enableSorting: false,
            id: MonitoringListColumnsEnum.RESPONSE_STATUS,
            size: 120,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.httpResponseBodyRegex'),
            accessorFn: (row) => row?.httpResponseBodyRegex,
            enableSorting: false,
            id: MonitoringListColumnsEnum.RESPONSE_BODY_REGEX,
            size: 120,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
        },
        {
            header: t('monitoring.list.table.periodicity'),
            accessorFn: (row) => row?.periodicity,
            enableSorting: false,
            id: MonitoringListColumnsEnum.PERIODICITY,
            size: 120,
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('monitoring.list.table.enabled'),
            accessorFn: (row) => row?.enabled,
            enableSorting: false,
            id: MonitoringListColumnsEnum.ENABLED,
            size: 120,
            cell: (ctx) => <span>{(ctx?.getValue?.() as boolean) ? t('monitoring.type.yes') : t('monitoring.type.no')}</span>,
        },
    ]

    return columnsAll
}
