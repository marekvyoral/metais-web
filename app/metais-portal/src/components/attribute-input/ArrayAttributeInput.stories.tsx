import { useTranslation } from 'react-i18next'
import { FieldErrors, FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Button } from '@isdd/idsk-ui-kit/index'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api'
import { Meta, StoryObj } from '@storybook/react'

import { AttributeInput } from './AttributeInput'

import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'

const meta: Meta<typeof AttributeInput> = {
    title: 'Components/AttributeInput',
    component: AttributeInput,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AttributeInput>

const hasAttributeInputError = (
    attribute: Attribute,
    errors: FieldErrors<{
        [x: string]: string | number | boolean | Date | null | undefined
    }>,
) => {
    if (attribute.technicalName != null) {
        const error = Object.keys(errors).includes(attribute.technicalName)
        return error ? errors[attribute.technicalName] : undefined
    }
    return undefined
}

const arrayAttribute = {
    array: true,
    constraints: [],
    defaultValue: '',
    description: 'Som array input',
    displayAs: '',
    engDescription: 'I am array input',
    engName: 'array input',
    mandatory: { type: '' },
    name: 'array input',
    technicalName: 'ArrayAttributeInput',
    attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
    valid: true,
    readOnly: false,
}

export const ArrayInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([args.attribute], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: arrayAttribute,
        constraints: {},
        hint: '',
    },
}
