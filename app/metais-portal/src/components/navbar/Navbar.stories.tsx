import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { Navbar } from './Navbar'

const meta: Meta<typeof Navbar> = {
    title: 'Page-Elements/Navbar',
    component: Navbar,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Navbar>

export const Main: Story = {
    render: () => (
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    ),
}
