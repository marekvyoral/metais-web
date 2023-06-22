import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { Filter } from './Filter'
import { SearchInput } from '@isdd/idsk-ui-kit/searchInput/SearchInput'

const meta: Meta<typeof Filter> = {
    title: 'Components/Filter',
    component: Filter,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Filter>

export const Basic: Story = {
    args: {
        heading: <SearchInput name="search" id="test" />,
        form: <div>Test</div>,
    },
}
