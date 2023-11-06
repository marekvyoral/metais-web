import * as d3 from 'd3'
import React, { MouseEvent, RefObject } from 'react'
import Canvg from 'canvg'
import { jsPDF } from 'jspdf'
import { CiWithRelsResultUi, CiWithRelsUi, ConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

import { CiItem, RelsItem, TypeFilter } from './RelationshipGraph'

import styles from '@/components/views/relationships/relationshipGraph.module.scss'

interface GraphData {
    nodes: CiItem[]
    links: RelsItem[]
    total: number
}

export const tooltip_out = (tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, never>, delay = 1500) => {
    return tooltip.transition().delay(delay).style('visibility', 'hidden')
}

export const drag = (
    simulation: d3.Simulation<CiItem, RelsItem>,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, never>,
): d3.DragBehavior<SVGGElement, CiItem, CiItem> => {
    function dragstarted(event: d3.D3DragEvent<SVGGElement, CiItem, CiItem>) {
        tooltip_out(tooltip, 0)
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, CiItem, CiItem>) {
        tooltip_out(tooltip, 0)
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, CiItem, CiItem>) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    return d3.drag<SVGGElement, CiItem, CiItem>().on('start', dragstarted).on('drag', dragged).on('end', dragended)
}

export const tooltip_in = (
    event: MouseEvent<SVGCircleElement>,
    d: CiItem,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, never>,
    setNodeDetail: React.Dispatch<React.SetStateAction<CiItem | null>>,
) => {
    tooltip_out(tooltip, 0)
    return tooltip
        .html('<div><p>' + '(' + d.type + ') ' + d.name + '</p><a data-id="' + d.uuid + '"><i class="fa fa-external-link"></i> Detail</a></div>')
        .on('click', (e) => {
            const id = e.target.getAttribute('data-id')
            if (id) setNodeDetail(d)
        })
        .transition()
        .duration(200)
        .style('visibility', 'visible')
        .style('top', event.pageY + 'px')
        .style('left', event.pageX + 'px')
}
export const ticked = (link: d3.Selection<SVGLineElement, RelsItem, SVGGElement, unknown>) => {
    link.attr('x1', (d: RelsItem) => {
        if (typeof d.source !== 'string') {
            return d.source.x || 0
        }
        return 0
    })
        .attr('y1', (d: RelsItem) => {
            if (typeof d.source !== 'string') {
                return d.source.y || 0
            }
            return 0
        })
        .attr('x2', (d: RelsItem) => {
            if (typeof d.target !== 'string') {
                return d.target.x || 0
            }
            return 0
        })
        .attr('y2', (d: RelsItem) => {
            if (typeof d.target !== 'string') {
                return d.target.y || 0
            }
            return 0
        })

    d3.selectAll<SVGTextElement, CiItem>('text')
        .attr('x', (d: CiItem) => d.x || 0)
        .attr('y', (d: CiItem) => d.y || 0)

    d3.selectAll<SVGCircleElement, CiItem>('circle')
        .attr('cx', (d: CiItem) => d.x || 0)
        .attr('cy', (d: CiItem) => d.y || 0)
}

function adjustPdfImageSize(width: number, height: number) {
    const WIDHT_LIMIT = 800

    if (width <= WIDHT_LIMIT) {
        return { w: width, h: height }
    }

    const z = WIDHT_LIMIT / width
    return { w: z * width, h: z * height * 1.1 }
}

function download(base64EncodedData: string, filename: string) {
    const a = document.createElement('a')
    a.download = filename
    a.href = base64EncodedData
    document.body.appendChild(a)
    a.click()
    a.remove()
}

export const exportGraph = async (type: 'pdf' | 'png', graphRef: HTMLDivElement, title: string) => {
    if (!graphRef) return
    const svg = graphRef.querySelector('svg')
    if (!svg) return

    const html = graphRef.innerHTML.trim()

    let width = graphRef.clientWidth
    let height = graphRef.clientHeight

    const pageW = width
    const pageH = height

    const node = svg.querySelector('g g .node')
    if (node) {
        const bounding = node.getBoundingClientRect()
        width = bounding.width + 50
        height = bounding.height + 50
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) return

    const res = Canvg.fromString(context, html, {
        scaleWidth: pageW,
        scaleHeight: pageH,
        ignoreDimensions: false,
    })
    res.start()

    context.font = '14px Arial'
    context.fillText(title, 35, 20)
    const canvasdata = await canvas.toDataURL('image/png')

    if (type == 'pdf') {
        const doc = new jsPDF('landscape', 'pt', 'a4')
        const size = adjustPdfImageSize(pageW, pageH)

        doc.addImage(canvasdata, 'PNG', 0, 20, size.w, size.h, undefined, 'NONE')

        doc.save('graf.pdf')
    } else {
        download(canvasdata, 'graf.png')
    }
}

export function filterCiName(item: ConfigurationItemUi): string {
    let name = ''
    for (const j in item.attributes) {
        if (j == 'Gen_Profil_Rel_nazov' || j == 'Gen_Profil_nazov') {
            name = item.attributes[j]
            break
        }
    }

    return name
}

export function getShortName(name: string, length: number): string {
    if (name && name.length > length) {
        return name.substring(0, length) + '...'
    }

    return name
}

export const prepareData = (data: CiWithRelsResultUi, target: ConfigurationItemUi, typeFilter: TypeFilter): GraphData => {
    const graphData: GraphData = { nodes: [], links: [], total: data?.pagination?.totaltems || 0 }
    const pointMap: { [key: string]: number } = {}
    let start = 0

    function transformCiForGraph(item: ConfigurationItemUi): CiItem {
        const name = filterCiName(item) || ''
        const ciItem: CiItem = {
            uuid: item.uuid || '',
            type: item.type || '',
            color: item.type ? typeFilter[item.type]?.color : undefined,
            name,
            attributes: item.attributes,
            valid: !!(item && item.metaAttributes && item.metaAttributes.state === 'DRAFT'),
            shortName: getShortName(name, 15),
        }
        if (item.uuid && !pointMap[item.uuid]) {
            pointMap[item.uuid] = start
            ciItem.group = start
            start = start + 1
        }
        return ciItem
    }

    graphData.nodes.push(transformCiForGraph(target))
    data.ciWithRels?.forEach(function (item: CiWithRelsUi) {
        if (!item.ci || !item.rels || !typeFilter) return
        if (typeFilter[item.ci?.type || ''] && !typeFilter[item.ci?.type || ''].selected) return
        graphData.nodes.push(transformCiForGraph(item.ci))
        item.rels.forEach(function (relation) {
            if (relation.startUuid && relation.endUuid) {
                graphData.links.push({
                    uuid: relation.uuid || '',
                    type: relation.type || '',
                    startUuid: relation.startUuid,
                    endUuid: relation.endUuid,
                    source: relation.startUuid,
                    target: relation.endUuid,
                })
            }
        })
    })

    return graphData
}

export const generateLinks = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, links: RelsItem[]) => {
    const link = svg
        .append('g')
        .attr('class', 'links')
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .style('stroke', '#aaa')
        .attr('stroke', '#ccc')
        .attr('stroke-width', '1')
        .attr('id', function (d, i) {
            return 'linkId_' + i
        })
        .attr('alt', function (d) {
            return d.type
        })
        .attr('aria-label', function (d) {
            return d.type
        })
        .attr('marker-end', function () {
            return 'url(' + location.href + '#' + 'suit' + ')'
        })

    // arrows
    svg.append('svg:defs')
        .selectAll('marker') // management of  lines
        .data(['suit', 'licensing', 'resolved'])
        .enter()
        .append('svg:marker')
        .attr('id', function (d) {
            return d
        })
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
        .append('svg:path')
        .attr('d', 'M0,-5L10,0L0,5 L10,0 L0, -5')
        .attr('stroke', '#4679BD')
        .attr('stroke-width', '1')
        .attr('fill', '#ffffaf')
        .attr('style', 'opacity: 0.6')

    return link
}

export const generateNodes = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, nodes: CiItem[]) => {
    const radius = 18
    const node = svg
        .append('g')
        .attr('class', 'node')
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('stroke', '#333333')
        .attr('stroke-width', '1')
        .attr('class', 'node')

    // circle node
    node.append('circle')
        .attr('r', radius)
        .style('fill', (d) => d.color || '#69b3a2')
        .attr('alt', function (d) {
            return d.name
        })
        .attr('aria-label', function (d) {
            return d.name
        })
    // text node
    node.append('text')
        .attr('dx', 25)
        .attr('dy', '.35em')
        .attr('style', 'font: 10px sans-serif; stroke-width: 0.1')
        .text((d) => d.shortName || '')

    return node
}

const getLinksThatHasMatchingNode = ({ nodes, links }: { nodes: CiItem[]; links: RelsItem[] }) => {
    const nodeUuids = new Set(nodes.map((node) => node.uuid))
    const filteredLinks = links.filter((link) => nodeUuids.has(link.source.toString()) && nodeUuids.has(link.target.toString()))

    return filteredLinks
}

export const drawGraph = (
    graphWrapperRef: RefObject<HTMLDivElement>,
    setSelectedId: React.Dispatch<React.SetStateAction<ConfigurationItemUi | undefined>>,
    setNodeDetail: React.Dispatch<React.SetStateAction<CiItem | null>>,
    zoom: d3.ZoomBehavior<SVGGElement, unknown>,
    data?: GraphData,
) => {
    if (!data || !graphWrapperRef.current) return

    // constants
    const margin = { top: 10, right: 30, bottom: 30, left: 40 }
    const width = graphWrapperRef.current.clientWidth - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
    const linkDistance = 120
    const radius_padding = 20
    const charge = -300
    let toggle = 0

    const linkedByIndex: { [key: `${number},${number}`]: number } = {}
    for (let i = 0; i < data.nodes.length; i++) {
        linkedByIndex[`${i},${i}`] = 1
    }

    data.links.forEach(function (d) {
        if (typeof d.target !== 'string' && typeof d.source !== 'string') {
            linkedByIndex[`${d.source?.index || 0},${d.target?.index || 0}`] = 1
        }
    })

    //cleanup before rerender
    if (graphWrapperRef.current) {
        d3.select(graphWrapperRef.current.querySelector('svg')).remove()
    }

    const svg = d3
        .select(graphWrapperRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('width', width)
        .call(zoom)
        .on('dblclick.zoom', null)
    const container = svg.append('g').attr('width', width).attr('height', height)

    // placeholder for tooltip
    const tooltip = d3
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('visibility', 'hidden')
        .style('background-color', 'white')
        .attr('class', styles.tooltip)

    tooltip
        .on('mouseover', () => {
            tooltip.interrupt().style('visibility', 'visible')
        })
        .on('mouseout', () => tooltip_out(tooltip))

    const link = generateLinks(container, data.links)

    // wrapper for nodes
    const node = generateNodes(container, data.nodes)

    function neighboring(a: CiItem, b: CiItem): number {
        if (a.index !== undefined && b.index !== undefined) {
            return linkedByIndex[`${a.index},${b.index}`]
        }
        return 0
    }
    function connectedNodes(clickedNode: CiItem) {
        if (toggle == 0) {
            //Reduce the opacity of all but the neighbouring nodes
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const d = clickedNode ? clickedNode : d3.select(this).node().__data__

            node.style('opacity', function (o) {
                return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1
            })

            link.style('opacity', function (o) {
                return (typeof o.source !== 'string' && d.index == o.source.index) || (typeof o.target !== 'string' && d.index == o.target.index)
                    ? 1
                    : 0.1
            })
            toggle = 1
        } else {
            node.style('opacity', 1)
            link.style('opacity', 1)
            toggle = 0
        }
    }

    node.on('mouseover', (e, d) => {
        tooltip.interrupt().style('visibility', 'visible')
        tooltip_in(e, d, tooltip, setNodeDetail)
    })
        .on('mouseout', () => tooltip_out(tooltip))
        .on('dblclick', (e, d) => {
            tooltip_out(tooltip, 0)
            setSelectedId(d)
        })
        .on('click', (e, d) => connectedNodes(d))

    // create graph and links
    const force = d3
        .forceSimulation<CiItem>(data.nodes)
        .force(
            'link',
            d3
                .forceLink<CiItem, RelsItem>()
                .id((d: CiItem) => d.uuid)
                .distance(() => linkDistance)
                .links(getLinksThatHasMatchingNode({ nodes: data.nodes, links: data.links })),
        )
        .force('charge', d3.forceManyBody().strength(charge))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force(
            'collision',
            d3.forceCollide((d: CiItem) => (d.degree || 0) + radius_padding),
        )
        .on('tick', () => ticked(link))
        .on('end', () => ticked(link))

    node.call(drag(force, tooltip))
}
