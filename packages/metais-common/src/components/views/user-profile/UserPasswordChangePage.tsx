import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Input, LoadingIndicator } from '@isdd/idsk-ui-kit'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import classNames from 'classnames'

import styles from './user-informations/userInformation.module.scss'

import { MutationFeedback } from '@isdd/metais-common/components/mutation-feedback/MutationFeedback'
import { useChangePassword1Hook } from '@isdd/metais-common/api/generated/iam-swagger'
import { ReponseErrorCodeEnum } from '@isdd/metais-common/constants'

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
            .min(8, t('validation.minCharacters', { itemName: t('userProfile.newPassword'), min: 8 }))
            .max(20, t('validation.maxCharacters', { itemName: t('userProfile.newPassword'), max: 20 }))
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
                then: (schema) => schema.required().oneOf([Yup.ref('newPassword')], t('validation.repeatPassword')),
            })
            .required(t('validation.required'))
            .defined(),
    }).defined()

export const UserPasswordChangePage = () => {
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)
    const { t } = useTranslation()
    const changePassword = useChangePassword1Hook()
    const { register, formState, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(yupSchema(t)),
        mode: 'onChange',
    })
    const onSubmit = (formData: FormData) => {
        setIsLoading(true)
        changePassword({ newPassword: formData.newPassword, oldPassword: formData.oldPassword })
            .then(() => setIsSuccess(true))
            .catch((err) => {
                ReponseErrorCodeEnum.WRONG_OLD_PASSWORD == JSON.parse(err.message).message
                    ? setError(t(`feedback.WRONG_OLD_PASSWORD`))
                    : setError(t('feedback.mutationErrorMessage'))
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classNames({ [styles.positionRelative]: isLoading })}>
            {isLoading && <LoadingIndicator />}
            <MutationFeedback
                success={isSuccess}
                error={error}
                successMessage={t('feedback.passwordChanged')}
                onMessageClose={() => setIsSuccess(false)}
            />
            <Input {...register('oldPassword')} label={t('userProfile.oldPassword')} error={formState.errors.oldPassword?.message} type="password" />
            <Input {...register('newPassword')} label={t('userProfile.newPassword')} error={formState.errors.newPassword?.message} type="password" />
            <Input
                {...register('newPasswordRepeat')}
                label={t('userProfile.repeatPassword')}
                error={formState.errors.newPasswordRepeat?.message}
                type="password"
            />
            <Button label={t('userProfile.save')} type="submit" />
        </form>
    )
}
