import { AlertTriangleIcon, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { metaisEmail } from '@isdd/metais-common/constants'

import styles from './registration.module.scss'

export const RegistrationFailed = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <img className={styles.icon} src={AlertTriangleIcon} />
            <TextHeading className={styles.title} size="XL">
                {t('registration.failed.title')}
            </TextHeading>
            <TextBody>
                <Trans i18nKey="registration.failed.description" components={{ email: <Link to={`mailto:${metaisEmail}}`} /> }} />
            </TextBody>
            <Button label={t('registration.failed.button')} onClick={() => navigate(RegistrationRoutes.REGISTRATION)} />
        </>
    )
}
