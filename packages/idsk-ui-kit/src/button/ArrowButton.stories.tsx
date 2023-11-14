import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { ArrowButton } from './ArrowButton'

const meta: Meta<typeof ArrowButton> = {
    title: 'Components/ArrowButton',
    component: ArrowButton,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ArrowButton>

export const Main: Story = {
    decorators: [
        (StoryComponent) => (
            <BrowserRouter>
                <StoryComponent />
            </BrowserRouter>
        ),
    ],
    args: {
        label: 'Arrow Button',
        path: '#',
    },
}
