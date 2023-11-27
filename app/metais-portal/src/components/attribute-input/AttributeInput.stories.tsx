import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { FieldErrors, FieldValues, useForm } from 'react-hook-form'
import { Button } from '@isdd/idsk-ui-kit/index'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'
import { Attribute, AttributeAttributeTypeEnum, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { AttributeInput } from './AttributeInput'

import { generateFormSchema } from '@/components/create-entity/createCiEntityFormSchema'

const meta: Meta<typeof AttributeInput> = {
    title: 'Components/AttributeInput',
    component: AttributeInput,
    tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof AttributeInput>

const textAttribute = {
    array: false,
    constraints: [],
    defaultValue: '',
    description: 'Som text input',
    displayAs: '',
    engDescription: 'I am text input',
    engName: 'text input',
    mandatory: { type: '' },
    name: 'text input',
    technicalName: 'AttributeInput',
    attributeTypeEnum: AttributeAttributeTypeEnum.STRING,
    valid: true,
    readOnly: false,
}

const defaultAttribute = {
    ...textAttribute,
    attributeTypeEnum: undefined,
    name: 'default input',
    description: 'I am default input',
}

const doubleAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.DOUBLE,
    name: 'double input',
    description: 'I am double input',
    mandatory: { type: 'critical' },
}

const intervalAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.INTEGER,
    name: 'interval input',
    description: 'som interval input',
    constraints: [{ type: 'interval', minValue: 1, maxValue: 10 }],
    mandatory: { type: 'critical' },
}

const requiredTextAttribute = {
    ...textAttribute,
    mandatory: { type: 'critical' },
}

const textAreaAttribute = {
    ...textAttribute,
    description: 'I am textarea',
    name: 'textarea',
    displayAs: 'textarea',
}

const selectAttribute = {
    ...textAttribute,
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
    defaultValue: 'c_spolocne_moduly.1',
}

const multiSelectAttribute = {
    ...textAttribute,
    array: true,
    constraints: [{ type: 'enum', enumCode: 'SPOLOCNE_MODULY' }],
    defaultValue: 'c_spolocne_moduly.1',
}

const checkBoxAttribute = {
    ...textAttribute,
    description: 'checkbox',
    name: 'checkbox',
    attributeTypeEnum: AttributeAttributeTypeEnum.BOOLEAN,
}

const fileAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.IMAGE,
}

const dateAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.DATE,
}

const regexTextAttribute = {
    ...textAttribute,
    name: 'phone number',
    constraints: [{ type: 'regex', regex: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$|^$' }],
}

const byteAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.BYTE,
    name: 'Byte input',
}

const shortAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.SHORT,
    name: 'short input',
}
const floatAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.FLOAT,
    name: 'float with regex input',
    constraints: [{ type: 'regex', regex: '^[0-3]{3}$' }],
}
const longAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.LONG,
    name: 'long input',
}

const characterAttribute = {
    ...textAttribute,
    attributeTypeEnum: AttributeAttributeTypeEnum.CHARACTER,
    name: 'character input',
}

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

export const TextInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: textAttribute,
        constraints: {},
        hint: '',
    },
}

export const RequiredTextInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: requiredTextAttribute,
        constraints: {},
        hint: '',
    },
}

export const RegexTextInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: regexTextAttribute,
        constraints: {},
        hint: '',
    },
}

export const DateInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: dateAttribute,
        constraints: {},
        hint: '',
    },
}

export const FileInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: fileAttribute,
        constraints: {},
        hint: '',
    },
}

export const TextAreaInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: textAreaAttribute,
        constraints: {},
        hint: '',
    },
}

export const SelectInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: selectAttribute,
        constraints: {
            category: '',
            code: 'CODE',
            description: 'DESCRIPTION',
            //get data from hwo to Display constraints
            enumItems: [
                {
                    id: 10352,
                    code: 'c_spolocne_moduly.1',
                    value: 'Autentication modul',
                    valid: true,
                    description: 'Autentication modul',
                    orderList: 1,
                    engValue: 'Autentication modul',
                    engDescription: 'Autentication modul',
                },
            ],
            id: 1,
            name: 'name',
            valid: true,
        },
        hint: '',
    },
}

export const MultiSelectInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: multiSelectAttribute,
        constraints: {
            category: '',
            code: 'CODE',
            description: 'DESCRIPTION',
            enumItems: [
                {
                    id: 10352,
                    code: 'c_spolocne_moduly.1',
                    value: 'Autentication modul',
                    valid: true,
                    description: 'Autentication modul',
                    orderList: 1,
                    engValue: 'Autentication modul',
                    engDescription: 'Autentication modul',
                },
                {
                    id: 10353,
                    code: 'c_spolocne_moduly.2',
                    value: 'Autentication modul 2',
                    valid: true,
                    description: 'Autentication modul 2',
                    orderList: 2,
                    engValue: 'Autentication modul 2',
                    engDescription: 'Autentication modul 2',
                },
            ],
            id: 1,
            name: 'name',
            valid: true,
        },
        hint: '',
    },
}

export const CheckBoxInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: checkBoxAttribute,
        constraints: {},
        hint: '',
    },
}

export const IntervalInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: intervalAttribute,
        constraints: {},
        hint: '',
    },
}

export const DoubleInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: doubleAttribute,
        constraints: {},
        hint: '',
    },
}

export const defaultInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: defaultAttribute,
        constraints: {},
        hint: '',
    },
}

export const byteInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: byteAttribute,
        constraints: {},
        hint: '',
    },
}

export const shortInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: shortAttribute,
        constraints: {},
        hint: '',
    },
}

export const floatWithRegexInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: floatAttribute,
        constraints: {},
        hint: '',
    },
}
export const longInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
            })
            const { errors, isSubmitted } = formState
            const [data, setData] = useState('')

            const onSubmit = (formData: FieldValues) => {
                if (args.attribute.technicalName != null) {
                    setData(formData[args.attribute.technicalName].toString())
                }
            }

            return (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <AttributeInput {...args} register={register} error={hasAttributeInputError(args.attribute, errors)} isSubmitted={isSubmitted} />
                    <Button label="Submit" type="submit" />
                    <p>{data}</p>
                </form>
            )
        }
        return <FormWrapper />
    },
    args: {
        attribute: longAttribute,
        constraints: {},
        hint: '',
    },
}

export const characterInput: Story = {
    render: ({ ...args }) => {
        const FormWrapper = () => {
            const { t } = useTranslation()
            const { handleSubmit, register, formState } = useForm({
                resolver: yupResolver(generateFormSchema([{ attributes: [args.attribute], roleList: ['EA_GARPO'] }] as AttributeProfile[], t)),
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
        attribute: characterAttribute,
        constraints: {},
        hint: '',
    },
}
