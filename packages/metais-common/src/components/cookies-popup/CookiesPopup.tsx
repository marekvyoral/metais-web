import { Button, ButtonGroupRow, GridRow, TextBody, TextHeading, GridCol } from '@isdd/idsk-ui-kit'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { Trans, useTranslation } from 'react-i18next'

import { FooterRouteNames } from '@isdd/metais-common/navigation/routeNames'
import { COOKIES_TYPES } from '@isdd/metais-common/src/api/constants'

export const setCookiesConsent = (cookies: Cookies, values: { [key in COOKIES_TYPES]: boolean }, onCookiesSet?: () => void) => {
    const date = new Date()
    date.setMonth(date.getMonth() + 1)
    cookies.set(COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT, values[COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT], { expires: date })
    cookies.set(COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT, values[COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT], { expires: date })
    cookies.set(COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT, values[COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT], { expires: date })
    onCookiesSet && onCookiesSet()
}

enum States {
    'DEFAULT',
    'ACCEPT',
    'DECLINE',
}

export const CookiesPopup: React.FC = () => {
    const { t } = useTranslation()
    const cookies = new Cookies()
    const getIsShownCookies = () => {
        return (
            cookies.get(COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT) === undefined &&
            cookies.get(COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT) === undefined &&
            cookies.get(COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT) === undefined
        )
    }
    const [isShown, setIsShown] = useState(getIsShownCookies())
    const [bannerState, setBannerState] = useState<States>(States.DEFAULT)

    return isShown ? (
        <div className="idsk-cookie-banner govuk-!-padding-top-4" role="region" aria-label={t('cookies.heading')}>
            {bannerState === States.DEFAULT && (
                <div className="idsk-cookie-banner__message govuk-width-container">
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <TextHeading size="L">{t('cookies.heading')}</TextHeading>
                            <div className="idsk-cookie-banner__content">
                                <TextBody>{t('cookies.thisPageUsesCookies1')}</TextBody>
                                <TextBody>{t('cookies.thisPageUsesCookies2')}</TextBody>
                            </div>
                        </GridCol>
                    </GridRow>
                    <ButtonGroupRow className="idsk-button-group">
                        <Button
                            label={t('cookies.settings.acceptAll')}
                            onClick={() => {
                                setCookiesConsent(cookies, {
                                    [COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT]: true,
                                    [COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT]: true,
                                    [COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT]: true,
                                })
                                setBannerState(States.ACCEPT)
                            }}
                        />
                        <Button
                            label={t('cookies.settings.refuseAll')}
                            onClick={() => {
                                setCookiesConsent(cookies, {
                                    [COOKIES_TYPES.NECESSARILY_COOKIES_CONSENT]: false,
                                    [COOKIES_TYPES.ANALYTICALLY_COOKIES_CONSENT]: false,
                                    [COOKIES_TYPES.PREFERENTIAL_COOKIES_CONSENT]: false,
                                })
                                setBannerState(States.DECLINE)
                            }}
                        />
                        <Link className="govuk-link" to={FooterRouteNames.COOKIES_SETTINGS}>
                            {t('cookies.settings.heading')}
                        </Link>
                    </ButtonGroupRow>
                </div>
            )}

            {(bannerState === States.ACCEPT || bannerState === States.DECLINE) && (
                <div className="idsk-cookie-banner__message idsk-cookie-banner__example govuk-width-container" role="alert">
                    <GridRow>
                        <GridCol setWidth="two-thirds">
                            <div className="idsk-cookie-banner__content">
                                <TextBody>
                                    <Trans
                                        i18nKey={`cookies.settings.${bannerState === States.ACCEPT ? 'accepted' : 'declined'}`}
                                        components={[<Link key="link" to={FooterRouteNames.COOKIES_SETTINGS} className="govuk-link" />]}
                                    />
                                </TextBody>
                            </div>
                        </GridCol>
                    </GridRow>
                    <ButtonGroupRow>
                        <Button onClick={() => setIsShown(false)} label={t('cookies.settings.dismiss')} />
                    </ButtonGroupRow>
                </div>
            )}
        </div>
    ) : null
}
