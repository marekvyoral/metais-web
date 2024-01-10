import React from 'react'
import { useParams } from 'react-router-dom'

import { MonitoringComposeContainer } from '@/components/containers/Monitoring/crete-edit/MonitoringComposeContainer'
import { MonitoringComposeView } from '@/components/views/monitoring/compose'

const MonitoringEditPage = () => {
    const { id } = useParams()
    return (
        <MonitoringComposeContainer
            View={(props) => (
                <MonitoringComposeView
                    monitoringCfgData={props.monitoringCfgData}
                    isCreateLoading={props.isCreateLoading}
                    ciDefaultValue={props.ciDefaultValue}
                    createMonitoringRecord={props.createMonitoringRecord}
                    updateMonitoringRecord={props.updateMonitoringRecord}
                    loadOptions={props.loadOptions}
                />
            )}
            id={Number(id)}
        />
    )
}

export default MonitoringEditPage
