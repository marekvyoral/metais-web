import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { MultiValue } from 'react-select'

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
    selectOption: Option[]
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
            const [values, setValues] = useState<MultiValue<Option>>(defaultValues.selectOption)

            const handleOnchange = (newValue: MultiValue<Option>) => {
                setValues(newValue)
            }

            return (
                <MultiSelect id="selectOption" name="selectOption" label="Label test" options={options} values={values} onChange={handleOnchange} />
            )
        }
        return <Wrapper />
    },
}

export const UncontrolledFormHookGroup: Story = {
    render: () => {
        const Wrapper = () => {
            const { register, handleSubmit, setValue, formState } = useForm<IForm>({ defaultValues })
            const onSubmit = (data: IForm) => {
                // eslint-disable-next-line no-alert
                alert('select data: ' + data.selectOption.map((option) => option.value))
            }
            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <MultiSelect<Option>
                        id="selectOption"
                        name="selectOption"
                        label="Label test"
                        options={options}
                        register={register}
                        setValue={setValue}
                        defaultValue={defaultValues.selectOption}
                        error={formState.errors.selectOption?.message}
                    />
                    <button type="submit">Submit</button>
                </form>
            )
        }
        return <Wrapper />
    },
}
