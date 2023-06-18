import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Tabs } from '../tabs/Tabs'

import { DocumentsListContainer, IView } from './DocumentListContainer'

export const DocsView: React.FC<IView> = ({ data }) => {
    const tabList = [
        {
            id: '1',
            title: 'data z kontainera',
            content: <p>{JSON.stringify(data)?.slice(0, 200)}...</p>,
        },
    ]

    return (
        <>
            <Tabs tabList={tabList} />
        </>
    )
}

const queryClient = new QueryClient()

const meta: Meta<typeof DocumentsListContainer> = {
    title: 'Components/DocumentsListContainer',
    component: DocumentsListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DocumentsListContainer>

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
        View: DocsView,
    },
}
