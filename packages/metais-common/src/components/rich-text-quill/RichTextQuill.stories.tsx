import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import React from 'react'
import ReactQuill from 'react-quill'

import { RichTextQuill } from './RichTextQuill'

const meta: Meta<typeof RichTextQuill> = {
    title: 'Components/RichTextQuill',
    component: RichTextQuill,
}

export default meta
type Story = StoryObj<typeof RichTextQuill>

export const Empty: Story = {
    args: {
        label: 'Popis',
        isRequired: true,
    },
}
export interface IForm {
    richText: ReactQuill.Value
}

export const UncontrolledFormQuill: Story = {
    render: (args) => {
        const Wrapper = () => {
            const { handleSubmit, setValue } = useForm<IForm>({
                defaultValues: { richText: '' },
            })
            const onSubmit = (data: IForm) => {
                // eslint-disable-next-line no-alert
                alert('select data: ' + data.richText)
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <RichTextQuill {...args} setValue={setValue} />
                    <button type="submit">Submit</button>
                </form>
            )
        }
        return <Wrapper />
    },
    args: {
        name: 'richText',
        info: 'RichText',
        label: 'RichText',
        isRequired: true,
        error: 'Error',
    },
}

export const ControlledFormQuill: Story = {
    render: (args) => {
        const Wrapper = () => {
            const onChange = (newValue: string) => {
                // eslint-disable-next-line no-console
                console.log(newValue)
            }

            return <RichTextQuill {...args} onChange={onChange} />
        }
        return <Wrapper />
    },
    args: {
        name: 'richText',
        info: 'RichText',
        label: 'RichText',
        isRequired: true,
        value: 'Umpa Lumpa',
    },
}
