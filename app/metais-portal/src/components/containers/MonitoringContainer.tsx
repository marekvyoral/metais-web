import React from 'react'

interface MonitoringData {
    text: string
}

export interface MonitoringViewProps {
    data: MonitoringData
}

interface MonitoringContainerProps {
    View: React.FC<MonitoringViewProps>
}

export const MonitoringContainer: React.FC<MonitoringContainerProps> = ({ View }) => {
    const data = {
        text: 'Text',
    }

    return <View data={data} />
}
