import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { HomeIcon } from '@/assets/images'
import { Button } from '@/components/button/Button'

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

export const ButtonNumberLabel: Story = {
    args: {
        label: 132,
        onClick: () => undefined,
        variant: 'secondary',
        disabled: true,
    },
}

export const ButtonJsxLabel: Story = {
    args: {
        label: (
            <div>
                <strong>Strong</strong> and{' '}
                <ruby>
                    明日
                    <rt>Ashita</rt>
                </ruby>
            </div>
        ),
        variant: 'warning',
    },
}

export const IconInLabel: Story = {
    args: {
        label: <div>{<img src={HomeIcon} alt="home" />}</div>,
        variant: 'secondary',
    },
}
