import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SubmitWithFeedback } from './SubmitWithFeedback'

import { Button } from '@metais-web/idsk-ui-kit'

const meta: Meta<typeof SubmitWithFeedback> = {
    title: 'Components/SubmitWithFeedback',
    component: SubmitWithFeedback,
}

export default meta
type Story = StoryObj<typeof SubmitWithFeedback>

export const Basic: Story = {
    args: {
        submitButtonLabel: 'Uložiť zmeny',
        loading: true,
    },
}

export const InFormUsage: Story = {
    render: (args) => {
        const Wrapper = () => {
            const { handleSubmit } = useForm()
            const [loading, setLoading] = useState(args.loading)
            const { t } = useTranslation()
            const submit = handleSubmit(() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 3000)
            })
            return (
                <form onSubmit={submit}>
                    <SubmitWithFeedback
                        submitButtonLabel={args.submitButtonLabel}
                        loading={loading}
                        additionalButtons={[
                            <Button label={t('form.cancel')} variant="secondary" disabled={loading} onClick={() => null} key="cancel" />,
                        ]}
                    />
                </form>
            )
        }
        return <Wrapper />
    },
    args: {
        submitButtonLabel: 'Uložiť zmeny',
        loading: false,
    },
}
