import {
    ApiActiveMonitoringResult,
    FindActiveMonitoringLogParams,
    useCallIsvsEndpointHook,
    useDelete,
    useFindActiveMonitoringLog,
    useGet,
} from '@isdd/metais-common/api/generated/monitoring-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect, useMemo, useState } from 'react'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useNavigate } from 'react-router-dom'

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
    const { setIsActionSuccess } = useActionSuccess()
    const navigate = useNavigate()
    const {
        data: monitoringCfgData,
        isLoading: monitoringCfgLoading,
        isFetching: monitoringCfgFetching,
        isError: monitoringCfgError,
        refetch: monitoringCfgRefetch,
    } = useGet(id)

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
        refetch: getMonitoringLogRefetch,
    } = useFindActiveMonitoringLog(monitoringCfgParamValues)

    const refetchData = async () => {
        await monitoringCfgRefetch()
        await getMonitoringLogRefetch()
    }

    useEffect(() => {
        refetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const callIsvsEndpoint = useCallIsvsEndpointHook()
    const [isCallingEndpoint, setIsCallingEndpoint] = useState<boolean>(false)
    const [isErrorInEndpointCall, setIsErrorInEndpointCall] = useState<boolean>(false)

    const callEndpoint = async () => {
        try {
            setIsCallingEndpoint(true)
            isErrorInEndpointCall && setIsErrorInEndpointCall(false)
            const result: ApiActiveMonitoringResult = await callIsvsEndpoint(id)
            setIsCallingEndpoint(false)
            refetchData()
            return result
        } catch {
            setIsErrorInEndpointCall(true)
        }
        setIsCallingEndpoint(false)
        return undefined
    }

    const {
        isLoading: deleteMonitoringRecordLoading,
        isError: deleteMonitoringRecordError,
        status: deleteMonitoringRecordStatus,
        mutateAsync: deleteMonitoringRecordAsyncMutation,
    } = useDelete()

    const deleteMonitoringRecord = async () => {
        await deleteMonitoringRecordAsyncMutation({ id })
    }

    useEffect(() => {
        if (deleteMonitoringRecordStatus == 'success') {
            setIsActionSuccess({
                value: true,
                path: AdminRouteNames.MONITORING_LIST,
                additionalInfo: { type: 'delete' },
            })
            navigate(`${AdminRouteNames.MONITORING_LIST}`)
        }
    }, [navigate, setIsActionSuccess, deleteMonitoringRecordStatus])

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
                <QueryFeedback
                    loading={monitoringCfgLoading || deleteMonitoringRecordLoading || monitoringCfgFetching}
                    error={monitoringCfgError || monitoringLogError || deleteMonitoringRecordError}
                    indicatorProps={{ layer: 'parent', transparentMask: false }}
                    withChildren
                >
                    <View
                        monitoringCfgData={monitoringCfgData}
                        monitoringLogData={monitoringLogData}
                        filter={filter}
                        defaultFilterValues={defaultFilterValues}
                        isLoadingLog={monitoringLogLoading || monitoringLogFetching}
                        isCallingEndpoint={isCallingEndpoint}
                        isErrorInEndpointCall={isErrorInEndpointCall}
                        handleFilterChange={handleFilterChange}
                        callEndpoint={callEndpoint}
                        deleteMonitoringRecord={deleteMonitoringRecord}
                    />
                </QueryFeedback>
            </MainContentWrapper>
        </>
    )
}
