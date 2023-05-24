import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TextLink } from './TextLink'

const meta: Meta<typeof TextLink> = {
    title: 'Components/typography/TextLink',
    component: TextLink,
    tags: ['autodocs'],
    decorators: [
        (StoryComponent) => (
            <BrowserRouter>
                <StoryComponent />
            </BrowserRouter>
        ),
    ],
}

export default meta

type Story = StoryObj<typeof TextLink>

export const DefaultTextLink: Story = {
    args: {
        to: '#',
        children: 'DefaultTextLink',
    },
}

export const TextLinkBack: Story = {
    args: {
        to: '#',
        children: 'TextLinkBack',
        linkBack: true,
    },
}

export const TextLinkNoVisitedState: Story = {
    args: {
        to: '#',
        children: 'TextLinkNoVisitedState',
        noVisitedState: true,
    },
}

export const TextLinkInverse: Story = {
    args: {
        to: '#',
        children: 'TextLinkInverse',
        inverse: true,
    },
}

export const TextLinkNoUnderline: Story = {
    args: {
        to: '#',
        children: 'TextLinkNoUnderline',
        noUnderline: true,
    },
}
