import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './Input'

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Empty: Story = {
    args: {
        label: 'Empty Input',
        name: 'empty-input',
    },
}

export const WithValue: Story = {
    args: {
        label: 'Input With Value',
        name: 'input-with-value',
        value: 'Input With Value - 123',
    },
}
