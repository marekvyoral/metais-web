import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ProjectListContainer } from './ProjectListContainer'

interface IView {
    data: any
}

const View: React.FC<IView> = ({ data }) => {
    console.log(data)
    return <>view</>
}
const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

const queryClient = new QueryClient()

const meta: Meta<typeof ProjectListContainer> = {
    title: 'Components/ProjectListContainer',
    component: ProjectListContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ProjectListContainer>

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
        LoadingView: Loading,
        ErrorView: Error,
    },
}
