import React from 'react'
import { BreadCrumbs, Button, HomeIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { PORTAL_URL } from '@isdd/metais-common/constants'
import { CenterWrapper } from '@isdd/metais-common/components/center-wrapper/CenterWrapper'

import styles from '@/styles/commonStyles.module.scss'
import { LoginRouteNames } from '@/navigation/Router'

export const PreloginPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: PORTAL_URL, icon: HomeIcon },
                    { label: t('breadcrumbs.prelogin'), href: LoginRouteNames.PRE_LOGIN },
                ]}
            />
            <CenterWrapper>
                <TextHeading size="XL">{t('prelogin.heading')}</TextHeading>
                <div className={styles.borderBottom}>
                    <TextHeading size="S">{t('prelogin.nameAndPassword')}</TextHeading>
                    <TextBody className={styles.darkGrey}>{t('prelogin.nameAndPasswordDescription')}</TextBody>
                    <Button label={t('navbar.login')} variant="secondary" onClick={() => navigate(LoginRouteNames.LOGIN)} />
                </div>
                <div>
                    <TextHeading size="S">{t('prelogin.eID')}</TextHeading>
                    <TextBody className={styles.darkGrey}>{t('prelogin.eIDDescription')}</TextBody>
                    <Button label={t('navbar.login')} variant="secondary" disabled onClick={() => navigate(LoginRouteNames.LOGIN)} />
                </div>
            </CenterWrapper>
        </>
    )
}
