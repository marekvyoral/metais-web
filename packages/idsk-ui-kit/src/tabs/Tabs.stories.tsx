import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { Tabs } from './Tabs'

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

const tabList = [
    {
        id: '1',
        title: 'Uplynuly den 1',
        content: table[0],
    },
    {
        id: '2',
        title: 'Uplynulý týždeň 2',
        content: table[1],
    },
    {
        id: '3',
        title: 'Uplynulý týždeň 3',
        content: table[1],
    },
    {
        id: '4',
        title: 'Uplynulý týždeň 4',
        content: table[1],
    },
    {
        id: '5',
        title: 'Uplynulý týždeň 5',
        content: table[1],
    },
    {
        id: '6',
        title: 'Uplynulý týždeň 6',
        content: table[1],
    },
    {
        id: '7',
        title: 'Uplynulý týždeň 7',
        content: table[1],
    },
    {
        id: '8',
        title: 'Uplynulý týždeň 8',
        content: table[1],
    },
]

export const Main: Story = {
    args: {
        tabList: tabList,
    },
    decorators: [
        (StoryComponent) => (
            <BrowserRouter>
                <StoryComponent />
            </BrowserRouter>
        ),
    ],
}

export const NoOther: Story = {
    args: {
        tabList: tabList.slice(0, 5),
    },
    decorators: [
        (StoryComponent) => (
            <BrowserRouter>
                <StoryComponent />
            </BrowserRouter>
        ),
    ],
}
