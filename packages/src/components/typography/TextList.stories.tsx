import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TextList } from '@/components/typography/TextList'
import { TextListItem } from '@/components/typography/TextListItem'

const meta: Meta<typeof TextList> = {
    title: 'Components/typography/TextList',
    component: TextList,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof TextList>

export const DefaultTextList: Story = {
    args: {
        children: (
            <>
                <TextListItem>List item 1</TextListItem>
                <TextListItem>List item 2</TextListItem>
                <TextListItem>List item 3</TextListItem>
            </>
        ),
    },
}

export const NumberTextList: Story = {
    args: {
        variant: 'number',
        children: (
            <>
                <TextListItem>List item 1</TextListItem>
                <TextListItem>List item 2</TextListItem>
                <TextListItem>List item 3</TextListItem>
            </>
        ),
    },
}

export const BulletTextList: Story = {
    args: {
        variant: 'bullet',
        children: (
            <>
                <TextListItem>List item 1</TextListItem>
                <TextListItem>List item 2</TextListItem>
                <TextListItem>List item 3</TextListItem>
            </>
        ),
    },
}
