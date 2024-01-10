import React from 'react'

import { MonitoringComposeContainer } from '@/components/containers/Monitoring/crete-edit/MonitoringComposeContainer'
import { MonitoringComposeView } from '@/components/views/monitoring/compose'

const MonitoringCreatePage = () => {
    return (
        <MonitoringComposeContainer
            View={(props) => (
                <MonitoringComposeView
                    monitoringCfgData={props.monitoringCfgData}
                    isCreateLoading={props.isCreateLoading}
                    createMonitoringRecord={props.createMonitoringRecord}
                    updateMonitoringRecord={props.updateMonitoringRecord}
                    loadOptions={props.loadOptions}
                />
            )}
            id={0}
        />
    )
}

export default MonitoringCreatePage
