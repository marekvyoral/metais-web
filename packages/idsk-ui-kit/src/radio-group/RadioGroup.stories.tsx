import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { RadioGroup } from './RadioGroup'

import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'

const meta: Meta<typeof RadioGroup> = {
    title: 'Components/RadioGroupWithLabel',
    component: RadioGroup,
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof RadioGroup>

export const GroupRadioButton: Story = {
    args: {
        label: 'Radio buttons label',
        children: (
            <>
                <RadioButton id={'GroupRadioButton.1'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
                <RadioButton id={'GroupRadioButton.2'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 2'} />
                <RadioButton id={'GroupRadioButton.3'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 3'} />
            </>
        ),
    },
}

export const InlineGroupRadioButton: Story = {
    args: {
        inline: true,
        label: 'Radio buttons label',
        children: (
            <>
                <RadioButton id={'InlineGroupRadioButton.1'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
                <RadioButton id={'InlineGroupRadioButton.2'} name={'RadioButton'} value={'RadioButton'} label={'RadioButton 1'} />
            </>
        ),
    },
}
