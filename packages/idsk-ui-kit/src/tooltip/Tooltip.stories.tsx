import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from './Tooltip'

import { Button } from '@isdd/idsk-ui-kit/button/Button'

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
}

export default meta
type Story = StoryObj<typeof Tooltip>

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
        children: <Button label="Child" />,
    },
}

export const openOnClick: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
        children: <Button label="open" />,
        openOnClick: true,
    },
}

export const openOnClickAndClickable: Story = {
    args: {
        description: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
        id: '1',
        children: <Button label="open" />,
        openOnClick: true,
        closeOnEsc: true,
        clickable: true,
    },
}
