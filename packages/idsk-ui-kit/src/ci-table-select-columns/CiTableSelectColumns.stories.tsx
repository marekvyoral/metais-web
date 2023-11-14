import type { Meta, StoryObj } from '@storybook/react'

import { CiTableSelectColumns } from './CiTableSelectColumns'

const meta: Meta<typeof CiTableSelectColumns> = {
    title: 'Components/Table/CiTableSelectColumns',
    component: CiTableSelectColumns,
    tags: ['autodocs'],
}

type Story = StoryObj<typeof CiTableSelectColumns>

export default meta

export const DefaultTableSelectColumns: Story = {
    args: {
        attributeProfilesColumnSections: [
            {
                name: 'Názov informačného systému',
                attributes: [{ technicalName: 'Tname', name: 'Názov informačného systému' }],
            },
            { name: 'Anglický názov', attributes: [{ technicalName: 'Tname2', name: 'Anglický názov' }] },
            { name: 'Popis', attributes: [{ technicalName: 'Tname3', name: 'Popis' }] },
            { name: 'Anglický popis', attributes: [{ technicalName: 'Tname4', name: 'Anglický popis' }] },
            { name: 'Poznámka', attributes: [{ technicalName: 'Tname5', name: 'Poznámka' }] },
            { name: 'Kód MetaIS', attributes: [{ technicalName: 'Tname6', name: 'Kód MetaIS' }] },
            { name: 'Referenčný identifikátor', attributes: [{ technicalName: 'Tname7', name: 'Referenčný identifikátor' }] },
        ],
    },
}
