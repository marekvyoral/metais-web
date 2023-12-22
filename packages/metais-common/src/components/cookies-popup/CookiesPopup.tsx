import { Button, NavigationCloseIcon, TextBody } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next'

import styles from './styles.module.scss'

import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { COOKIES_CONSENT } from '@isdd/metais-common/src/api/constants'

export const CookiesPopup: React.FC = () => {
    const { t } = useTranslation()
    const cookies = new Cookies()
    const [isShown, setIsShown] = useState(!cookies.get(COOKIES_CONSENT))

    const setAccept = () => {
        const date = new Date()
        date.setMonth(date.getMonth() + 1)
        cookies.set(COOKIES_CONSENT, true, { expires: date })
        setIsShown(false)
    }

    return isShown ? (
        <StickyBox bottom offsetBottom={0} className={styles.stickyStyles}>
            <div className={styles.popupBoxStyle}>
                <TextBody className={styles.marginBottom0}>{t('cookies.thisPageUsesCookies')} </TextBody>
                <Button label={t('cookies.accept')} bottomMargin={false} onClick={() => setAccept()} />
                <Link to={FooterRouteNames.GDPR_AND_COOKIES}>
                    <TextBody className={styles.marginBottom0}>{t('cookies.moreInfo')} </TextBody>
                </Link>
                <button className={styles.closeButton} onClick={() => setIsShown(false)}>
                    <img src={NavigationCloseIcon} alt="navigation-close" />
                </button>
            </div>
        </StickyBox>
    ) : null
}
