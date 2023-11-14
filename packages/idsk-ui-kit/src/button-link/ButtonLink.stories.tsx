import type { Meta, StoryObj } from '@storybook/react'

import { ButtonLink } from './ButtonLink'

import { NavigationCloseIcon } from '@/assets/images'

const meta: Meta<typeof ButtonLink> = {
    title: 'Components/ButtonLink',
    component: ButtonLink,
}

export default meta
type Story = StoryObj<typeof ButtonLink>

export const Basic: Story = {
    args: {
        label: 'Opraviť',
        onClick: () => null,
    },
}

export const BasicWithIcon: Story = {
    args: {
        label: 'button link with icon',
        icon: NavigationCloseIcon,
        onClick: () => null,
    },
}
