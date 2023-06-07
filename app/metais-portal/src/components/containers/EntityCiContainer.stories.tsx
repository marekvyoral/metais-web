import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EntityCiContainer, IEntityCiContainerView } from './EntityCiContainer'

export const View: React.FC<IEntityCiContainerView> = ({ data }) => {
    return <div>view</div>
}

const queryClient = new QueryClient()

const meta: Meta<typeof EntityCiContainer> = {
    title: 'Components/EntityCiContainer',
    component: EntityCiContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EntityCiContainer>

export const Main: Story = {
    decorators: [
        (StoryComponent) => (
            <QueryClientProvider client={queryClient}>
                <StoryComponent />
            </QueryClientProvider>
        ),
    ],
    args: {
        entityId: '0d80f45b-f3ff-47f5-9ff6-4a0a43c65c4e',
        entityName: 'KRIS',
        View: View,
    },
}
