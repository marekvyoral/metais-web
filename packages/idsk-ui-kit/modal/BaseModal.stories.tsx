import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { BaseModal } from './BaseModal'

import { TextHeading } from '@isdd/idsk-ui-kit/typography/TextHeading'
import { RadioButton } from '@isdd/idsk-ui-kit/radio-button/RadioButton'
import { RadioButtonGroup } from '@isdd/idsk-ui-kit/radio-button-group/RadioButtonGroup'

const meta: Meta<typeof BaseModal> = {
    title: 'Components/modal/BaseModal',
    component: BaseModal,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof BaseModal>

export const DefaultBaseModal: Story = {
    args: {
        isOpen: true,
        children: (
            <>
                <TextHeading size={'L'}>Export položiek alebo vzťahov</TextHeading>
                <div className="govuk-radios--small">
                    <RadioButtonGroup inline>
                        <RadioButton id={'id1'} name={'RadioButton'} value={'RadioButton'} label="Položky" />
                        <RadioButton id={'id2'} name={'RadioButton'} value={'RadioButton'} label="Vzťahy" />
                    </RadioButtonGroup>
                </div>
            </>
        ),
    },
}
