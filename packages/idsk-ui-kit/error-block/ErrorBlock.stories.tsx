import type { Meta, StoryObj } from '@storybook/react'

import { ErrorBlock } from './ErrorBlock'

const meta: Meta<typeof ErrorBlock> = {
    title: 'Components/ErrorBlock',
    component: ErrorBlock,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ErrorBlock>

export const Basic: Story = {
    args: {
        errorTitle: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        errorMessage: 'Priestor pre popis, k akým chybám došlo a ako ich opraviť.',
    },
}
