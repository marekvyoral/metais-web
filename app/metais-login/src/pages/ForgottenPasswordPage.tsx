import { BreadCrumbs, Button, HomeIcon, Input, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_ERROR, PORTAL_URL } from '@isdd/metais-common/constants'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'

import styles from '@/styles/commonStyles.module.scss'
import { LoginRouteNames } from '@/navigation/Router'

enum ForgottenPasswordFields {
    EMAIL = 'email',
}

export const ForgottenPasswordPage = () => {
    const { t } = useTranslation()
    const hasError = location.search == LoginRouteNames.ERROR

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: LoginRouteNames.PRE_LOGIN },
                    { label: t('breadcrumbs.login'), href: LoginRouteNames.LOGIN },
                    { label: t('breadcrumbs.forgottenPassword'), href: LoginRouteNames.FORGOTTEN_PASSWORD },
                ]}
            />
            <CenterWrapper>
                <TextHeading size="XL">{t('forgottenPassword.heading')}</TextHeading>
                <TextBody>{t('forgottenPassword.description')}</TextBody>
                {/**action url TODO*/}
                <form action={'/reset-password'} method="post">
                    <Input
                        error={hasError ? t('forgottenPassword.emailError') ?? DEFAULT_ERROR : ''}
                        label={t('forgottenPassword.email') ?? ''}
                        name={ForgottenPasswordFields.EMAIL}
                        type="email"
                        required
                    />

                    <Button className={styles.noBottomMargin} label={t('forgottenPassword.button')} type="submit" />
                </form>
            </CenterWrapper>
        </>
    )
}
