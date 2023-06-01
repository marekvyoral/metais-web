import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EntityRelationsListContainer, IRelationsView } from './EntityRelationsListContainer'

const View: React.FC<IRelationsView> = ({ entityTypes, relationsList, keysToDisplay, setClickedEntityName, setPageConfig }) => {
    return (
        <div>
            <p>shows that it only start calls api when clicked on entity</p>
            {keysToDisplay.map((key) => (
                <button key={key} onClick={() => setClickedEntityName(key)}>
                    {key}
                </button>
            ))}
            <p>status</p>
            <p>{JSON.stringify(relationsList.map((item) => item.status))}</p>
            <p>isFetching</p>
            <p>{JSON.stringify(relationsList.map((item) => item.isFetching))}</p>
        </div>
    )
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

const queryClient = new QueryClient()

const meta: Meta<typeof EntityRelationsListContainer> = {
    title: 'Components/EntityRelationsListContainer',
    component: EntityRelationsListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof EntityRelationsListContainer>

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
        View: View,
        LoadingView: Loading,
        ErrorView: Error,
    },
}
