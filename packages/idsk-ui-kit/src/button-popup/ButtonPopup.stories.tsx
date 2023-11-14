import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { ButtonPopup } from './ButtonPopup'

import { Button } from '@isdd/idsk-ui-kit/button/Button'
import { Input } from '@isdd/idsk-ui-kit/input/Input'

const meta: Meta<typeof ButtonPopup> = {
    title: 'Components/ButtonPopup',
    component: ButtonPopup,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ButtonPopup>

export const Simple: Story = {
    args: {
        popupContent: () => 'Text in popup',
        buttonLabel: 'Button',
    },
}

export const FormPositionRight: Story = {
    render: ({ popupPosition, buttonLabel, popupContent }) => {
        return (
            <div style={{ marginLeft: 450 }}>
                <ButtonPopup buttonLabel={buttonLabel} popupPosition={popupPosition} popupContent={popupContent} />
            </div>
        )
    },
    args: {
        popupContent: (closePopup) => (
            <div style={{ border: '1px solid', height: 250, width: 250 }}>
                <Input id="name" name="name" />
                <Button label="Save" onClick={closePopup} />
            </div>
        ),
        buttonLabel: 'Button',
        popupPosition: 'right',
    },
}

export const PopupOutOfWindow: Story = {
    args: {
        popupContent: (closePopup) => (
            <div style={{ border: '1px solid', height: 250, width: 250 }}>
                <Input id="name" name="name" />
                <Button label="Save" onClick={closePopup} />
            </div>
        ),
        buttonLabel: 'Button',
        popupPosition: 'right',
    },
}
