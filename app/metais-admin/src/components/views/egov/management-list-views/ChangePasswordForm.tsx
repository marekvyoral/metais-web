import { yupResolver } from '@hookform/resolvers/yup'
import { Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useChangePassword } from '@isdd/metais-common/api/generated/iam-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { TFunction } from 'i18next'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { AdminRouteNames } from '@isdd/metais-common/navigation/routeNames'

import { UserManagementFormButtons } from '@/components/views/egov/management-list-views/UserManagementFormButtons'

interface Props {
    isLoading: boolean
    isError: boolean
}

interface FormData {
    password: string
}

const schema = (t: TFunction<'translation', undefined, 'translation'>): Yup.ObjectSchema<FormData> =>
    Yup.object({
        password: Yup.string()
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
    }).defined()

export const ChangePasswordForm: React.FC<Props> = ({ isLoading, isError }) => {
    const { userId } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { setIsActionSuccess } = useActionSuccess()

    const [isLoadingPasswordChange, setIsLoadingPasswordChange] = useState(false)
    const [errorPasswordChange, setErrorPasswordChange] = useState(false)

    const changePassword = useChangePassword()

    const { register, formState, handleSubmit } = useForm<FormData>({
        resolver: yupResolver(schema(t)),
        mode: 'onChange',
    })

    const onSubmit = async ({ password }: FormData) => {
        setIsLoadingPasswordChange(true)
        setErrorPasswordChange(false)
        changePassword
            .mutateAsync({ uuid: userId || '', data: { value: password } })
            .then(() => {
                setIsActionSuccess({ value: true, path: AdminRouteNames.USER_MANAGEMENT })
                navigate(AdminRouteNames.USER_MANAGEMENT, { state: { from: location } })
            })
            .catch(() => setErrorPasswordChange(true))
            .finally(() => setIsLoadingPasswordChange(false))
    }

    return (
        <QueryFeedback
            loading={isLoading || isLoadingPasswordChange}
            indicatorProps={{ label: isLoadingPasswordChange ? t('managementList.passwordChangeInProgress') : t('loading.loadingSubPage') }}
            error={isError || errorPasswordChange}
            errorProps={{ errorMessage: errorPasswordChange ? t('managementList.passwordChangeError') : t('feedback.queryErrorMessage') }}
            withChildren
        >
            <TextHeading size="L">{t('managementList.passwordChange')} </TextHeading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register('password')}
                    label={t('managementList.newPassword')}
                    error={formState.errors.password?.message}
                    autoFocus
                    type="password"
                />
                <UserManagementFormButtons
                    handleBackNavigate={() => navigate(-1)}
                    handleResetForm={() => null}
                    isError={!!formState.errors.password}
                    saveButtonLabel={t('managementList.edit')}
                    hideCancelButton
                />
            </form>
        </QueryFeedback>
    )
}
