import type { Meta, StoryObj } from '@storybook/react'

import { TextBody } from './TextBody'

const meta: Meta<typeof TextBody> = {
    title: 'Components/typography/TextBody',
    component: TextBody,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextBody>

export const DefaultSizeTextBody: Story = {
    args: { children: 'DefaultSizeTextBody' },
}

export const SmallSizeTextBody: Story = {
    args: {
        size: 'S',
        children: 'SmallSizeTextBody',
    },
}

export const LargeSizeTextBody: Story = {
    args: {
        size: 'L',
        children: 'LargeSizeTextBody',
    },
}
