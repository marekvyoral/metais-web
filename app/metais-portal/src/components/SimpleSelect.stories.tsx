import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SimpleSelect } from '@/components/SimpleSelect'

const meta: Meta<typeof SimpleSelect> = {
    title: 'Components/SimpleSelect',
    component: SimpleSelect,
}

const options: { value: string; label: string; disabled?: boolean }[] = [
    {
        label: 'Hi',
        value: 'hi',
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
type Story = StoryObj<typeof SimpleSelect>

export const Basic: Story = {
    args: {
        id: 'basic',
        label: 'Simple select',
        options: options,
    },
}

export const Controlled: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SimpleSelect value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} {...args} />
        }
        return <StateWrapper />
    },
    args: {
        id: 'controlled-select',
        value: 'simple',
        label: 'Simple select',
        options: options,
    },
}

export const WithEmptyValue: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SimpleSelect value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} {...args} />
        }
        return <StateWrapper />
    },
    args: {
        id: 'empty-value-select',
        value: '',
        label: 'Simple select',
        options: [{ label: 'Select... ', value: '' }, ...options],
    },
}

export const DisabledSelect: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SimpleSelect value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} {...args} />
        }
        return <StateWrapper />
    },
    args: {
        id: 'disabled-select',
        value: 'simple',
        label: 'Simple select',
        options: options,
        disabled: true,
    },
}

export const DisabledOption: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SimpleSelect value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} {...args} />
        }
        return <StateWrapper />
    },
    args: {
        id: 'disabled-option-select',
        value: 'simple',
        label: 'Simple select',
        options: [{ label: 'Disabled option', value: 'disabled', disabled: true }, ...options],
    },
}

export const UncontrolledWithInitValue: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const { register, handleSubmit, watch } = useForm({ defaultValues: { select: initValue } })
            const selectedValue = watch('select')
            // eslint-disable-next-line no-alert
            const submit = handleSubmit((formData) => alert(JSON.stringify(formData)))
            return (
                <div>
                    <SimpleSelect {...args} {...register('select')} />
                    <p>Selected value is: {JSON.stringify(selectedValue)}</p>
                    <button onClick={submit}>Sumbit</button>
                </div>
            )
        }
        return <StateWrapper />
    },
    args: {
        id: 'uncontrolled-init-select',
        value: 'simple',
        label: 'Uncontrolled',
        options: options,
    },
}
