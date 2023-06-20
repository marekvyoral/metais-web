import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { QueryFeedback } from './QueryFeedback'

const meta: Meta<typeof QueryFeedback> = {
    title: 'Components/QueryFeedback',
    component: QueryFeedback,
}

export default meta
type Story = StoryObj<typeof QueryFeedback>

export const Basic: Story = {
    args: {
        loading: true,
        error: false,
        indicatorProps: { fullscreen: true },
        errorProps: {
            errorTitle: 'Miesto pre správu, ktorá upozorňuje, že nastal problém',
            errorMessage: 'Priestor pre popis, k akým chybám došlo a ako ich opraviť.',
        },
    },
    render: (args) => {
        const Wrapper = () => {
            return (
                <div style={{ border: '1px solid black', width: '700px', height: '700px', position: 'relative' }}>
                    <QueryFeedback loading={args.loading} error={args.error} indicatorProps={args.indicatorProps} errorProps={args.errorProps}>
                        <div style={{ backgroundColor: 'grey', width: '300px', height: '300px' }}>Child div</div>
                    </QueryFeedback>
                </div>
            )
        }
        return <Wrapper />
    },
}
