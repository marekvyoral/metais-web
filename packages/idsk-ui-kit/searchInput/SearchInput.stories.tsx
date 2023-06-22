import type { Meta, StoryObj } from '@storybook/react'

import { SearchInput } from './SearchInput'

const meta: Meta<typeof SearchInput> = {
    title: 'Components/SearchInput',
    component: SearchInput,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SearchInput>

export const Basic: Story = {
    args: {
        id: 'test',
        name: 'fullTextSerach',
    },
}
