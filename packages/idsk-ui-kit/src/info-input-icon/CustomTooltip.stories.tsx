import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Button } from '..'

import { CustomTooltip } from './CustomTooltip'

const meta: Meta<typeof CustomTooltip> = {
    title: 'Components/CustomTooltip',
    component: CustomTooltip,
}

export default meta
type Story = StoryObj<typeof CustomTooltip>

export const Basic: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
    },
}

export const WithChild: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
        children: <Button label="open" />,
    },
}

export const openOnClick: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
        children: <Button label="open" />,
        openOnClick: true,
        // closeOnEsc: true,
        // clickable: true,
    },
}

export const openOnClickAndClickable: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
        children: <Button label="open" />,
        openOnClick: true,
        // closeOnEsc: true,
        clickable: true,
    },
}
