import type { Meta, StoryObj } from '@storybook/react'

import { MutationFeedback } from './MutationFeedback'

const meta: Meta<typeof MutationFeedback> = {
    title: 'Components/MutationFeedback',
    component: MutationFeedback,
}

export default meta
type Story = StoryObj<typeof MutationFeedback>

export const Basic: Story = {
    args: {
        success: false,
        error: true,
    },
}
