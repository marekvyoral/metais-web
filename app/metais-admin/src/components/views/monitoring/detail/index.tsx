import { Button, PaginatorWrapper, Table, TextHeading } from '@isdd/idsk-ui-kit/index'
import { ActionsOverTable, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    ApiActiveMonitoringCfg,
    ApiActiveMonitoringLog,
    ApiActiveMonitoringLogList,
    ApiActiveMonitoringResult,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { useState } from 'react'
import { Spacer } from '@isdd/metais-common/components/spacer/Spacer'

import styles from '../monitoring.module.scss'

import { getRequestHeaders, monitoringDetailLogColumns } from './monitoringDetailFunc'
import { CallEndpointResultModal } from './CallEndpointResultModal'
export interface IMonitoringLogFilterData extends IFilterParams, IFilter {
    activeMonitoringCfgId: number
}

export interface IMonitoringDetailView {
    monitoringCfgData?: ApiActiveMonitoringCfg
    monitoringLogData?: ApiActiveMonitoringLogList
    filter: IFilter
    defaultFilterValues: IMonitoringLogFilterData
    isErrorInEndpointCall: boolean
    isLoadingLog: boolean
    isCallingEndpoint: boolean
    handleFilterChange: (filter: IFilter) => void
    callEndpoint: () => Promise<ApiActiveMonitoringResult | undefined>
    deleteMonitoringRecord: () => Promise<void>
}

export const MonitoringDetailView: React.FC<IMonitoringDetailView> = ({
    monitoringCfgData,
    monitoringLogData,
    isLoadingLog,
    isCallingEndpoint,
    isErrorInEndpointCall,
    filter,
    handleFilterChange,
    callEndpoint,
    deleteMonitoringRecord,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const [callEndpointResult, setCallEndpointResult] = useState<ApiActiveMonitoringResult | undefined>(undefined)

    const editMonitoringHandler = () => {
        navigate(`${AdminRouteNames.MONITORING_EDIT}/${monitoringCfgData?.id ?? ''}`, { state: { from: location } })
    }

    const closeCallEndpointResultModal = () => {
        setCallEndpointResult(undefined)
    }

    const handleCallEndpoint = async () => {
        const result = await callEndpoint()
        setCallEndpointResult(result)
    }

    return (
        <>
            <CallEndpointResultModal callEndpointResult={callEndpointResult} close={closeCallEndpointResultModal} />

            <div className={styles.inlineSpaceBetween}>
                <TextHeading size="XL">{monitoringCfgData?.isvsName ?? `${t('monitoring.detail.heading')}`}</TextHeading>
                <div className={styles.inlineSpaceBetween}>
                    <Button type="submit" label={t('monitoring.detail.edit')} onClick={editMonitoringHandler} />
                    <Spacer horizontal />
                    <Button type="submit" label={t('monitoring.detail.delete')} onClick={deleteMonitoringRecord} />
                </div>
            </div>
            <InformationGridRow label={monitoringCfgData?.entityType ?? ''} value={monitoringCfgData?.isvsName} hideIcon />
            <InformationGridRow label={t('monitoring.detail.info.httpUrl')} value={monitoringCfgData?.httpUrl} hideIcon />
            <InformationGridRow label={t('monitoring.detail.info.httpMethod')} value={monitoringCfgData?.httpMethod} hideIcon />
            <InformationGridRow
                label={t('monitoring.detail.info.httpRequestHeader')}
                value={getRequestHeaders(monitoringCfgData?.httpRequestHeader)}
                hideIcon
            />
            <InformationGridRow label={t('monitoring.detail.info.httpRequestBody')} value={monitoringCfgData?.httpRequestBody} hideIcon />
            <InformationGridRow label={t('monitoring.detail.info.httpResponseStatus')} value={monitoringCfgData?.httpResponseStatus} hideIcon />
            <InformationGridRow label={t('monitoring.detail.info.httpResponseBodyRegex')} value={monitoringCfgData?.httpResponseBodyRegex} hideIcon />
            <InformationGridRow label={t('monitoring.detail.info.periodicity')} value={monitoringCfgData?.periodicity} hideIcon />
            <InformationGridRow
                label={t('monitoring.detail.info.enabled')}
                value={monitoringCfgData?.enabled ? t('monitoring.type.yes') : t('monitoring.type.no')}
                hideIcon
            />
            <Spacer vertical />
            <QueryFeedback
                loading={isCallingEndpoint}
                error={isErrorInEndpointCall}
                withChildren
                indicatorProps={{ layer: 'parent', transparentMask: false, label: t('monitoring.detail.callingEndpointMessage') }}
            >
                <Button type="submit" label={t('monitoring.detail.callEndpoint')} onClick={handleCallEndpoint} />
            </QueryFeedback>
            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber || BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize || BASE_PAGE_SIZE,
                    dataLength: monitoringLogData?.pagination?.totalItems || 0,
                }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName=""
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <QueryFeedback loading={isLoadingLog} withChildren indicatorProps={{ layer: 'parent', transparentMask: false }}>
                <Table<ApiActiveMonitoringLog>
                    data={monitoringLogData?.results}
                    columns={monitoringDetailLogColumns(t)}
                    sort={filter.sort ?? []}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
            </QueryFeedback>
            <PaginatorWrapper
                pageNumber={filter.pageNumber || BASE_PAGE_NUMBER}
                pageSize={filter.pageSize || BASE_PAGE_SIZE}
                dataLength={monitoringLogData?.pagination?.totalItems || 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
