import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RadioButtonGroup } from './RadioButtonGroup'
import { RadioButton } from './RadioButton'

const meta: Meta<typeof RadioButtonGroup> = {
    title: 'Components/RadioButtonGroup',
    component: RadioButtonGroup,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof RadioButtonGroup>

export const GroupRadioButton: Story = {
    args: {
        children: (
            <>
                <RadioButton id={'id1'} name={'RadioButton'} value={'RadioButton'}>
                    RadioButton 1
                </RadioButton>
                <RadioButton id={'id2'} name={'RadioButton'} value={'RadioButton'}>
                    RadioButton 2
                </RadioButton>
                <RadioButton id={'id3'} name={'RadioButton'} value={'RadioButton'}>
                    RadioButton 3
                </RadioButton>
            </>
        ),
    },
}

export const InlineGroupRadioButton: Story = {
    args: {
        inline: true,
        children: (
            <>
                <RadioButton id={'id1'} name={'RadioButton'} value={'RadioButton'}>
                    RadioButton 1
                </RadioButton>
                <RadioButton id={'id2'} name={'RadioButton'} value={'RadioButton'}>
                    RadioButton 2
                </RadioButton>
            </>
        ),
    },
}
