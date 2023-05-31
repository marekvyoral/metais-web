import type { Meta, StoryObj } from '@storybook/react'

import { TextEmbedded } from '@/components/typography/TextEmbedded'

const meta: Meta<typeof TextEmbedded> = {
    title: 'Components/typography/TextEmbedded',
    component: TextEmbedded,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextEmbedded>

export const DefaultTextEmbedded: Story = {
    args: { children: 'TextEmbedded' },
}
