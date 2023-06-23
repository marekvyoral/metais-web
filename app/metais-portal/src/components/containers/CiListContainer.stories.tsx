import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

export const Main: Story = {
    render: () => (
        <QueryClientProvider client={queryClient}>
            <CiListContainer
                entityName="Projekt"
                ListComponent={({ data, handleFilterChange, pagination }) => (
                    <>
                        <CiTable data={data} handleFilterChange={handleFilterChange} pagination={pagination} />
                    </>
                )}
            />
        </QueryClientProvider>
    ),
}
