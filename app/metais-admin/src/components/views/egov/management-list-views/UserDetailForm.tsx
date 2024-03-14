import { Input, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { UserManagementFormButtons } from './UserManagementFormButtons'
import { FIRST_NAME_MAXIMUM_CHARS, LAST_NAME_MAXIMUM_CHARS } from './userManagementFormSchema'

interface Props {
    userData: Identity | undefined
    handleBackNavigate: () => void
    handleResetForm: () => void
    isCreate: boolean
}

export enum InputNames {
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    LOGIN = 'login',
    POSITION = 'position',
    MOBILE = 'mobile',
}

export const UserDetailForm: React.FC<Props> = ({ userData, handleBackNavigate, isCreate, handleResetForm }) => {
    const { t } = useTranslation()

    const { register, formState, watch, clearErrors } = useFormContext()
    const { errors, isSubmitted } = formState

    const loginWatch = watch(InputNames.LOGIN)

    useEffect(() => {
        if (loginWatch) {
            clearErrors(InputNames.LOGIN)
        }
    }, [clearErrors, loginWatch])

    return (
        <>
            <TextHeading size="L">{isCreate ? t('managementList.detailCreateHeading') : t('managementList.detailEditHeading')}</TextHeading>
            <Input
                label={t('managementList.firstName')}
                error={errors[InputNames.FIRST_NAME]?.message?.toString()}
                correct={!errors[InputNames.FIRST_NAME] && isSubmitted}
                {...register(InputNames.FIRST_NAME)}
                defaultValue={userData?.firstName}
                type="text"
                maxLength={FIRST_NAME_MAXIMUM_CHARS}
            />
            <Input
                error={errors[InputNames.LAST_NAME]?.message?.toString()}
                label={t('managementList.lastName')}
                correct={!errors[InputNames.LAST_NAME] && isSubmitted}
                {...register(InputNames.LAST_NAME)}
                type="text"
                maxLength={LAST_NAME_MAXIMUM_CHARS}
            />
            <Input
                error={errors[InputNames.LOGIN]?.message?.toString()}
                label={t('managementList.loginEmail')}
                correct={!errors[InputNames.LOGIN] && isSubmitted && (isCreate || !!userData?.login)}
                disabled={!isCreate}
                {...register(InputNames.LOGIN)}
                defaultValue={isCreate ? undefined : userData?.login}
                type="email"
                hint={t('managementList.emailFormatHint')}
            />
            <Input
                error={errors[InputNames.POSITION]?.message?.toString()}
                label={t('managementList.position')}
                correct={!errors[InputNames.POSITION] && isSubmitted}
                {...register(InputNames.POSITION)}
                defaultValue={userData?.position}
                type="text"
            />
            <Input
                error={errors[InputNames.MOBILE]?.message?.toString()}
                label={t('managementList.mobile')}
                correct={!errors[InputNames.MOBILE] && isSubmitted}
                {...register(InputNames.MOBILE)}
                defaultValue={userData?.mobile}
                type="tel"
            />

            <UserManagementFormButtons handleBackNavigate={handleBackNavigate} handleResetForm={handleResetForm} hideCancelButton={!isCreate} />
        </>
    )
}
