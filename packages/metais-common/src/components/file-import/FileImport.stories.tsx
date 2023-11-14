import type { Meta, StoryObj } from '@storybook/react'

import { FileImport } from './FileImport'

const meta: Meta<typeof FileImport> = {
    title: 'Components/FileImport',
    component: FileImport,
    tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FileImport>

export const Basic: Story = {
    args: {
        endpointUrl: '',
        multiple: true,
        allowedFileTypes: ['image/*', '.jpg', '.jpeg', '.png', '.gif', 'video/*'],
    },
}
