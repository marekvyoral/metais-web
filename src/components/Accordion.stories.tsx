import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { AccordionContainer, AccordionSection } from './Accordion'

const meta: Meta<typeof AccordionContainer> = {
  title: 'Components/Accordion',
  component: AccordionContainer,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AccordionContainer>

export const Basic: Story = {
  args: {
    children: [
      <AccordionSection title="Title1" summary="Summary1" key="section1">
        test1
      </AccordionSection>,
      <AccordionSection title="Title2" summary="Summary2" key="section2">
        test2
      </AccordionSection>,
      <AccordionSection title="Title3" summary="Summary1" key="section3">
        test3
      </AccordionSection>,
      <AccordionSection
        title="Title3"
        summary={
          <>
            Summary<b>4</b>
          </>
        }
        key="section4"
      >
        test3
      </AccordionSection>,
    ],
  },
}
