import type { Meta, StoryObj } from '@storybook/react'

import { TextHidden } from './TextHidden'

const meta: Meta<typeof TextHidden> = {
    title: 'Components/typography/TextHidden',
    component: TextHidden,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextHidden>

export const SummaryTextHidden: Story = {
    args: { summaryText: 'SummaryTextHidden', children: 'TextHidden' },
}
