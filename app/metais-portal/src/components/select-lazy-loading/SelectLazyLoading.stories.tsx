import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { SelectLazyLoading } from '@/components/select-lazy-loading/SelectLazyLoading'

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
            options: [{ name: 'Item Name 123' }],
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
