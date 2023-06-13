import type { Meta, StoryObj } from '@storybook/react'

import { MutationFeedback } from '@/components/mutation-feedback/MutationFeedback'

const meta: Meta<typeof MutationFeedback> = {
    title: 'Components/MutationFeedback',
    component: MutationFeedback,
}

export default meta
type Story = StoryObj<typeof MutationFeedback>

export const Basic: Story = {
    args: {
        success: false,
        error: {
            errorTitle: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
            errorMessage: 'Priestor pre popis, k akým chybám došlo a ako ich opraviť.',
            buttons: [{ label: 'Opravit', onClick: () => null }],
        },
    },
}

export const BasicMultipleButtons: Story = {
    args: {
        success: true,
        error: {
            errorTitle: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
            errorMessage: 'Priestor pre popis, k akým chybám došlo a ako ich opraviť.',
            buttons: [
                { label: 'Opravit` 1', onClick: () => null },
                { label: 'Opravit` 2', onClick: () => null },
                { label: 'Opravit` 3', onClick: () => null },
            ],
        },
    },
}
