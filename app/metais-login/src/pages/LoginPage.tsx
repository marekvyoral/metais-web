import React from 'react'
import { BreadCrumbs, Button, ButtonLink, HomeIcon, Input, TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_ERROR, PORTAL_URL } from '@isdd/metais-common/constants'

import styles from '@/styles/commonStyles.module.scss'
import { LoginRouteNames } from '@/navigation/Router'
import { CenterWrapper } from '@/components/center-wrapper/CenterWrapper'

enum LoginFields {
    NAME = 'name',
    PASSWORD = 'password',
}

export const LoginPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const hasError = location.search == LoginRouteNames.ERROR

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: LoginRouteNames.PRE_LOGIN },
                    { label: t('breadcrumbs.login'), href: LoginRouteNames.LOGIN },
                ]}
            />
            <CenterWrapper>
                <TextHeading size="XL">{t('login.heading')}</TextHeading>
                {/**action url based on http://iam-oidc-metais3.apps.dev.isdd.sk/login current page form */}
                <form action={'/login'} method="post">
                    <Input
                        error={hasError ? t('login.nameError') ?? DEFAULT_ERROR : ''}
                        label={t('login.name') ?? ''}
                        name={LoginFields.NAME}
                        type="text"
                        required
                    />
                    <Input
                        error={hasError ? t('login.passwordError') ?? DEFAULT_ERROR : ''}
                        label={t('login.password') ?? ''}
                        name={LoginFields.PASSWORD}
                        type="password"
                        required
                    />
                    <div className={styles.buttonGroup}>
                        <Button className={styles.noBottomMargin} label={t('navbar.login')} type="submit" />
                        <ButtonLink
                            className={styles.blue}
                            type="button"
                            label={t('login.forgottenPassword')}
                            onClick={() => navigate(LoginRouteNames.FORGOTTEN_PASSWORD)}
                        />
                        <ButtonLink
                            className={styles.grey}
                            type="button"
                            label={t('login.loginProblems')}
                            onClick={() => navigate(LoginRouteNames.LOGIN_PROBLEMS)}
                        />
                    </div>
                </form>
            </CenterWrapper>
        </>
    )
}
