import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { AccordionContainer } from '@portal/components/Accordion'

const meta: Meta<typeof AccordionContainer> = {
    title: 'Components/Accordion',
    component: AccordionContainer,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AccordionContainer>

export const Basic: Story = {
    args: {
        sections: [
            { title: 'Title1', summary: 'Summary1', content: 'content-1' },

            { title: 'Title2', summary: 'Summary2', content: 'content-2' },

            { title: 'Title3', summary: 'Summary1', content: 'content-3' },
            {
                title: 'Title4',
                summary: (
                    <>
                        Summary <b>4</b> (JSX)
                    </>
                ),
                content: 'content-4',
            },
        ],
    },
}
