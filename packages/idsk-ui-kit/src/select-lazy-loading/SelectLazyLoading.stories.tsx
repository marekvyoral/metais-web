import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'

import { SelectLazyLoading } from './SelectLazyLoading'

const meta: Meta<typeof SelectLazyLoading> = {
    title: 'Components/SelectLazyLoading',
    component: SelectLazyLoading,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof SelectLazyLoading<{ name: string }>>

export const Minimal: Story = {
    args: {
        name: 'min',
        label: 'Minimal select',
        onChange: () => null,
        value: undefined,
        getOptionValue: (item) => item.name,
        getOptionLabel: (item) => item.name,
        option: undefined,
        loadOptions: async () => ({
            options: [{ name: 'Item Name 123' }, { name: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz' }],
            hasMore: false,
            additional: {
                page: 0,
            },
        }),
    },
}

const loadOptions = async (searchQuery: string, additional: { page: number } | undefined) => {
    const page = searchQuery && !additional?.page ? 1 : (additional?.page || 0) + 1
    const options = (await fetch(`https://www.anapioficeandfire.com/api/houses?region=${searchQuery}&page=${page}&pageSize=10`).then((response) =>
        response.json(),
    )) as { name: string }[]
    return {
        options: options || [],
        hasMore: options?.length ? true : false,
        additional: {
            page: page,
        },
    }
}

export const PaginatedRemoteFetch: Story = {
    render: ({ value: initValue, ...args }) => {
        const StateWrapper = () => {
            const [selectedValue, setSelectedValue] = useState(initValue)
            return <SelectLazyLoading value={selectedValue} {...args} onChange={setSelectedValue} />
        }
        return <StateWrapper />
    },
    args: {
        name: 'paginated-remote-fetch',
        label: 'Vyber krajiny',
        value: { name: 'selected item name' },
        getOptionValue: (item) => item.name,
        getOptionLabel: (item) => item.name,
        option: undefined,
        loadOptions: (searchTerm, _, additional) => loadOptions(searchTerm, additional),
    },
}

interface Option {
    name: string
}

export interface IForm {
    selectOption: string
}

const schema = object().shape({ selectOption: string().required('Povinné pole') })

export const UncontrolledFormHookGroup: Story = {
    render: () => {
        const Wrapper = () => {
            const defaultValue = 'House Ashwood'

            const { handleSubmit, setValue, register, formState } = useForm<IForm>({
                defaultValues: { selectOption: defaultValue },
                resolver: yupResolver(schema),
            })
            const onSubmit = (data: IForm) => {
                // eslint-disable-next-line no-alert
                alert('select data: ' + data.selectOption)
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <SelectLazyLoading<Option>
                        id="selectOption"
                        name="selectOption"
                        loadOptions={(searchTerm, _, additional) => loadOptions(searchTerm, additional)}
                        getOptionValue={(item) => item.name}
                        getOptionLabel={(item) => item.name}
                        label="Label test"
                        defaultValue={{ name: defaultValue }}
                        setValue={setValue}
                        register={register}
                        isMulti={false}
                        error={formState.errors.selectOption?.message}
                    />
                    <button type="submit">Submit</button>
                </form>
            )
        }
        return <Wrapper />
    },
}
