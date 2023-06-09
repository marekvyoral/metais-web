import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { CheckBox } from '@portal/components/CheckBox'

const meta: Meta<typeof CheckBox> = {
    title: 'Components/CheckBox',
    component: CheckBox,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CheckBox>

export const NotSelected: Story = {
    args: {
        id: 'notSelected-checkBox',
        label: 'NotSelected CheckBox',
        name: 'notSelected-checkBox',
    },
}

export const Selected: Story = {
    args: {
        id: 'selected-checkBox',
        label: 'Selected CheckBox',
        name: 'selected-checkBox',
        checked: true,
    },
}

export const Disabled: Story = {
    args: {
        id: 'disabled-checkBox',
        label: 'Disabled CheckBox',
        name: 'disabled-checkBox',
        disabled: true,
    },
}

export const ControlledGroup: Story = {
    render: () => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState<Record<string, boolean>>({})
            const updateSelectedValue = (key: string, checked: boolean) => {
                setSelectedValue((previousValue) => ({ ...previousValue, [key]: checked }))
            }
            return (
                <div>
                    <CheckBox
                        id="op1"
                        value="option1"
                        name="answer"
                        label="Option 1"
                        onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                        checked={selectedValue['option1']}
                    />
                    <CheckBox
                        id="op2"
                        value="option2"
                        name="answer"
                        label="Option 2"
                        onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                        checked={selectedValue['option2']}
                    />
                    <CheckBox
                        id="op3"
                        value="option3"
                        name="answer"
                        label="Option 3"
                        onChange={(e) => updateSelectedValue(e.target.value, e.target.checked)}
                        checked={selectedValue['option3']}
                    />
                    <p>Selected value is: {JSON.stringify(selectedValue)}</p>
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
                    <CheckBox id="op1" value="option1" label="Option 1" {...register('answer')} />
                    <CheckBox id="op2" value="option2" label="Option 2" {...register('answer')} />
                    <CheckBox id="op3" value="option3" label="Option 3" {...register('answer')} />
                    <p>Selected value is: {JSON.stringify(selectedValue)}</p>
                    <button onClick={submit}>Sumbit</button>
                </div>
            )
        }
        return <Wrapper />
    },
}
