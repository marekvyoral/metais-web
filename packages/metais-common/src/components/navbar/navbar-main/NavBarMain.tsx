import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'

import { NavIconGroup } from './NavIconGroup'
import { NavSearchBar } from './NavSearchBar'
import { NavLogin } from './NavLogin'
import { NewItemButtonPopup } from './NewItemButtonPopup'

import { LogoMirri } from '@isdd/metais-common/assets/images'
import styles from '@isdd/metais-common/components/navbar/navbar.module.scss'
import { PORTAL_URL } from '@isdd/metais-common/constants'
import { RegistrationRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

interface INavBarMain {
    isMenuExpanded: boolean
    setIsMenuExpanded: React.Dispatch<SetStateAction<boolean>>
    iconGroupItems?: React.FC[]
    isLoginApp?: boolean
    isAdmin?: boolean
}

export const NavBarMain: React.FC<INavBarMain> = ({ setIsMenuExpanded, isMenuExpanded, iconGroupItems, isLoginApp, isAdmin }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const location = useLocation()

    return (
        <div className="idsk-header-web__main">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column govuk-grid-column-one-quarter-from-desktop">
                        <div className="idsk-header-web__main-headline">
                            <Link to={isLoginApp ? PORTAL_URL + '/home' : '/'} title={t('navbar.linkToHomePage') ?? ''} state={{ from: location }}>
                                <img src={LogoMirri} alt={t('navbar.ministryName') ?? ''} className="idsk-header-web__main-headline-logo" />
                            </Link>

                            <NavIconGroup isMobile />

                            <button
                                onClick={() => setIsMenuExpanded((prev) => !prev)}
                                className="idsk-button idsk-header-web__main-headline-menu-button"
                                aria-label={isMenuExpanded ? t('navbar.closeMenu') ?? '' : t('navbar.openMenu') ?? ''}
                                aria-expanded={isMenuExpanded}
                                data-text-for-show={t('navbar.openMenu') ?? ''}
                                data-text-for-hide={t('navbar.closeMenu') ?? ''}
                            >
                                {t('navbar.menu')}
                                <span className="idsk-header-web__menu-open" />
                                <span className="idsk-header-web__menu-close" />
                            </button>
                        </div>
                    </div>

                    <div className={classNames('govuk-grid-column-full', { [styles.center]: isAdmin })}>
                        <div className="idsk-header-web__main-action">
                            {isAdmin ? <div className={styles.fullWidth} /> : <NavSearchBar />}
                            <NavIconGroup isMobile={false} iconGroupItems={iconGroupItems} />

                            <div className="idsk-header-web__main--buttons">
                                {user ? (
                                    !isAdmin && <NewItemButtonPopup />
                                ) : (
                                    <Link
                                        className="govuk-link"
                                        to={isLoginApp ? PORTAL_URL + RegistrationRoutes.REGISTRATION : RegistrationRoutes.REGISTRATION}
                                        state={{ from: location }}
                                        style={{ marginLeft: 10 }}
                                    >
                                        {t('navbar.registration')}
                                    </Link>
                                )}
                            </div>
                            <div className="idsk-header-web__main--buttons">
                                <NavLogin isLoginApp={isLoginApp} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
