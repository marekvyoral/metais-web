import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { ColumnsOutputDefinition } from '@/componentHelpers/ci/ciTableHelpers'
import { CiTable } from '@/components/ci-table/CiTable'
import { CiListContainer } from '@/components/containers/CiListContainer'

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
    render: () => {
        const MainWrapper = () => {
            const [rowSelection, setRowSelection] = useState<Record<string, ColumnsOutputDefinition>>({})
            return (
                <QueryClientProvider client={queryClient}>
                    <CiListContainer<FilterData>
                        defaultFilterValues={{}}
                        entityName="Projekt"
                        ListComponent={({
                            tableData,
                            columnListData,
                            attributeProfiles,
                            attributes,
                            ciData,
                            constraintsData,
                            entityStructure,
                            gestorsData,
                            unitsData,
                            handleFilterChange,
                            pagination,
                            sort,
                            isError,
                            isLoading,
                        }) => (
                            <>
                                <CiTable
                                    data={{
                                        tableData,
                                        columnListData,
                                        attributeProfiles,
                                        attributes,
                                        ciData,
                                        constraintsData,
                                        entityStructure,
                                        gestorsData,
                                        unitsData,
                                    }}
                                    handleFilterChange={handleFilterChange}
                                    pagination={pagination}
                                    sort={sort}
                                    isError={isError}
                                    isLoading={isLoading}
                                    rowSelectionState={{ rowSelection, setRowSelection }}
                                />
                            </>
                        )}
                    />
                </QueryClientProvider>
            )
        }
        return <MainWrapper />
    },
}
