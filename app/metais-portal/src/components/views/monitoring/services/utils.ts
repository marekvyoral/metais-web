import { MonitoredValue } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/componentHelpers'
import * as d3 from 'd3'
import { NumberValue } from 'd3'
import { RefObject } from 'react'

export enum paramTypeEnum {
    PARAM_TYPE_CATEGORY_AS = 'c_typ_parametra_kategoria.1',
    PARAM_TYPE_CATEGORY_KS = 'c_typ_parametra_kategoria.2',
    PARAM_TYPE_UNIT_COUNTER = 'c_typ_parametra_jednotka.1',
    PARAM_TYPE_UNIT_PERCENTAGE = 'c_typ_parametra_jednotka.2',
    PARAM_TYPE_UNIT_SECONDS = 'c_typ_parametra_jednotka.3',
    PARAM_TYPE_UNIT_MILLISECONDS = 'c_typ_parametra_jednotka.4',
    PARAM_TYPE_UNIT_HOURS = 'c_typ_parametra_jednotka.6',
}

interface Data {
    date: Date | null
    value: number
}
interface Line {
    name: string
    values: Data[]
}

export const createLinearGraph = (svgRef: RefObject<HTMLDivElement>, graphData: MonitoredValue[], widthDiv: number) => {
    const wrappedData: Line[] = [
        {
            name: 'linearGraph',
            values: graphData.map((item) => {
                return { date: new Date(formatDateForDefaultValue(item.monitoredInterval?.start ?? '')), value: +(item?.value ?? 0) }
            }),
        },
    ]

    const svg = d3.select(svgRef.current).append('svg')
    const margin = 50
    const width = widthDiv - margin
    const height = 400
    const duration = 250

    const lineOpacity = '1'

    const circleOpacity = '0.85'
    const circleRadius = 6
    const circleRadiusHover = 8

    /* Scale */
    const extentX = d3.extent(wrappedData[0].values, (d) => d.date)
    const minX = extentX[0] ?? new Date()
    const maxX = extentX[1] ?? new Date()

    const xScale = d3
        .scaleTime()
        .domain([minX, maxX])
        .range([0, width - margin])

    const extentY = d3.extent(wrappedData[0].values, (d) => d.value)
    const minY = extentY[0] ?? 0
    const maxY = extentY[1] ?? 0

    const yScale = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - margin, 0])

    svg.attr('width', width + margin + 'px')
        .attr('height', height + margin + 'px')
        .append('g')
        .attr('transform', `translate(${margin}, ${margin})`)

    const xAxis = d3
        .axisBottom(xScale)
        .tickSize(height - margin)
        .tickSizeOuter(0)
        .tickFormat((d: Date | NumberValue) => {
            if (d instanceof Date) {
                return d3.timeFormat('%b')(d)
            } else {
                return d.toString()
            }
        })
        .tickPadding(15)

    const yAxis = d3
        .axisLeft(yScale)
        .tickSize(margin - width)
        .tickSizeOuter(0)
        .ticks(12)
        .tickPadding(20)

    // Add the X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${margin}, ${margin})`)
        .attr('font-weight', '100')
        .attr('color', 'lightGray')
        .attr('font-family', '"Roboto", "sans-serif"')
        .call(xAxis)

    // Add the Y Axis
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin}, ${margin})`)
        .attr('font-weight', '100')
        .attr('color', 'lightGray')
        .attr('font-family', '"Roboto", "sans-serif"')
        .call(yAxis)
        .append('text')
        .attr('y', 15)
        .attr('transform', 'rotate(-90)')

    /* Add line into SVG */
    const line = d3
        .line<Data>()
        .x((d) => xScale(d.date ?? new Date()))
        .y((d) => yScale(d.value ?? 0))

    const lines = svg.append('g').attr('class', 'lines').attr('transform', `translate(${margin}, ${margin})`)

    // draws out line and different points
    lines
        .selectAll('line-group')
        .data(wrappedData)
        .enter()
        .append('g')
        .attr('class', 'line-group')

        .append('path')
        .attr('class', 'line')
        .attr('d', (d) => {
            return line(d.values)
        })
        // line color that connects dots
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .style('opacity', lineOpacity)

    // /* Add circles in the line */
    lines
        .selectAll('circle-group')
        .data(wrappedData)
        .enter()
        .append('g')
        .style('fill', '#33BBFF')
        .selectAll('circle')
        .data((d: Line) => d.values)
        .enter()
        .append('g')
        .attr('class', 'circle')
        .on('mouseover', function () {
            // display amount on hovering of points
            d3.select<SVGGElement, Data>(this)
                .append('rect')
                .attr('class', 'text')
                .style('fill', 'white')
                .attr('x', (d) => xScale(d.date ?? new Date()))
                .attr('y', (d) => yScale(d.value) - 25)
            const text = d3
                .select<SVGGElement, Data>(this)
                .style('cursor', 'pointer')
                .append('text')
                .attr('class', 'text')
                .text((d) => `(${d.value}) ${formatDateForDefaultValue(d.date?.toISOString() ?? '', 'dd. MM. yyyy')}`)
                .attr('x', (d) => xScale(d.date ?? new Date()) + 5)
                .attr('y', (d) => yScale(d.value) - 10)
            d3.select('rect')
                .attr('width', text.text().length * 7.1)
                .attr('height', 20)
        })
        .on('mouseout', function () {
            d3.select(this).style('cursor', 'none').transition().duration(duration).selectAll('.text').remove()
        })
        .append('circle')
        .attr('cx', (d: unknown) => {
            if (typeof d === 'object' && d !== null && 'date' in d) {
                return xScale((d as Data).date ?? new Date())
            }
            return 0
        })
        .attr('cy', (d: unknown) => {
            if (typeof d === 'object' && d !== null && 'value' in d) {
                return yScale((d as Data).value)
            }
            return 0
        })
        .attr('r', circleRadius)
        .style('opacity', circleOpacity)
        .on('mouseover', function () {
            d3.select(this).transition().duration(duration).attr('r', circleRadiusHover)
        })
        .on('mouseout', function () {
            d3.select(this).transition().duration(duration).attr('r', circleRadius)
        })
}
