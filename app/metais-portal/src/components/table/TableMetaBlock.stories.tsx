import { Meta, StoryObj } from '@storybook/react'

import { TableMetaBlock } from '@/components/table/TableMetaBlock'

const meta: Meta<typeof TableMetaBlock> = {
    title: 'Components/Table/TableMetaBlock',
    component: TableMetaBlock,
}

type Story = StoryObj<typeof TableMetaBlock>

export default meta

export const MinimalIsInvisible: Story = {
    args: {},
}

export const ResetButtonVisible: Story = {
    args: { showResetColumnOrderButton: true, isOrderModified: true, resetColumnOrder: () => null },
}

export const WithSource: Story = {
    args: { source: { value: 'Source', href: 'http://google.com' } },
}

export const ResetButonAndSource: Story = {
    args: {
        source: { value: 'Source', href: 'http://google.com' },
        showResetColumnOrderButton: true,
        isOrderModified: true,
        resetColumnOrder: () => null,
    },
}
