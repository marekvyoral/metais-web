import type { Meta, StoryObj } from '@storybook/react'

import { TextLinkExternal } from '@/components/typography/TextLinkExternal'

const meta: Meta<typeof TextLinkExternal> = {
    title: 'Components/typography/TextLinkExternal',
    component: TextLinkExternal,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextLinkExternal>

export const DefaultTextLinkExternal: Story = {
    args: {
        title: 'DefaultTextLinkExternal',
        href: '#',
        textLink: 'DefaultTextLinkExternal',
    },
}

export const TextLinkTextExternal: Story = {
    args: {
        title: 'TextLinkTextExternal',
        href: '#',
        children: 'TextLinkTextExternal',
        textLink: 'TextLinkTextExternal',
    },
}

export const TextLinkBackExternal: Story = {
    args: {
        title: 'TextLinkBackExternal',
        href: '#',
        textLink: 'TextLinkBackExternal',
        linkBack: true,
    },
}

export const TextLinkNoVisitedStateExternal: Story = {
    args: {
        title: 'TextLinkNoVisitedStateExternal',
        href: '#',
        textLink: 'TextLinkNoVisitedStateExternal',
        noVisitedState: true,
    },
}

export const TextLinkNewTabExternal: Story = {
    args: {
        title: 'TextLinkNewTabExternal',
        href: '#',
        textLink: 'TextLinkNewTabExternal',
        newTab: true,
    },
}

export const TextLinkInverseExternal: Story = {
    args: {
        title: 'TextLinkInverseExternal',
        href: '#',
        textLink: 'TextLinkInverseExternal',
        inverse: true,
    },
}

export const TextLinkNoUnderlineExternal: Story = {
    args: {
        title: 'TextLinkInverseExternal',
        href: '#',
        textLink: 'TextLinkInverseExternal',
        noUnderline: true,
    },
}
