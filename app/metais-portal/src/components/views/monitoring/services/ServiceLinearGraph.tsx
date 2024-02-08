import React, { useEffect, useRef } from 'react'
import { MonitoredValue } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useWindowSize } from '@isdd/metais-common/hooks/window-size/useWindowSize'

import { createLinearGraph } from './utils'

interface IServiceLinearGraph {
    data: MonitoredValue[]
}

const ServiceLinearGraph: React.FC<IServiceLinearGraph> = ({ data }) => {
    const svgRef = useRef<HTMLDivElement>(null)

    const windowSize = useWindowSize()
    const clearGraph = () => {
        svgRef.current?.childNodes.forEach((node) => {
            svgRef.current?.removeChild(node)
        })
    }

    useEffect(() => {
        if (data?.length) {
            clearGraph()
            createLinearGraph(svgRef, data, svgRef.current?.clientWidth ?? 400)
        }
    }, [data, windowSize])

    return <div key="graph-service" style={{ width: '100%' }} ref={svgRef} />
}

export default ServiceLinearGraph
