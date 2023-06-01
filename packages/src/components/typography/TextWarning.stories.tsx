import type { Meta, StoryObj } from '@storybook/react'

import { TextWarning } from './TextWarning'

const meta: Meta<typeof TextWarning> = {
    title: 'Components/typography/TextWarning',
    component: TextWarning,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextWarning>

export const DefaultTextWarning: Story = {
    args: { children: 'DefaultTextWarning', assistive: 'DefaultTextWarning' },
}
