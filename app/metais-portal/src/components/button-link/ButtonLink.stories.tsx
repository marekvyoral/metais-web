import type { Meta, StoryObj } from '@storybook/react'

import { ButtonLink } from './ButtonLink'

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
