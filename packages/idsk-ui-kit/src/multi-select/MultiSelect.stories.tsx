import type { Meta, StoryObj } from '@storybook/react'

import { MultiSelect } from './MultiSelect'

const meta: Meta<typeof MultiSelect> = {
    title: 'Components/MultiSelect',
    component: MultiSelect,
}

interface Option {
    value: string
    label: string
    disabled?: boolean | undefined
}

const options: Option[] = [
    {
        label: 'Hiqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
        value: 'hiqqqqqqqqqqqqqqqqqqqqqq',
    },
    {
        label: "I'm",
        value: "i'm",
    },
    {
        label: 'Simple',
        value: 'simple',
    },
    {
        label: 'Select',
        value: 'select',
    },
]

export default meta
type Story = StoryObj<typeof MultiSelect<Option>>

export const Basic: Story = {
    args: {
        label: 'Multi select',
        options: options,
        placeholder: 'custom placeholder',
        noOptionsMessage: (inputValue) => `${inputValue.inputValue} !!!!`,
    },
}
