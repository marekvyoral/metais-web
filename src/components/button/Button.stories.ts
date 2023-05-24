import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Button>

export const Main: Story = {
    args: {
        label: 'Save and continue',
        onClick: () => undefined,
    },
}

export const Error: Story = {
    args: {
        label: 'Error!',
        onClick: () => undefined,
        variant: 'warning',
    },
}

export const Secondary: Story = {
    args: {
        label: 'I am Secondary',
        onClick: () => undefined,
        variant: 'secondary',
    },
}

export const MainDisabled: Story = {
    args: {
        label: 'I am disabled',
        onClick: () => undefined,
        disabled: true,
    },
}

export const ErrorDisabled: Story = {
    args: {
        label: 'I am disabled',
        onClick: () => undefined,
        variant: 'warning',
        disabled: true,
    },
}

export const SecondaryDisabled: Story = {
    args: {
        label: 'I am disabled',
        onClick: () => undefined,
        variant: 'secondary',
        disabled: true,
    },
}
