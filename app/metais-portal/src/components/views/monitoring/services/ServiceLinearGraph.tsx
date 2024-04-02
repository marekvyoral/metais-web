import React, { useEffect, useRef } from 'react'
import { MonitoredValue } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { useWindowSize } from '@isdd/metais-common/hooks/window-size/useWindowSize'
import { useTranslation } from 'react-i18next'

import { createLinearGraph } from './utils'
import styles from './service.module.scss'

interface IServiceLinearGraph {
    data: MonitoredValue[]
}

const ServiceLinearGraph: React.FC<IServiceLinearGraph> = ({ data }) => {
    const { t } = useTranslation()
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
            createLinearGraph(svgRef, data, svgRef.current?.clientWidth ?? 320)
        }
    }, [data, windowSize, svgRef])

    return (
        <>
            <span className="govuk-visually-hidden">
                {t('monitoringServices.detail.graphAria', { button: t('monitoringServices.detail.changeToTable') })}
            </span>
            <div className={styles.graph} ref={svgRef} aria-hidden />
        </>
    )
}

export default ServiceLinearGraph
