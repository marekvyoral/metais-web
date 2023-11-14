import type { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from './Tooltip'

import { Button } from '@/button/Button'
import { Input } from '@/input/Input'
import { TextHeading } from '@/typography/TextHeading'

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Empty: Story = {
    args: {
        descriptionElement: 'empty-input',
    },
}

export const ButtonChild: Story = {
    args: {
        descriptionElement: <TextHeading size="S">Cillum eiusmod Lorem elit eiusmod tempor</TextHeading>,
        tooltipContent: (open) => <Button label="open" onFocus={() => open()} />,
        position: 'bottom center',
    },
}

export const ButtonSendTextChild: Story = {
    args: {
        descriptionElement: <TextHeading size="S">Cillum eiusmod Lorem elit eiusmod tempor</TextHeading>,
        tooltipContent: (open) => <Button label="open" onFocus={() => open()} />,
        position: 'bottom center',
    },
}

export const InputChild: Story = {
    args: {
        descriptionElement: 'Ut mollit magna enim ipsum deserunt.',
        tooltipContent: (open) => <Input name="open" onFocus={() => open()} />,
        position: 'bottom center',
    },
}
