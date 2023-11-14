import type { Meta, StoryObj } from '@storybook/react'

import { TableSelectColumns } from './TableSelectColumns'

const meta: Meta<typeof TableSelectColumns> = {
    title: 'Components/Table/TableSelectColumns',
    component: TableSelectColumns,
    tags: ['autodocs'],
}

type Story = StoryObj<typeof TableSelectColumns>

export default meta

export const DefaultTableSelectColumns: Story = {
    args: {
        columns: [
            { technicalName: 'Tname', name: 'Názov informačného systému', selected: false },
            { technicalName: 'Tname2', name: 'Anglický názov', selected: false },
            { technicalName: 'Tname3', name: 'Popis', selected: false },
            { technicalName: 'Tname4', name: 'Anglický popis', selected: false },
            { technicalName: 'Tname5', name: 'Poznámka', selected: true },
            { technicalName: 'Tname6', name: 'Kód MetaIS', selected: true },
            { technicalName: 'Tname7', name: 'Referenčný identifikátor', selected: false },
            { technicalName: 'Tname8', name: 'name8', selected: false },
            { technicalName: 'Tname9', name: 'name9', selected: false },
        ],
        header: 'ISVS',
    },
}
