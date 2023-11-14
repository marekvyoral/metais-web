import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SimpleSelect } from './SimpleSelect'

const meta: Meta<typeof SimpleSelect> = {
    title: 'Components/SimpleSelect',
    component: SimpleSelect,
}

interface IOption {
    value: string
    label: string
    disabled?: boolean
}

const options: IOption[] = [
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
            return (
                <SimpleSelect isClearable={false} name="test" label="test" options={args.options} value={selectedValue} onChange={setSelectedValue} />
            )
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
            return <SimpleSelect value={selectedValue} {...args} onChange={setSelectedValue} />
        }
        return <StateWrapper />
    },
    args: {
        id: 'empty-value-select',
        value: '',
        label: 'Simple select',
        options: [...options],
    },
}

export const DisabledSelect: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SimpleSelect value={selectedValue} {...args} onChange={setSelectedValue} />
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
            return <SimpleSelect value={selectedValue} {...args} onChange={setSelectedValue} />
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
            const { handleSubmit, watch, setValue, formState } = useForm({ defaultValues: { select: initValue as string, test: '' } })
            const selectedValue = watch('select')

            const submit = handleSubmit((formData) => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(formData.select))
            })
            return (
                <div>
                    <SimpleSelect
                        id="select"
                        setValue={setValue}
                        error={formState.errors.select?.message}
                        defaultValue={initValue}
                        name="select"
                        label={args.label}
                        options={args.options}
                    />
                    <p>Selected value is: {JSON.stringify(selectedValue)}</p>
                    <button onClick={submit}>Sumbit</button>
                </div>
            )
        }
        return <StateWrapper />
    },
    args: {
        id: 'uncontrolled-init-select',
        name: 'uncontrolled-init-select',
        value: 'simple',
        label: 'Uncontrolled',
        options: options,
    },
}
