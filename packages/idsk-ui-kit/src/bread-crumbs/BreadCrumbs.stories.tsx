import type { Meta, StoryObj } from '@storybook/react'

import { BreadCrumbs } from './BreadCrumbs'

import { HomeIcon } from '@isdd/idsk-ui-kit/assets/images'

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
