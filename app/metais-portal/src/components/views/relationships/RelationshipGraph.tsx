import { ButtonPopup } from '@isdd/idsk-ui-kit/button-popup/ButtonPopup'
import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { BaseModal } from '@isdd/idsk-ui-kit/modal/BaseModal'
import { ConfigurationItemUi, ConfigurationItemUiAttributes, useListRelatedCiTypes, useReadCiNeighboursWithAllRels } from '@isdd/metais-common/api'
import { QueryFeedback } from '@isdd/metais-common/components/query-feedback/QueryFeedback'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import classnames from 'classnames'
import * as d3 from 'd3'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import styles from './relationshipGraph.module.scss'
import { isRelatedCiTypeCmdbView } from './typeHelper'

import { AttributesContainer } from '@/components/containers/AttributesContainer'
import { CiContainer } from '@/components/containers/CiContainer'
import { CiInformationAccordion } from '@/components/entities/accordion/CiInformationAccordion'
import { drawGraph, exportGraph, filterCiName, getShortName, prepareData } from '@/components/views/relationships/graphHelpers'

interface RelationshipsGraphProps {
    data?: ConfigurationItemUi
}

export interface TypeFilter {
    [key: string]: {
        color: string
        label: string
        selected: boolean
    }
}

export interface CiItem extends d3.SimulationNodeDatum {
    uuid: string
    type: string
    name: string
    valid?: boolean
    color?: string
    attributes?: ConfigurationItemUiAttributes
    shortName?: string
    group?: number
    degree?: number
}

export interface RelsItem extends d3.SimulationLinkDatum<CiItem> {
    uuid: string
    type: string
    startUuid: string
    endUuid: string
    source: CiItem | string
    target: CiItem | string
}

const RelationshipGraph: FC<RelationshipsGraphProps> = ({ data: selectedItem }) => {
    const [target, setTarget] = useState<ConfigurationItemUi | undefined>(selectedItem)
    const [nodeDetail, setNodeDetail] = useState<CiItem | null>(null)
    const [cannotDisplayAll, setCannotDisplayAll] = useState(false)
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const [filterTypes, setFilterTypes] = useState<TypeFilter>({})
    const graphWrapperRef = useRef<HTMLDivElement>(null)

    const { isLoading: isLoadingRelated, isError: isErrorRelated, data: relatedTypes } = useListRelatedCiTypes(target?.type ?? '')
    const types = useMemo(() => (relatedTypes?.cisAsSources || []).concat(relatedTypes?.cisAsTargets || []), [relatedTypes])
    const ciTypes = types
        .filter(function (oneType) {
            return isRelatedCiTypeCmdbView(oneType, !!user)
        })
        .map((type) => type.ciTypeTechnicalName || '')
    const {
        isLoading: isLoadingNeihbours,
        isError: isErrorNeighbours,
        data,
    } = useReadCiNeighboursWithAllRels(target?.uuid ?? '', {
        page: 1,
        perPage: 50,
        state: ['DRAFT'],
        ciTypes: ciTypes.length === 0 ? ['NOT_EXIST_ENTITY'] : ciTypes,
    })
    const ciType = useMemo(() => {
        const result = data?.ciWithRels?.map((rels) => rels.ci?.type)
        result?.push(target?.type)
        return result
    }, [data?.ciWithRels, target?.type])

    const isLoading = isLoadingNeihbours || isLoadingRelated
    const isError = isErrorNeighbours || isErrorRelated
    const zoom = d3
        .zoom<SVGGElement, unknown>()
        .scaleExtent([0, 8])
        .on('zoom', (e) => d3.select(graphWrapperRef.current).select<SVGGElement>('g').attr('transform', e.transform))

    useEffect(() => {
        const result: TypeFilter = {}
        types.forEach((type) => {
            if (ciType?.includes(type.ciTypeTechnicalName) && type.ciTypeTechnicalName && type.ciColor && type.ciTypeName) {
                result[type.ciTypeTechnicalName] = {
                    color: type.ciColor,
                    label: type.ciTypeName,
                    selected: true,
                }
            }
        })
        setFilterTypes(result)
    }, [types, ciType])

    useEffect(() => {
        if (data && target) {
            drawGraph(graphWrapperRef, setTarget, setNodeDetail, zoom, prepareData(data, target, filterTypes))
        }
    }, [data, filterTypes, target, zoom])

    useEffect(() => {
        setCannotDisplayAll(!!(data?.pagination?.totaltems && data?.pagination?.totaltems > 50))
    }, [data?.pagination?.totaltems])

    const onExport = async (type: 'pdf' | 'png', closePopup: () => void) => {
        if (!graphWrapperRef.current) return
        await exportGraph(type, graphWrapperRef.current, `${target?.type}: ${getShortName(target ? filterCiName(target) : '', 350)}`)
        closePopup()
    }

    return (
        <div>
            {cannotDisplayAll && target ? (
                <div>
                    Označená položka {filterCiName(target)} obsahuje príliš veľa prepojení, pridáva sa 50 z celkového počtu{' '}
                    {data?.pagination?.totaltems} prepojení.
                </div>
            ) : null}
            <div className={classnames(styles.graphWrapper, 'idsk-graph')}>
                <div className={styles.buttonRow}>
                    <Button
                        label={
                            <>
                                <i aria-hidden="true" className="fas fa-search-plus govuk-!-margin-right-1" />
                                {t('graph.zoomIn')}
                            </>
                        }
                        onClick={() => {
                            if (graphWrapperRef.current) {
                                const svg = d3.select(graphWrapperRef.current).select<SVGGElement>('g').transition().duration(300)
                                zoom.scaleBy(svg, 1.2)
                            }
                        }}
                        variant="secondary"
                    />
                    <Button
                        onClick={() => {
                            if (graphWrapperRef.current) {
                                const svg = d3.select(graphWrapperRef.current).select<SVGGElement>('g').transition().duration(300)
                                if (svg) zoom.scaleBy(svg, 0.8)
                            }
                        }}
                        label={
                            <>
                                <i aria-hidden="true" className="fas fa-search-minus govuk-!-margin-right-1" />
                                {t('graph.zoomOut')}
                            </>
                        }
                        variant="secondary"
                    />
                </div>
                <QueryFeedback loading={isLoading} error={isError}>
                    <div id="graph-relationship" ref={graphWrapperRef} />
                </QueryFeedback>
                <div className={styles.legend}>
                    {Object.keys(filterTypes).map((key) => {
                        const type = filterTypes[key]
                        return (
                            <div key={key}>
                                <span style={{ backgroundColor: type.color }} className={classnames(styles.legendIcon, 'govuk-!-margin-right-1')} />
                                {type.label}
                            </div>
                        )
                    })}
                </div>
                <div className="idsk-graph__meta">
                    <div className={classnames(styles.buttonRow, 'idsk-graph__meta-download-share')}>
                        <ButtonPopup
                            buttonLabel={'Export'}
                            popupContent={(closePopup) => (
                                <div>
                                    <div>
                                        <Button label={t('graph.exportPNG')} variant="secondary" onClick={() => onExport('png', closePopup)} />
                                    </div>
                                    <div>
                                        <Button
                                            label={t('graph.exportPDF')}
                                            variant="secondary"
                                            className="govuk-!-margin-bottom-1"
                                            onClick={() => onExport('pdf', closePopup)}
                                        />
                                    </div>
                                </div>
                            )}
                        />

                        <ButtonPopup
                            buttonLabel={'Type'}
                            popupContent={(closePopup) => (
                                <div className={styles.typeFilter}>
                                    {Object.keys(filterTypes).map((key) => {
                                        const type = filterTypes[key]
                                        return (
                                            <div key={key} className="govuk-!-margin-bottom-2 govuk-checkboxes govuk-checkboxes--small">
                                                <CheckBox
                                                    id={key}
                                                    label={type.label}
                                                    name={key}
                                                    checked={type.selected}
                                                    onClick={() => {
                                                        setFilterTypes({
                                                            ...filterTypes,
                                                            [key]: {
                                                                ...type,
                                                                selected: !type.selected,
                                                            },
                                                        })
                                                        closePopup()
                                                    }}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </div>
            <BaseModal isOpen={nodeDetail !== null} close={() => setNodeDetail(null)}>
                <div className={styles.modalContent}>
                    {nodeDetail && (
                        <CiContainer
                            configurationItemId={nodeDetail.uuid ?? ''}
                            View={({ data: ciData }) => {
                                const ciItemData = ciData?.ciItemData
                                const gestorData = ciData?.gestorData
                                return (
                                    <AttributesContainer
                                        entityName={nodeDetail.type ?? ''}
                                        View={({ data: { ciTypeData, constraintsData, unitsData } }) => {
                                            return (
                                                <CiInformationAccordion data={{ ciItemData, gestorData, constraintsData, ciTypeData, unitsData }} />
                                            )
                                        }}
                                    />
                                )
                            }}
                        />
                    )}
                </div>
            </BaseModal>
        </div>
    )
}

export default RelationshipGraph