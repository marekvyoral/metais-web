import type { Meta, StoryObj } from '@storybook/react'

import { TextLinkExternal } from './TextLinkExternal'

const meta: Meta<typeof TextLinkExternal> = {
    title: 'Components/typography/TextLinkExternal',
    component: TextLinkExternal,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextLinkExternal>

export const DefaultTextLinkExternal: Story = {
    args: {
        to: '#',
        children: 'DefaultTextLinkExternal',
    },
}

export const TextLinkExternalBack: Story = {
    args: {
        to: '#',
        children: 'TextLinkExternalBack',
        linkBack: true,
    },
}

export const TextLinkExternalNoVisitedState: Story = {
    args: {
        to: '#',
        children: 'TextLinkExternalNoVisitedState',
        noVisitedState: true,
    },
}

export const TextLinkExternalInverse: Story = {
    args: {
        to: '#',
        children: 'TextLinkExternalInverse',
        inverse: true,
    },
}

export const TextLinkExternalNoUnderline: Story = {
    args: {
        to: '#',
        children: 'TextLinkExternalNoUnderline',
        noUnderline: true,
    },
}
