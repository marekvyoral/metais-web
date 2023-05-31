import type { Meta, StoryObj } from '@storybook/react'

import { Input } from '@/components/Input'

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

export const Empty: Story = {
    args: {
        id: 'empty-input',
        label: 'Empty Input',
        name: 'empty-input',
    },
}

export const WithValue: Story = {
    args: {
        id: 'input-with-value',
        label: 'Input With Value',
        name: 'input-with-value',
        value: 'Input With Value - 123',
        onChange: () => null,
    },
}

export const WithLabelHint: Story = {
    args: {
        id: 'input-with-label-hint',
        label: 'Input With Label and Hint',
        hint: 'Input With Label and Hint',
        name: 'input-with-label-hint',
    },
}
export const HasError: Story = {
    args: {
        id: 'input-with-error',
        label: 'Input With Error',
        name: 'input-with-error',
        error: { type: 'required', message: 'This value is required' },
    },
}

export const HasErrorWithHint: Story = {
    args: {
        id: 'input-with-error-hint',
        label: 'Input With Error and Hint',
        hint: 'Input With Error and Hint',
        name: 'input-with-error-hint',
        error: { type: 'required' },
    },
}

export const Disabled: Story = {
    args: {
        id: 'disabled-input',
        label: 'Disabled Input',
        name: 'disabled-input',
        disabled: true,
    },
}

export const DisabledWithLabel: Story = {
    args: {
        id: 'disabled-with-label-input',
        label: 'Disabled With Label Input',
        name: 'disabled-with-label-input',
        disabled: true,
    },
}

export const DisabledWithLabelHint: Story = {
    args: {
        id: 'disabled-with-label-hint-input',
        label: 'Disabled With Label Hint Input',
        name: 'disabled-with-label-hint-input',
        hint: 'Disabled Input With Label and Hint',
        disabled: true,
    },
}
