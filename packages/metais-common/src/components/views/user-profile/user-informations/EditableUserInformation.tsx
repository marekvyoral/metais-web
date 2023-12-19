import React, { Dispatch, SetStateAction } from 'react'
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
    PHONE = 'phone',
    POSITION = 'position',
    EMAIL = 'email',
}

type Props = {
    setIsEditable: Dispatch<SetStateAction<boolean>>
    setIsChangeSuccess: Dispatch<SetStateAction<boolean>>
}

type UserInformationForm = {
    name?: string
    email?: string
    phone?: string
    position?: string
}

export const EditableUserInformation: React.FC<Props> = ({ setIsEditable, setIsChangeSuccess }) => {
    const { t } = useTranslation()
    const {
        state: { user, token },
    } = useAuth()
    const queryClient = useQueryClient()

    const userInformationsSchema: ObjectSchema<UserInformationForm> = object().shape({
        [UserInformationFormKeysEnum.NAME]: string().required(t('validation.required')),
        [UserInformationFormKeysEnum.EMAIL]: string().email(t('validation.invalidEmail')).required(t('validation.required')),
        [UserInformationFormKeysEnum.PHONE]: string().matches(REGEX_TEL, t('validation.invalidPhone')).required(t('validation.required')),
        [UserInformationFormKeysEnum.POSITION]: string(),
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
            [UserInformationFormKeysEnum.PHONE]: user?.phone,
            [UserInformationFormKeysEnum.EMAIL]: user?.email,
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
        },
    })
    const handleCancel = () => {
        setIsEditable(false)
        reset()
    }

    const onSubmit = (formData: UserInformationForm) => {
        setIsChangeSuccess(false)
        changeUserInformation({ data: { email: formData.email, phone: formData.phone, disabledNotifications: false } })
    }

    return (
        <>
            <MutationFeedback success={false} error={isError ? t('userProfile.changedUserInformationError') : ''} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.justifyEndDiv}>
                    <SubmitWithFeedback submitButtonLabel={t('userProfile.save')} loading={isLoading || isSubmitting || isValidating} />
                </div>
                <DefinitionList className={styles.dl}>
                    <InformationGridRow
                        label={t('userProfile.information.name') + ':'}
                        value={<Input error={errors.name?.message} label="" type="text" disabled {...register(UserInformationFormKeysEnum.NAME)} />}
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
                        value={<Input error={errors.phone?.message} label="" type="number" {...register(UserInformationFormKeysEnum.PHONE)} />}
                        hideIcon
                    />
                    <InformationGridRow
                        label={t('userProfile.information.email') + ':'}
                        value={<Input error={errors.email?.message} label="" type="email" {...register(UserInformationFormKeysEnum.EMAIL)} />}
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
