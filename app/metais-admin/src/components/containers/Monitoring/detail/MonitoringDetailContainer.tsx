import {
    ApiActiveMonitoringResult,
    FindActiveMonitoringLogParams,
    useCallIsvsEndpointHook,
    useFindActiveMonitoringLog,
    useGet,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useMemo, useState } from 'react'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'

import { IMonitoringDetailView, IMonitoringLogFilterData } from '@/components/views/monitoring/detail'
import { MainContentWrapper } from '@/components/MainContentWrapper'

interface MonitoringDetailContainer {
    View: React.FC<IMonitoringDetailView>
    id: number
}

export const MonitoringDetailContainer: React.FC<MonitoringDetailContainer> = ({ View, id }) => {
    const defaultFilterValues: IMonitoringLogFilterData = {
        activeMonitoringCfgId: id,
    }
    const { t } = useTranslation()
    const { data: monitoringCfgData, isLoading: monitoringCfgLoading, isError: monitoringCfgError, refetch: monitoringCfgRefetch } = useGet(id)
    const { filter, handleFilterChange } = useFilterParams<IMonitoringLogFilterData>(defaultFilterValues)

    const monitoringCfgParamValues = useMemo((): FindActiveMonitoringLogParams => {
        const monitoringParams: FindActiveMonitoringLogParams = {
            activeMonitoringCfgId: id,
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
        }
        return monitoringParams
    }, [filter.pageNumber, filter.pageSize, id])

    const {
        data: monitoringLogData,
        isLoading: monitoringLogLoading,
        isFetching: monitoringLogFetching,
        isError: monitoringLogError,
        // refetch: getMonitoringLogRefetch,
    } = useFindActiveMonitoringLog(monitoringCfgParamValues)

    // const refetchData = async () => {
    //     await monitoringCfgRefetch()
    // }

    const callIsvsEndpoint = useCallIsvsEndpointHook()
    const [isCallingEndpoint, setIsCallingEndpoint] = useState<boolean>(false)
    const [isErrorInEndpointCall, setIsErrorInEndpointCall] = useState<boolean>(false)

    const callEndpoint = async () => {
        try {
            setIsCallingEndpoint(true)
            isErrorInEndpointCall && setIsErrorInEndpointCall(false)
            const result: ApiActiveMonitoringResult = await callIsvsEndpoint(id)
            setIsCallingEndpoint(false)
            return result
        } catch {
            setIsErrorInEndpointCall(true)
        }
        setIsCallingEndpoint(false)
        return undefined
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('monitoring.breadcrumbs.home'), href: AdminRouteNames.HOME, icon: HomeIcon },
                    { label: t('monitoring.breadcrumbs.monitoring'), href: AdminRouteNames.MONITORING },
                    { label: t('monitoring.breadcrumbs.list'), href: AdminRouteNames.MONITORING_LIST },
                    {
                        label: monitoringCfgData?.isvsName ?? `${t('monitoring.breadcrumbs.detail')}`,
                        href: `${AdminRouteNames.MONITORING_DETAIL}/${id}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <QueryFeedback loading={monitoringCfgLoading} error={monitoringCfgError || monitoringLogError} indicatorProps={{ layer: 'parent' }}>
                    <View
                        monitoringCfgData={monitoringCfgData}
                        monitoringLogData={monitoringLogData}
                        filter={filter}
                        defaultFilterValues={defaultFilterValues}
                        isLoadingLog={monitoringLogLoading || monitoringLogFetching}
                        isErrorInEndpointCall={isErrorInEndpointCall}
                        handleFilterChange={handleFilterChange}
                        callEndpoint={callEndpoint}
                        isCallingEndpoint={isCallingEndpoint}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
