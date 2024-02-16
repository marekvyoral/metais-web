import { AlertTriangleIcon, Button, TextBody, TextHeading } from '@isdd/idsk-ui-kit/index'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { metaisEmail } from '@isdd/metais-common/constants'

import styles from './registration.module.scss'

export const RegistrationFailed = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            <img className={styles.icon} src={AlertTriangleIcon} alt="" />
            <TextHeading className={styles.title} size="XL">
                {t('registration.failed.title')}
            </TextHeading>
            <div className={(styles.column, 'govuk-warning-text')}>
                <TextBody>{t('registration.failed.description')}</TextBody>
                <strong>
                    <Link to={`mailto:${metaisEmail}`}>{metaisEmail}</Link>
                </strong>
            </div>
            <Button label={t('registration.failed.button')} onClick={() => navigate(RegistrationRoutes.REGISTRATION)} />
        </>
    )
}
