import React from 'react'
import { useParams } from 'react-router-dom'

import { MonitoringDetailContainer } from '@/components/containers/Monitoring/detail/MonitoringDetailContainer'
import { MonitoringDetailView } from '@/components/views/monitoring/detail'

const MonitoringDetail: React.FC = () => {
    const { id } = useParams()
    return (
        <>
            <MonitoringDetailContainer
                View={(props) => (
                    <MonitoringDetailView
                        monitoringCfgData={props.monitoringCfgData}
                        monitoringLogData={props.monitoringLogData}
                        isLoadingLog={props.isLoadingLog}
                        isCallingEndpoint={props.isCallingEndpoint}
                        isErrorInEndpointCall={props.isErrorInEndpointCall}
                        filter={props.filter}
                        defaultFilterValues={props.defaultFilterValues}
                        handleFilterChange={props.handleFilterChange}
                        callEndpoint={props.callEndpoint}
                        deleteMonitoringRecord={props.deleteMonitoringRecord}
                    />
                )}
                id={Number(id)}
            />
        </>
    )
}

export default MonitoringDetail
