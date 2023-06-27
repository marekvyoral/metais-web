import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { GridCol } from './GridCol'
import { GridRow } from './GridRow'

const meta: Meta<typeof GridCol> = {
    title: 'Components/GridCol',
    component: GridCol,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof GridCol>

export const Default: Story = {
    render: (args) => (
        <GridRow>
            <GridCol setWidth={args.setWidth}>
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const Full: Story = {
    render: () => (
        <GridRow>
            <GridCol>
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const Halves: Story = {
    render: () => (
        <GridRow>
            <GridCol setWidth="one-half">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-half">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const TwoTirdsAndOneThird: Story = {
    render: () => (
        <GridRow>
            <GridCol setWidth="two-thirds">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-third">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const ThreeThirds: Story = {
    render: () => (
        <GridRow>
            <GridCol setWidth="one-third">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-third">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-third">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const FourQuarters: Story = {
    render: () => (
        <GridRow>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}

export const TwoQuartersAndHalf: Story = {
    render: () => (
        <GridRow>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-quarter">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
            <GridCol setWidth="one-half">
                <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
            </GridCol>
        </GridRow>
    ),
}
