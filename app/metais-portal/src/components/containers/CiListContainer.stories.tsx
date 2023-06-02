import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CiListContainer } from './CiListContainer'

interface IView {
    data: any
}

const View: React.FC<IView> = ({ data }) => {
    return <>view</>
}

const queryClient = new QueryClient()

const meta: Meta<typeof CiListContainer> = {
    title: 'Components/CiListContainer',
    component: CiListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CiListContainer>

export const Main: Story = {
    decorators: [
        (StoryComponent) => (
            <QueryClientProvider client={queryClient}>
                <StoryComponent />
            </QueryClientProvider>
        ),
    ],
    args: {
        entityName: 'Projekt',
        View: View,
    },
}
