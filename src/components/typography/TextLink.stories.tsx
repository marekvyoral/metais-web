import type { Meta, StoryObj } from '@storybook/react'

import { TextLink } from './TextLink'

const meta: Meta<typeof TextLink> = {
    title: 'Components/typography/TextLink',
    component: TextLink,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextLink>

export const DefaultTextLink: Story = {
    args: {
        title: 'DefaultTextLink',
        href: '#',
        textLink: 'DefaultTextLink',
    },
}

export const TextLinkText: Story = {
    args: {
        title: 'TextLinkText',
        href: '#',
        children: 'TextLinkText',
        textLink: 'TextLinkText',
    },
}

export const TextLinkBack: Story = {
    args: {
        title: 'TextLinkBack',
        href: '#',
        textLink: 'TextLinkBack',
        linkBack: true,
    },
}

export const TextLinkNoVisitedState: Story = {
    args: {
        title: 'TextLinkNoVisitedState',
        href: '#',
        textLink: 'TextLinkNoVisitedState',
        noVisitedState: true,
    },
}

export const TextLinkNewTab: Story = {
    args: {
        title: 'TextLinkNewTab',
        href: '#',
        textLink: 'TextLinkNewTab',
        newTab: true,
    },
}

export const TextLinkInverse: Story = {
    args: {
        title: 'TextLinkInverse',
        href: '#',
        textLink: 'TextLinkInverse',
        inverse: true,
    },
}

export const TextLinkNoUnderline: Story = {
    args: {
        title: 'TextLinkInverse',
        href: '#',
        textLink: 'TextLinkInverse',
        noUnderline: true,
    },
}
