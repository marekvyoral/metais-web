import type { Meta, StoryObj } from '@storybook/react'

import { TextArea } from './TextArea'

const meta: Meta<typeof TextArea> = {
    title: 'Components/TextArea',
    component: TextArea,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextArea>

export const Empty: Story = {
    args: {
        label: 'Empty TextArea',
        name: 'empty-text-area',
        rows: 5,
    },
}

export const WithValue: Story = {
    args: {
        label: 'Area With Value',
        name: 'area-with-value',
        value: 'Area With Value - 123',
        rows: 5,
    },
}
export const WithLabelHint: Story = {
    args: {
        id: 'Area-with-label-hint',
        label: 'Area With Label and Hint',
        hint: 'Area With Label and Hint',
        name: 'area-with-label-hint',
        rows: 5,
    },
}
export const HasError: Story = {
    args: {
        id: 'Area-with-error',
        label: 'Area With Error',
        name: 'area-with-error',
        rows: 5,
        error: { type: 'required', message: 'This value is required' },
    },
}

export const HasErrorWithHint: Story = {
    args: {
        id: 'Area-with-error-hint',
        label: 'Area With Error and Hint',
        hint: 'Area With Error and Hint',
        name: 'area-with-error-hint',
        rows: 5,
        error: { type: 'required' },
    },
}

export const Disabled: Story = {
    args: {
        id: 'disabled-area',
        name: 'disabled-area',
        rows: 5,
        disabled: true,
    },
}

export const DisabledWithLabel: Story = {
    args: {
        id: 'disabled-with-label-area',
        label: 'Disabled With Label Area',
        name: 'disabled-with-label-area',
        rows: 5,
        disabled: true,
    },
}

export const DisabledWithLabelHint: Story = {
    args: {
        id: 'disabled-with-label-hint-area',
        label: 'Disabled With Label Hint Area',
        name: 'disabled-with-label-hint-area',
        hint: 'Disabled Area With Label and Hint',
        rows: 5,
        disabled: true,
    },
}
