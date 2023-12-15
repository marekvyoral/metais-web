import { BreadCrumbs, Button, GreenCheckOutlineIcon, HomeIcon, Input, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PORTAL_URL, REGEX_EMAIL } from '@isdd/metais-common/constants'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'
import styles from '@isdd/metais-common/styles/common.module.scss'
import { LoginRouteNames, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Navigate, useNavigate } from 'react-router-dom'
import { FieldValues, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { object, string } from 'yup'
import { QueryFeedback } from '@isdd/metais-common/index'

const baseUrl = import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL
const fetchEmailData = async (email: string) => {
    const response = await fetch(`${baseUrl}/metaisiam/pass_change/request?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error()
    }

    return response.json()
}

export const ForgottenPasswordPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isError, setIsError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const {
        state: { token },
    } = useAuth()

    const schema = object().shape({
        email: string().required(t('forgottenPassword.emailRequiredError')).matches(REGEX_EMAIL, t('forgottenPassword.emailFormatError')),
    })
    const { register, handleSubmit, formState } = useForm({ resolver: yupResolver(schema) })

    const onSubmit = async (formData: FieldValues) => {
        setIsLoading(true)
        setIsError(false)
        setIsSuccess(false)

        fetchEmailData(formData?.email)
            .then(() => setIsSuccess(true))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false))
    }

    if (token) {
        return <Navigate to={RouteNames.HOME} />
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: '#', toLogin: true },
                    { label: t('breadcrumbs.forgottenPassword'), href: LoginRouteNames.FORGOTTEN_PASSWORD },
                ]}
            />
            <CenterWrapper>
                <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ label: t('forgottenPassword.sendingRequest') }} withChildren>
                    {!isSuccess && (
                        <>
                            <TextHeading size="XL">{t('forgottenPassword.heading')}</TextHeading>
                            <TextBody>{t('forgottenPassword.description')}</TextBody>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                <Input
                                    error={formState.errors.email?.message}
                                    label={t('forgottenPassword.email')}
                                    type="email"
                                    required
                                    {...register('email')}
                                />
                                <Button className={styles.noBottomMargin} label={t('forgottenPassword.button')} type="submit" />
                            </form>
                        </>
                    )}
                    {isSuccess && (
                        <>
                            <img className={styles.icon} src={GreenCheckOutlineIcon} />
                            <TextHeading className={styles.title} size="XL">
                                {t('forgottenPassword.success.title')}
                            </TextHeading>
                            <TextBody>{t('forgottenPassword.success.description')}</TextBody>
                            <Button label={t('forgottenPassword.success.button')} onClick={() => navigate(RouteNames.HOME)} />
                        </>
                    )}
                </QueryFeedback>
            </CenterWrapper>
        </>
    )
}
