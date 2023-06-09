import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RadioButtonGroup } from '@portal/components/RadioButtonGroup'
import { RadioButton } from '@portal/components/RadioButton'

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
                <RadioButton id={'id1'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
                <RadioButton id={'id2'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 2'} />
                <RadioButton id={'id3'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 3'} />
            </>
        ),
    },
}

export const InlineGroupRadioButton: Story = {
    args: {
        inline: true,
        children: (
            <>
                <RadioButton id={'id1'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
                <RadioButton id={'id2'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
            </>
        ),
    },
}
