import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { GridRow } from './GridRow'

const meta: Meta<typeof GridRow> = {
    title: 'Components/GridRow',
    component: GridRow,
}
export default meta

type Story = StoryObj<typeof GridRow>

export const Default: Story = {
    render: () => (
        <GridRow>
            <div style={{ backgroundColor: 'blue', height: 20, width: '100%' }} />
        </GridRow>
    ),
}
