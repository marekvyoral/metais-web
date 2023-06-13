import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { RelationsListContainer, IRelationsView } from './RelationsListContainer'

export const RelationsView: React.FC<IRelationsView> = ({ data, setClickedEntityName }) => {
    return (
        <div>
            <p>shows that it only start calls api when clicked on entity</p>
            {data.keysToDisplay.map((key) => (
                <button key={key} onClick={() => setClickedEntityName(key)}>
                    {key}
                </button>
            ))}
            <p>status</p>
            <p>{JSON.stringify(data.relationsList)}</p>
            <p>isFetching</p>
            <p>{JSON.stringify(data.relationsList)}</p>
        </div>
    )
}

const queryClient = new QueryClient()

const meta: Meta<typeof RelationsListContainer> = {
    title: 'Components/RelationsListContainer',
    component: RelationsListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof RelationsListContainer>

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
        View: RelationsView,
    },
}
