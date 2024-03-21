import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input } from '@isdd/idsk-ui-kit/index'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema, object, string } from 'yup'
import { useQueryClient } from '@tanstack/react-query'

import styles from './userInformation.module.scss'

import { useChangeIdentityProfile } from '@isdd/metais-common/api/generated/iam-swagger'
import { MutationFeedback, SubmitWithFeedback } from '@isdd/metais-common/index'
import { InformationGridRow } from '@isdd/metais-common/components/info-grid-row/InformationGridRow'
import { DefinitionList } from '@isdd/metais-common/components/definition-list/DefinitionList'
import { NULL, REGEX_TEL, USER_INFO_QUERY_KEY } from '@isdd/metais-common/constants'
import { User, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

enum UserInformationFormKeysEnum {
    NAME = 'name',
    MOBILE = 'mobile',
    POSITION = 'position',
    EMAIL = 'email',
}

type Props = {
    setIsEditable: Dispatch<SetStateAction<boolean>>
    setIsChangeSuccess: Dispatch<SetStateAction<boolean>>
}

type UserInformationForm = {
    name?: string
    mobile?: string
    position?: string
    email?: string
}

export const EditableUserInformation: React.FC<Props> = ({ setIsEditable, setIsChangeSuccess }) => {
    const { t } = useTranslation()
    const {
        state: { user, token },
    } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')
    const queryClient = useQueryClient()

    const userInformationsSchema: ObjectSchema<UserInformationForm> = object().shape({
        [UserInformationFormKeysEnum.NAME]: string().required(t('validation.required')),
        [UserInformationFormKeysEnum.MOBILE]: string().matches(REGEX_TEL, t('validation.invalidPhone')).required(t('validation.required')),
        [UserInformationFormKeysEnum.POSITION]: string(),
        [UserInformationFormKeysEnum.EMAIL]: string().required(t('validation.required')),
    })

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<UserInformationForm>({
        defaultValues: {
            [UserInformationFormKeysEnum.NAME]: user?.displayName,
            [UserInformationFormKeysEnum.POSITION]: user?.position != NULL ? user?.position ?? '' : '',
            [UserInformationFormKeysEnum.MOBILE]: user?.mobile,
            [UserInformationFormKeysEnum.EMAIL]: user?.login,
        },
        resolver: yupResolver(userInformationsSchema),
    })

    const {
        mutate: changeUserInformation,
        isLoading,
        isError,
    } = useChangeIdentityProfile({
        mutation: {
            onSuccess(data, context) {
                setIsEditable(false)
                setIsChangeSuccess(true)
                queryClient.setQueryData([USER_INFO_QUERY_KEY, token], (oldData: { data: User; statusCode: number } | undefined) => {
                    if (oldData == null) return oldData

                    return { data: { ...oldData.data, ...context.data }, statusCode: oldData.statusCode }
                })
            },
            onError() {
                setErrorMessage(t('userProfile.changedUserInformationError'))
            },
        },
    })
    const handleCancel = () => {
        setIsEditable(false)
        reset()
    }

    const onSubmit = (formData: UserInformationForm) => {
        setIsChangeSuccess(false)
        changeUserInformation({ data: { mobile: formData.mobile, disabledNotifications: false, email: formData.email } })
    }

    return (
        <>
            <MutationFeedback error={isError} errorMessage={errorMessage} />
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.justifyEndDiv}>
                    <SubmitWithFeedback submitButtonLabel={t('userProfile.save')} loading={isLoading || isSubmitting || isValidating} />
                </div>
                <DefinitionList className={styles.dl}>
                    <InformationGridRow
                        label={t('userProfile.information.name') + ':'}
                        value={
                            <Input
                                error={errors.name?.message}
                                label=""
                                type="text"
                                disabled
                                {...register(UserInformationFormKeysEnum.NAME)}
                                autoComplete="name"
                            />
                        }
                        hideIcon
                    />
                    <InformationGridRow
                        label={t('userProfile.information.position') + ':'}
                        value={
                            <Input
                                error={errors.position?.message}
                                label=""
                                type="text"
                                disabled
                                {...register(UserInformationFormKeysEnum.POSITION)}
                            />
                        }
                        hideIcon
                    />
                    <InformationGridRow
                        label={t('userProfile.information.phoneNumber') + ':'}
                        value={
                            <Input
                                error={errors.mobile?.message}
                                label=""
                                type="tel"
                                {...register(UserInformationFormKeysEnum.MOBILE)}
                                autoComplete="tel"
                            />
                        }
                        hideIcon
                    />
                    <InformationGridRow
                        label={`${t('userProfile.information.loginEmail')}:`}
                        value={
                            <Input
                                error={errors.email?.message}
                                label=""
                                type="text"
                                disabled
                                {...register(UserInformationFormKeysEnum.EMAIL)}
                                autoComplete="email"
                            />
                        }
                        hideIcon
                    />
                </DefinitionList>
                <SubmitWithFeedback
                    submitButtonLabel={t('userProfile.save')}
                    additionalButtons={[
                        <Button variant="secondary" label={t('userProfile.cancel')} key="cancel" type="reset" onClick={handleCancel} />,
                    ]}
                    loading={isLoading || isSubmitting || isValidating}
                />
            </form>
        </>
    )
}
