import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input } from '@isdd/idsk-ui-kit'
import { TFunction } from 'i18next'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

import { useAuth } from '@/contexts/auth/authContext'
import { useChangePassword } from '@/api/generated/iam-swagger'

interface FormData {
    oldPassword: string
    newPassword: string
    newPasswordRepeat: string
}

const yupSchema = (t: TFunction<'translation', undefined, 'translation'>): Yup.ObjectSchema<FormData> =>
    Yup.object({
        oldPassword: Yup.string().trim().required(t('validation.required')).defined(),
        newPassword: Yup.string()
            .trim()
            .required(t('validation.required'))
            .min(8, t('validation.minCharacters', { itemName: t('managementList.password'), min: 8 }))
            .max(20, t('validation.maxCharacters', { itemName: t('managementList.password'), max: 20 }))
            .test('password', t('validation.password'), (value) => {
                // Check if the password meets the criteria
                if (!/[A-Z]/.test(value)) return false // Check for at least one uppercase character
                if (!/[a-z]/.test(value)) return false // Check for at least one lowercase character
                if (!/[^a-zA-Z]/.test(value)) return false // Check for at least one other character (not a letter)
                return true // All conditions met
            }),
        newPasswordRepeat: Yup.string()
            .trim()
            .when('newPassword', {
                is: (val: string) => val !== '',
                then: (schema) => schema.required().oneOf([Yup.ref('newPassword')]),
            })
            .defined(),
    }).defined()

export const UserPasswordChangePage = () => {
    const { t } = useTranslation()
    const changePassword = useChangePassword()
    const { state } = useAuth()

    const { register, formState, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(yupSchema(t)),
        mode: 'onChange',
    })

    const onSubmit = async ({ newPassword }: FormData) => {
        changePassword.mutateAsync({ uuid: state.user?.uuid || '', data: { value: newPassword } })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register('oldPassword')}
                label={t('managementList.oldPassword')}
                error={formState.errors.oldPassword?.message}
                autoFocus
                type="password"
            />
            <Input
                {...register('newPassword')}
                label={t('managementList.oldPassword')}
                error={formState.errors.newPassword?.message}
                autoFocus
                type="password"
            />
            <Input
                {...register('newPasswordRepeat')}
                label={t('managementList.oldPassword')}
                error={formState.errors.newPasswordRepeat?.message}
                autoFocus
                type="password"
            />
            <Button label="save" />
        </form>
    )
}
