import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Stepper } from './Stepper'
import { ISection } from './StepperSection'

const sectionList: ISection[] = [
    {
        title: 'Výber pediatra',
        id: '1',
        stepLabel: {
            label: '1',
            variant: 'circle',
        },
        content: <button>ola</button>,
    },
    {
        title: 'Výber pediatra',
        id: '2',
        isTitle: true,
    },
    {
        title: 'Výber pediatra',
        id: '3',
        stepLabel: {
            label: '2',
            variant: 'circle',
        },
        content: <button>ola</button>,
    },
    {
        title: 'Výber pediatra',
        id: '4',
        isTitle: true,
    },
    {
        title: 'Výber pediatra',
        id: '5',
        stepLabel: {
            label: '3',
            variant: 'circle',
        },
        content: <button>ola</button>,
    },
    {
        title: 'Výber pediatra',
        id: '6',
        stepLabel: {
            label: 'a',
            variant: 'no-outline',
        },
        content: <button>ola</button>,
    },
    {
        title: 'Výber pediatra',
        id: '7',
        stepLabel: {
            label: '4',
            variant: 'circle',
        },
        last: true,
        content: <button>ola</button>,
    },
]

const meta: Meta<typeof Stepper> = {
    title: 'Components/Stepper',
    component: Stepper,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Stepper>

export const Main: Story = {
    decorators: [(StoryComponent) => <StoryComponent />],
    args: {
        description: 'Čo je potrebné vybaviť a zariadieť keď sa Vám má narodiť dieťa ?',
        subtitleTitle: 'I am first subtitle with show all',
        stepperList: sectionList,
    },
}
