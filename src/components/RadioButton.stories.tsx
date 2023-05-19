import type { Meta, StoryObj } from '@storybook/react'

import { RadioButton } from './RadioButton'

const meta: Meta<typeof RadioButton> = {
    title: 'Components/RadioButton',
    component: RadioButton,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RadioButton>

export const NotSelected: Story = {
    args: {
        id: 'notSelected-radioButton',
        label: 'NotSelected RadioButton',
        name: 'notSelected-radioButton',
    },
}

export const Selected: Story = {
    args: {
        id: 'selected-radioButton',
        label: 'Selected RadioButton',
        name: 'selected-radioButton',
        checked: true,
    },
}

export const Disabled: Story = {
    args: {
        id: 'disabled-radioButton',
        label: 'Disabled RadioButton',
        name: 'disabled-radioButton',
        disabled: true,
    },
}
