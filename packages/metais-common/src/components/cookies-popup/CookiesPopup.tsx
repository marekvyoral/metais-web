import { Button, NavigationCloseIcon, TextBody, TextHeading } from '@isdd/idsk-ui-kit'
import React, { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import StickyBox from 'react-sticky-box'
import Cookies from 'universal-cookie'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'

import styles from './styles.module.scss'

import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { COOKIES_TYPES } from '@isdd/metais-common/src/api/constants'
import { useWindowWidthBreakpoints } from '@isdd/metais-common/src/hooks/window-size/useWindowWidthBreakpoints'

export const setCookiesConsent = (cookies: Cookies, values: { [key in COOKIES_TYPES]: boolean }, onCookiesSet?: () => void) => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    cookies.set(COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT, values[COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT], { expires: date })
    cookies.set(COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT, values[COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT], { expires: date })
    cookies.set(COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT, values[COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT], { expires: date })
    onCookiesSet && onCookiesSet()
}

export const CookiesPopup: React.FC = () => {
    const { t } = useTranslation()
    const cookies = new Cookies()
    const windowWidth = useWindowWidthBreakpoints()
    const headerId = useId()
    const getIsShownCookies = () => {
        if (
            cookies.get(COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT) == undefined &&
            cookies.get(COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT) == undefined &&
            cookies.get(COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT) == undefined
        ) {
            return true
        }
        return false
    }
    const [isShown, setIsShown] = useState(getIsShownCookies())

    useEffect(() => {
        const cookieChangeListener = () => {
            setIsShown(getIsShownCookies())
        }

        cookies.addChangeListener(cookieChangeListener)

        return () => {
            cookies.removeChangeListener(cookieChangeListener)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return isShown ? (
        <StickyBox bottom offsetBottom={0} className={styles.stickyStyles}>
            <div className={styles.popupBoxStyle} tabIndex={1} role="region" aria-labelledby={headerId}>
                <div className={styles.flexMobileClose} id={headerId}>
                    <TextHeading className={classNames(styles.marginBottom0)} size={'S'}>
                        {t('cookies.thisPageUsesCookies1')}
                        <Link to={FooterRouteNames.COOKIES}>
                            <TextBody className={styles.marginBottom0}>{t('cookies.thisPageUsesCookies2')} </TextBody>
                        </Link>
                    </TextHeading>
                    {windowWidth && !windowWidth.desktop && (
                        <button className={styles.closeButton} onClick={() => setIsShown(false)} aria-label={t('close')}>
                            <img src={NavigationCloseIcon} alt="" />
                        </button>
                    )}
                </div>
                <Button
                    label={t('cookies.settings.refuseAll')}
                    bottomMargin={false}
                    onClick={() =>
                        setCookiesConsent(cookies, {
                            [COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT]: false,
                            [COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT]: false,
                            [COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT]: false,
                        })
                    }
                    autoFocus
                />
                <Button
                    label={t('cookies.settings.acceptAll')}
                    bottomMargin={false}
                    onClick={() =>
                        setCookiesConsent(
                            cookies,
                            {
                                [COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT]: true,
                                [COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT]: true,
                                [COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT]: true,
                            },
                            () => setIsShown(false),
                        )
                    }
                />
                <Link to={FooterRouteNames.COOKIES_SETTINGS}>
                    <TextBody className={styles.marginBottom0}>{t('cookies.settings.heading')} </TextBody>
                </Link>
                {windowWidth && windowWidth.desktop && (
                    <button className={styles.closeButton} onClick={() => setIsShown(false)} aria-label={t('close')}>
                        <img src={NavigationCloseIcon} />
                    </button>
                )}
            </div>
        </StickyBox>
    ) : null
}
