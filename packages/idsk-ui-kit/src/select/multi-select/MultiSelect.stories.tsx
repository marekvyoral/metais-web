import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { MultiSelect } from '@isdd/idsk-ui-kit'

const meta: Meta<typeof MultiSelect> = {
    title: 'Components/MultiSelect',
    component: MultiSelect,
}

interface Option {
    value: string
    label: string
    disabled?: boolean | undefined
}

export interface IForm {
    selectOption: string[]
}

const options: Option[] = [
    {
        label: 'Hiqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
        value: 'hiqqqqqqqqqqqqqqqqqqqqqq',
    },
    {
        label: "I'm",
        value: "i'm",
        disabled: true,
    },
    {
        label: 'Simple',
        value: 'simple',
    },
    {
        label: 'Select',
        value: 'select',
    },
    {
        label: 'Select1',
        value: 'select1',
    },
    {
        label: 'Select2',
        value: 'select2',
    },
    {
        label: 'Select3',
        value: 'select3',
    },
]

const defaultValues = {
    selectOption: [options[5], options[4]],
}

export default meta
type Story = StoryObj<typeof MultiSelect>

export const Controlled: Story = {
    render: () => {
        const Wrapper = () => {
            const [values, setValues] = useState<string[] | undefined>(defaultValues.selectOption.map((opt) => opt.value))
            return <MultiSelect id="selectOption" name="selectOption" label="Label test" options={options} value={values} onChange={setValues} />
        }
        return <Wrapper />
    },
}

export const UncontrolledFormHookGroup: Story = {
    render: () => {
        const Wrapper = () => {
            const { handleSubmit, setValue, formState } = useForm<IForm>({
                defaultValues: { selectOption: defaultValues.selectOption.map((option) => option.value) },
            })
            const onSubmit = (data: IForm) => {
                // eslint-disable-next-line no-alert
                alert('select data: ' + data.selectOption)
            }
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <MultiSelect
                        id="selectOption"
                        name="selectOption"
                        label="Label test"
                        options={options}
                        setValue={setValue}
                        defaultValue={defaultValues.selectOption.map((option) => option.value)}
                        error={formState.errors.selectOption?.message}
                    />
                    <button type="submit">Submit</button>
                </form>
            )
        }
        return <Wrapper />
    },
}
