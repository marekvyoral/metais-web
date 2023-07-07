import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { NavigationCloseIcon } from '..'

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

export const BasicWithIcon: Story = {
    args: {
        label: 'button link with icon',
        icon: (
            <>
                <img src={NavigationCloseIcon} />
            </>
        ),
        onClick: () => null,
    },
}
