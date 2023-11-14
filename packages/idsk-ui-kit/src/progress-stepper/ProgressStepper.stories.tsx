import type { Meta, StoryObj } from '@storybook/react'

import { ProgressStepper } from './ProgressStepper'

const meta: Meta<typeof ProgressStepper> = {
    title: 'Components/ProgressStepper',
    component: ProgressStepper,
}

export default meta
type Story = StoryObj<typeof ProgressStepper>

const steps = [
    { name: 'Ohlásený', date: '2023-10-11' },
    {
        name: 'Hodnotený',
        date: '2023-10-14',
        description: 'Vratený na dopracovanie',
    },
    { name: 'Schvalený' },
    { name: 'Realizovaný' },
    { name: 'Ukončený' },
]

export const Basic: Story = {
    args: {
        currentStep: 2,
        steps: steps,
    },
}

export const NoCurrentStep: Story = {
    args: {
        currentStep: -1,
        steps: steps,
    },
}

export const AllFinished: Story = {
    args: {
        currentStep: steps.length,
        steps: steps,
    },
}
