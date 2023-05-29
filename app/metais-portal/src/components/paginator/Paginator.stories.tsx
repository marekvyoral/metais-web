import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Paginator } from '@/components/paginator/Paginator'

const meta: Meta<typeof Paginator> = {
    title: 'Components/Paginator',
    component: Paginator,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Paginator>

export const Interactive: Story = {
    render: ({ pageNumber, ...args }) => {
        const Wrapper = () => {
            const [page, setPage] = useState(pageNumber)
            return (
                <Paginator
                    {...args}
                    pageNumber={page}
                    onPageChanged={(index) => {
                        setPage(index)
                    }}
                />
            )
        }
        return <Wrapper />
    },
    args: {
        dataLength: 100,
        pageNumber: 5,
        onPageChanged: () => null,
        pageSize: 10,
    },
}
