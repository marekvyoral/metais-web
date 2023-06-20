import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { CiContainer, ICiContainerView } from './CiContainer'

export const View: React.FC<ICiContainerView> = ({ data }) => {
    return <div>{JSON.stringify(data)?.slice(0, 100)}...</div>
}

const queryClient = new QueryClient()

const meta: Meta<typeof CiContainer> = {
    title: 'Components/EntityCiContainer',
    component: CiContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof CiContainer>

export const Main: Story = {
    decorators: [
        (StoryComponent) => (
            <QueryClientProvider client={queryClient}>
                <StoryComponent />
            </QueryClientProvider>
        ),
    ],
    args: {
        configurationItemId: '0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e',
        View: View,
    },
    //entityName: 'KRIS',
}
