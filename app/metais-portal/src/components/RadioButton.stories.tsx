import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { RadioButton } from '@/components/RadioButton'

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

export const ControlledGroup: Story = {
    render: () => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)
            return (
                <div>
                    <RadioButton
                        id="op1"
                        value="option1"
                        name="answer"
                        label="Option 1"
                        onChange={(e) => setSelectedValue(e.target.value)}
                        checked={selectedValue === 'option1'}
                    />
                    <RadioButton
                        id="op2"
                        value="option2"
                        name="answer"
                        label="Option 2"
                        onChange={(e) => setSelectedValue(e.target.value)}
                        checked={selectedValue === 'option2'}
                    />
                    <RadioButton
                        id="op3"
                        value="option3"
                        name="answer"
                        label="Option 3"
                        onChange={(e) => setSelectedValue(e.target.value)}
                        checked={selectedValue === 'option3'}
                    />
                    <p>Selected value is: {selectedValue}</p>
                </div>
            )
        }
        return <StateWrapper />
    },
}

export const UncontrolledFormHookGroup: Story = {
    render: () => {
        const Wrapper = () => {
            const { register, handleSubmit, watch } = useForm()
            const selectedValue = watch('answer')
            // eslint-disable-next-line no-alert
            const submit = handleSubmit((formData) => alert(JSON.stringify(formData)))
            return (
                <div>
                    <RadioButton id="op1" value="option1" label="Option 1" {...register('answer')} />
                    <RadioButton id="op2" value="option2" label="Option 2" {...register('answer')} />
                    <RadioButton id="op3" value="option3" label="Option 3" {...register('answer')} />
                    <p>Selected value is: {selectedValue}</p>
                    <button onClick={submit}>Sumbit</button>
                </div>
            )
        }
        return <Wrapper />
    },
}
