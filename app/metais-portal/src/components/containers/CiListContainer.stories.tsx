import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'

import { CiTable } from '../ci-table/CiTable'

import { CiListContainer } from './CiListContainer'

const queryClient = new QueryClient()

const meta: Meta<typeof CiListContainer> = {
    title: 'Components/CiListContainer',
    component: CiListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CiListContainer>
interface FilterData extends IFilterParams {
    name?: string
}
export const Main: Story = {
    render: () => (
        <QueryClientProvider client={queryClient}>
            <CiListContainer<FilterData>
                defaultFilterValues={{}}
                entityName="Projekt"
                ListComponent={({ data, handleFilterChange, pagination, sort }) => (
                    <>
                        <CiTable data={data} handleFilterChange={handleFilterChange} pagination={pagination} sort={sort} />
                    </>
                )}
            />
        </QueryClientProvider>
    ),
}
