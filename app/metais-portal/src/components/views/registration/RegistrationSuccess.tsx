import { Button, GreenCheckOutlineIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import styles from './registration.module.scss'

export const RegistrationSuccess = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <img className={styles.icon} src={GreenCheckOutlineIcon} />
            <TextHeading className={styles.title} size="XL">
                {t('registration.success.title')}
            </TextHeading>
            <TextBody>{t('registration.success.description')}</TextBody>
            <Button label={t('registration.success.button')} onClick={() => navigate(RouteNames.HOME)} />
        </>
    )
}
