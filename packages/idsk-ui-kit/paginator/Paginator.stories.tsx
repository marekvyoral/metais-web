import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Paginator } from './Paginator'

const meta: Meta<typeof Paginator> = {
    title: 'Components/Paginator',
    component: Paginator,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Paginator>

export const Interactive: Story = {
    render: ({ pagination, ...args }) => {
        const Wrapper = () => {
            const [page, setPage] = useState(pagination.pageNumber)
            return (
                <Paginator
                    {...args}
                    pagination={{ ...pagination, pageNumber: page }}
                    onPageChanged={(index) => {
                        setPage(index)
                    }}
                />
            )
        }
        return <Wrapper />
    },
    args: {
        pagination: {
            dataLength: 100,
            pageNumber: 5,
            pageSize: 10,
        },
        onPageChanged: () => null,
    },
}
