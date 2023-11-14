import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { LoadingIndicator } from './LoadingIndicator'

const meta: Meta<typeof LoadingIndicator> = {
    title: 'Components/LoadingIndicator',
    component: LoadingIndicator,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LoadingIndicator>

export const Basic: Story = {
    args: { transparentMask: false, fullscreen: true, label: 'Loading webpage' },
    decorators: [
        (Story) => (
            <div style={{ backgroundColor: 'grey', height: '300px', width: '300px', position: 'relative' }}>
                <Story />
            </div>
        ),
    ],
}
