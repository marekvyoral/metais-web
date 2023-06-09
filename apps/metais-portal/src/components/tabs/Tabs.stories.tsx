import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Tabs } from '@portal/components/tabs/Tabs'

const table = [
    <table key={1} className="govuk-table">
        <thead className="govuk-table__head">
            <tr className="govuk-table__row">
                <th className="govuk-table__header" scope="col">
                    Manažér prípadu
                </th>
                <th className="govuk-table__header" scope="col">
                    Otvorené prípady
                </th>
                <th className="govuk-table__header" scope="col">
                    Uzavreté prípady
                </th>
            </tr>
        </thead>
        <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">David Francis</td>
                <td className="govuk-table__cell">3</td>
                <td className="govuk-table__cell">0</td>
            </tr>
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">Paul Farmer</td>
                <td className="govuk-table__cell">1</td>
                <td className="govuk-table__cell">0</td>
            </tr>
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">Rita Patel</td>
                <td className="govuk-table__cell">2</td>
                <td className="govuk-table__cell">0</td>
            </tr>
        </tbody>
    </table>,
    <table key={2} className="govuk-table">
        <thead className="govuk-table__head">
            <tr className="govuk-table__row">
                <th className="govuk-table__header" scope="col">
                    Manažér prípadu
                </th>
                <th className="govuk-table__header" scope="col">
                    Otvorené prípady
                </th>
                <th className="govuk-table__header" scope="col">
                    Uzavreté prípady
                </th>
            </tr>
        </thead>
        <tbody className="govuk-table__body">
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">David Francis</td>
                <td className="govuk-table__cell">24</td>
                <td className="govuk-table__cell">18</td>
            </tr>
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">Paul Farmer</td>
                <td className="govuk-table__cell">16</td>
                <td className="govuk-table__cell">20</td>
            </tr>
            <tr className="govuk-table__row">
                <td className="govuk-table__cell">Rita Patel</td>
                <td className="govuk-table__cell">24</td>
                <td className="govuk-table__cell">27</td>
            </tr>
        </tbody>
    </table>,
]

const meta: Meta<typeof Tabs> = {
    title: 'Components/Tabs',
    component: Tabs,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Main: Story = {
    args: {
        tabList: [
            {
                id: '1',
                title: 'Uplynuly den',
                content: table[0],
            },
            {
                id: '2',
                title: 'Uplynulý týždeň',
                content: table[1],
            },
        ],
    },
}
