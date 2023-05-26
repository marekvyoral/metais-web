import type { Meta, StoryObj } from '@storybook/react'

import { HomeIcon } from '../../assets/images'

import { BreadCrumbs } from './BreadCrumbs'

const meta: Meta<typeof BreadCrumbs> = {
    title: 'Components/BreadCrumbs',
    component: BreadCrumbs,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof BreadCrumbs>

export const Basic: Story = {
    args: {
        links: [
            { label: 'Home', href: '/', icon: HomeIcon },
            { label: 'Second', href: '/second' },
        ],
    },
}
