import type { Meta, StoryObj } from '@storybook/react'

import { TextHeading } from '@/components/typography/TextHeading'

const meta: Meta<typeof TextHeading> = {
    title: 'Components/typography/TextHeading',
    component: TextHeading,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextHeading>

export const SmallSizeTextHeading: Story = {
    args: {
        size: 'S',
        children: 'SmallSizeTextHeading',
    },
}

export const MediumSizeTextHeading: Story = {
    args: {
        size: 'M',
        children: 'MediumSizeTextHeading',
    },
}

export const LargeSizeTextHeading: Story = {
    args: {
        size: 'L',
        children: 'LargeSizeTextHeading',
    },
}

export const ExtraLargeSizeTextHeading: Story = {
    args: {
        size: 'XL',
        children: 'ExtraLargeSizeTextHeading',
    },
}
